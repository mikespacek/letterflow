from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import json
import os
import io
import re
import csv
import time
from typing import List, Dict, Optional, Any, Union
import shutil
from pathlib import Path
import statistics
import unicodedata
import uuid
from datetime import datetime

# Create necessary directories
os.makedirs("data", exist_ok=True)
os.makedirs("templates", exist_ok=True)
os.makedirs("processed", exist_ok=True)

app = FastAPI(title="Real Estate Letter Generator API")

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you would specify your frontend domain here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models for request/response data
class TemplateBase(BaseModel):
    name: str
    content: str
    category: str = "all"  # 'owner', 'renter', 'investor', or 'all'
    
class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    id: str
    created_at: str
    
class ProcessingStats(BaseModel):
    total: int
    owner_occupied: int
    renter_occupied: int
    investor: int
    unknown: int
    
class ProcessingResult(BaseModel):
    success: bool
    message: str
    file_id: Optional[str] = None
    stats: Optional[ProcessingStats] = None

# Utility functions
def detect_delimiter(file_content):
    """Automatically detect the delimiter in a CSV file."""
    # Try to detect the delimiter by analyzing a sample of the file
    sample = file_content[:5000]  # Read the first 5000 bytes as a sample
    dialect = csv.Sniffer().sniff(sample.decode('utf-8', errors='ignore'))
    return dialect.delimiter

def normalize_address(address):
    """Normalize an address to make comparison easier."""
    if not address or not isinstance(address, str):
        return ""
    
    # Convert to lowercase
    address = address.lower()
    
    # Remove apartment/unit numbers (common formats)
    address = re.sub(r'\bap[a-z]*\.?\s*#?\s*\d+', '', address)
    address = re.sub(r'\bunit\s*#?\s*\d+', '', address)
    address = re.sub(r'\bapt\s*#?\s*\d+', '', address)
    address = re.sub(r'\b#\s*\d+', '', address)
    
    # Remove common suffixes and abbreviations
    address = re.sub(r'\b(street|avenue|boulevard|drive|court|lane|road|place|way|circle|terrace|parkway)\b', '', address)
    address = re.sub(r'\b(st|ave|blvd|dr|ct|ln|rd|pl|wy|cir|ter|pkwy)\b\.?', '', address)
    
    # Remove all punctuation and extra whitespace
    address = re.sub(r'[^\w\s]', '', address)
    address = re.sub(r'\s+', ' ', address).strip()
    
    # Remove common words that don't help in matching
    address = re.sub(r'\b(north|south|east|west|n|s|e|w)\b', '', address)
    
    # Remove numbers at the end that might be zip codes
    address = re.sub(r'\b\d{5}(?:-\d{4})?\b', '', address)
    
    return address.strip()

def addresses_match(addr1, addr2, threshold=0.8):
    """Check if two addresses match using normalized comparison."""
    if not addr1 or not addr2:
        return False
        
    norm_addr1 = normalize_address(addr1)
    norm_addr2 = normalize_address(addr2)
    
    # If one is contained within the other after normalization
    if norm_addr1 in norm_addr2 or norm_addr2 in norm_addr1:
        return True
    
    # Calculate similarity
    # Simple implementation - in production you might use more sophisticated 
    # algorithms like Levenshtein distance or specialized address parsing libraries
    common_words = set(norm_addr1.split()) & set(norm_addr2.split())
    total_words = set(norm_addr1.split()) | set(norm_addr2.split())
    
    if not total_words:
        return False
        
    similarity = len(common_words) / len(total_words)
    return similarity >= threshold

def parse_name(full_name):
    """
    Parse a name into first and last name components.
    Handles various formats including business entities.
    """
    if not full_name or not isinstance(full_name, str):
        return {"first_name": "", "last_name": "", "is_business": False, "original": ""}
    
    # Clean the name
    name = full_name.strip()
    original = name
    
    # Check if it's likely a business
    business_indicators = [
        'llc', 'inc', 'corporation', 'corp', 'trust', 'properties',
        'investments', 'associates', 'rentals', 'management', 'company',
        'partners', 'holdings', 'group', 'enterprise', 'services'
    ]
    
    lower_name = name.lower()
    is_business = any(indicator in lower_name for indicator in business_indicators)
    
    # If it looks like a business, return it as-is for the last name
    if is_business:
        return {
            "first_name": "",
            "last_name": name,
            "is_business": True,
            "original": original
        }
    
    # Handle "Last, First" format
    if ',' in name:
        parts = name.split(',', 1)
        last_name = parts[0].strip()
        remaining = parts[1].strip()
        
        # Handle cases like "Smith, John & Jane"
        if '&' in remaining or ' and ' in remaining.lower():
            connectors = ['&', ' and ', ' And ', ' AND ']
            for connector in connectors:
                if connector in remaining:
                    first_names = remaining.split(connector)
                    first_name = first_names[0].strip()
                    # For simplicity, we're using just the first person's name
                    break
            else:
                first_name = remaining
        else:
            first_name = remaining
            
        return {
            "first_name": first_name,
            "last_name": last_name,
            "is_business": False,
            "original": original
        }
    
    # Handle standard "First Last" format or multiple names with connectors
    connectors = [' & ', ' and ', ' + ', ' AND ', ' And ']
    for connector in connectors:
        if connector in name:
            # Split on the first connector only
            parts = name.split(connector, 1)
            # Assume the first part is a complete name
            first_part = parts[0].strip()
            if ' ' in first_part:
                name_parts = first_part.split()
                first_name = ' '.join(name_parts[:-1])
                last_name = name_parts[-1]
                return {
                    "first_name": first_name,
                    "last_name": last_name,
                    "is_business": False,
                    "original": original
                }
            break
    
    # Standard "First Last" format
    name_parts = name.split()
    if len(name_parts) > 1:
        first_name = ' '.join(name_parts[:-1])
        last_name = name_parts[-1]
    else:
        first_name = ""
        last_name = name
        
    return {
        "first_name": first_name,
        "last_name": last_name,
        "is_business": False,
        "original": original
    }

def categorize_property(row, all_data=None):
    """
    Categorize a property as owner-occupied, renter-occupied, or investor.
    
    Parameters:
    - row: The row of data for a single property
    - all_data: The complete dataset, used to detect multiple properties
    
    Returns:
    - category: 'owner', 'renter', 'investor', or 'unknown'
    - confidence: A value from 0 to 1 indicating confidence in the categorization
    """
    # Default to unknown with low confidence
    category = "unknown"
    confidence = 0.3
    
    # Extract property and mailing addresses, handling different column naming conventions
    property_address = ""
    mailing_address = ""
    owner_name = ""
    
    # Common column names for property address
    property_address_cols = [
        'property_address', 'property_addr', 'situs_address', 'site_address', 
        'address', 'prop_address'
    ]
    
    # Common column names for mailing address
    mailing_address_cols = [
        'mailing_address', 'mail_address', 'owner_address', 'taxpayer_address',
        'tax_address', 'mail_addr'
    ]
    
    # Common column names for owner name
    owner_name_cols = [
        'owner_name', 'owner', 'taxpayer_name', 'taxpayer', 'name', 'grantee'
    ]
    
    # Find the property address column
    for col in property_address_cols:
        if col in row and row[col]:
            property_address = str(row[col])
            break
    
    # Find the mailing address column
    for col in mailing_address_cols:
        if col in row and row[col]:
            mailing_address = str(row[col])
            break
    
    # Find the owner name column
    for col in owner_name_cols:
        if col in row and row[col]:
            owner_name = str(row[col])
            break
    
    # If we don't have both addresses, we can't categorize confidently
    if not property_address or not mailing_address:
        return {"category": category, "confidence": confidence}
    
    # Check if property is owner-occupied (addresses match)
    if addresses_match(property_address, mailing_address):
        category = "owner"
        confidence = 0.85
        return {"category": category, "confidence": confidence}
    
    # Check if the property is investor-owned
    is_investor = False
    investor_confidence = 0.5
    
    # Check if owner name contains business indicators
    business_indicators = [
        'llc', 'inc', 'corporation', 'corp', 'trust', 'properties',
        'investments', 'associates', 'rentals', 'management'
    ]
    
    if owner_name:
        lower_name = owner_name.lower()
        if any(indicator in lower_name for indicator in business_indicators):
            is_investor = True
            investor_confidence = 0.9
    
    # Check for multiple properties with the same owner
    if all_data is not None and owner_name:
        # Count properties with the same owner name
        owner_properties = sum(1 for i, row_data in all_data.iterrows() 
                            if any(row_data[col] == owner_name for col in owner_name_cols if col in row_data))
        
        if owner_properties > 1:
            is_investor = True
            investor_confidence = 0.8 + min(0.1, (owner_properties - 1) * 0.02)  # Increase confidence with more properties
    
    # If no investor indicators, it's likely renter-occupied
    if is_investor:
        category = "investor"
        confidence = investor_confidence
    else:
        category = "renter"
        confidence = 0.7
    
    return {"category": category, "confidence": confidence}

def process_csv(file_content, filename):
    """Process a CSV file and categorize properties."""
    try:
        # Detect delimiter
        delimiter = detect_delimiter(file_content)
        
        # Read CSV
        df = pd.read_csv(io.StringIO(file_content.decode('utf-8', errors='ignore')), 
                         delimiter=delimiter, low_memory=False)
        
        # Convert column names to lowercase
        df.columns = [col.lower() for col in df.columns]
        
        # Create processed data with categorization
        processed_data = []
        
        # Generate a unique file ID
        file_id = str(uuid.uuid4())
        
        # Process each row
        for index, row in df.iterrows():
            row_dict = row.to_dict()
            
            # Categorize the property
            categorization = categorize_property(row_dict, df)
            
            # Parse owner name
            name_parsed = {}
            for name_col in ['owner_name', 'owner', 'taxpayer_name', 'taxpayer', 'name', 'grantee']:
                if name_col in row_dict and row_dict[name_col]:
                    name_parsed = parse_name(str(row_dict[name_col]))
                    break
            
            # Add data to processed results
            processed_row = {
                'id': index,
                'data': row_dict,
                'category': categorization['category'],
                'confidence': categorization['confidence'],
                'name_parsed': name_parsed
            }
            processed_data.append(processed_row)
        
        # Calculate statistics
        stats = {
            'total': len(processed_data),
            'owner_occupied': sum(1 for item in processed_data if item['category'] == 'owner'),
            'renter_occupied': sum(1 for item in processed_data if item['category'] == 'renter'),
            'investor': sum(1 for item in processed_data if item['category'] == 'investor'),
            'unknown': sum(1 for item in processed_data if item['category'] == 'unknown'),
        }
        
        # Save processed data
        output_file = f"processed/{file_id}.json"
        with open(output_file, 'w') as f:
            json.dump({
                'filename': filename,
                'processed_at': datetime.now().isoformat(),
                'stats': stats,
                'data': processed_data
            }, f)
        
        return {
            'success': True,
            'message': 'File processed successfully',
            'file_id': file_id,
            'stats': stats
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f"Error processing file: {str(e)}",
        }

# API Routes
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/upload", response_model=ProcessingResult)
async def upload_file(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """Upload and process a CSV file."""
    if not file.filename.endswith(('.csv', '.CSV')):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    
    # Process the file
    result = process_csv(contents, file.filename)
    
    if not result['success']:
        raise HTTPException(status_code=500, detail=result['message'])
    
    return result

@app.get("/processed/{file_id}")
async def get_processed_file(file_id: str):
    """Get processed file data by ID."""
    file_path = f"processed/{file_id}.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Processed file not found")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    return data

@app.get("/templates", response_model=List[Template])
async def list_templates():
    """List all available letter templates."""
    templates_dir = "templates"
    templates = []
    
    if os.path.exists(templates_dir):
        for filename in os.listdir(templates_dir):
            if filename.endswith('.json'):
                with open(os.path.join(templates_dir, filename), 'r') as f:
                    template = json.load(f)
                    templates.append(template)
    
    return templates

@app.post("/templates", response_model=Template)
async def create_template(template: TemplateCreate):
    """Create a new letter template."""
    template_id = str(uuid.uuid4())
    created_at = datetime.now().isoformat()
    
    template_data = Template(
        id=template_id,
        created_at=created_at,
        **template.dict()
    )
    
    with open(f"templates/{template_id}.json", 'w') as f:
        json.dump(template_data.dict(), f)
    
    return template_data

@app.get("/templates/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Get a specific template by ID."""
    template_path = f"templates/{template_id}.json"
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")
    
    with open(template_path, 'r') as f:
        template = json.load(f)
    
    return template

@app.put("/templates/{template_id}", response_model=Template)
async def update_template(template_id: str, template_update: TemplateBase):
    """Update an existing template."""
    template_path = f"templates/{template_id}.json"
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")
    
    with open(template_path, 'r') as f:
        existing_template = json.load(f)
    
    # Update fields
    updated_template = {
        **existing_template,
        "name": template_update.name,
        "content": template_update.content,
        "category": template_update.category
    }
    
    with open(template_path, 'w') as f:
        json.dump(updated_template, f)
    
    return updated_template

@app.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """Delete a template by ID."""
    template_path = f"templates/{template_id}.json"
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")
    
    os.remove(template_path)
    
    return {"status": "success", "message": "Template deleted successfully"}

@app.post("/generate-letters/{file_id}/{template_id}")
async def generate_letters(
    file_id: str, 
    template_id: str,
    categories: List[str] = Query(None),  # Optional filter by categories
):
    """Generate letters for processed data using the specified template."""
    # Check if processed file exists
    processed_file_path = f"processed/{file_id}.json"
    if not os.path.exists(processed_file_path):
        raise HTTPException(status_code=404, detail="Processed file not found")
    
    # Check if template exists
    template_path = f"templates/{template_id}.json"
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Load data
    with open(processed_file_path, 'r') as f:
        processed_data = json.load(f)
    
    with open(template_path, 'r') as f:
        template = json.load(f)
    
    # Filter by categories if specified
    filtered_data = processed_data['data']
    if categories:
        filtered_data = [item for item in filtered_data if item['category'] in categories]
    
    # Generate letters
    letters = []
    for item in filtered_data:
        # Basic context for template variables
        context = {
            'first_name': item['name_parsed'].get('first_name', ''),
            'last_name': item['name_parsed'].get('last_name', ''),
            'full_name': item['name_parsed'].get('original', ''),
            'is_business': item['name_parsed'].get('is_business', False),
            'category': item['category'],
            'property_data': item['data'],
        }
        
        # Generate letter content by replacing template variables
        letter_content = template['content']
        
        # Replace simple variables
        letter_content = letter_content.replace('{{first_name}}', context['first_name'])
        letter_content = letter_content.replace('{{last_name}}', context['last_name'])
        letter_content = letter_content.replace('{{full_name}}', context['full_name'])
        
        # Replace property data variables
        for key, value in context['property_data'].items():
            if isinstance(value, str):
                letter_content = letter_content.replace(f'{{{{{key}}}}}', value)
        
        letters.append({
            'id': str(uuid.uuid4()),
            'property_id': item['id'],
            'recipient': context['full_name'],
            'category': item['category'],
            'content': letter_content,
        })
    
    # Save generated letters
    output_id = str(uuid.uuid4())
    output_path = f"data/letters_{output_id}.json"
    
    with open(output_path, 'w') as f:
        json.dump({
            'generated_at': datetime.now().isoformat(),
            'template_id': template_id,
            'file_id': file_id,
            'count': len(letters),
            'categories': categories or [],
            'letters': letters
        }, f)
    
    return {
        'success': True,
        'message': f'Generated {len(letters)} letters',
        'output_id': output_id,
        'count': len(letters)
    }

@app.get("/generated/{output_id}")
async def get_generated_letters(output_id: str):
    """Get generated letters by output ID."""
    file_path = f"data/letters_{output_id}.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Generated letters not found")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3006) 