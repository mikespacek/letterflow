# Real Estate Letter Generator (Next.js Version)

A modern web application for processing real estate property data, categorizing properties, and generating personalized letters for property owners.

## Features

- **Modern UI with Next.js & Tailwind CSS**
  - Responsive design for all devices
  - Dark mode support
  - Interactive data visualizations
  
- **CSV Processing**
  - Automatic delimiter detection
  - Intelligent property categorization
  - Name parsing for personalization
  
- **Property Categories**
  - Owner-Occupied: Properties where the owner lives at the property
  - Renter-Occupied: Properties where the owner doesn't live at the property
  - Investor: Business entities or individuals who own multiple properties
  - Vacant: Unoccupied properties
  - Distressed: Properties facing financial or physical challenges
  - Absentee: Properties owned by out-of-area owners
  
- **Smart Letter Generator**
  - Category-specific templates
  - Personalized variable replacement
  - Bulk letter generation
  
- **Analytics Dashboard**
  - Property category distribution charts
  - Categorization confidence metrics
  - Business entity insights

## Tech Stack

- **Frontend**
  - Next.js with App Router
  - Tailwind CSS for styling
  - React hooks for state management
  - Chart.js for data visualization
  
- **Backend**
  - FastAPI (Python)
  - Pandas for data processing
  - JSON for data storage

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Python 3.8 or later
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/re-letters-nextjs.git
   cd re-letters-nextjs
   ```

2. **Install JavaScript dependencies**
   ```
   npm install
   ```

3. **Install Python dependencies**
   ```
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

### Development

Start both the frontend and backend servers:

```
npm run dev:all
```

This will start:
- Next.js development server on port 3000
- FastAPI backend server on port 3006

You can also run them separately:

```
# Frontend only
npm run dev

# Backend only
npm run api:start
```

### Usage

1. **Upload CSV Data**
   - Navigate to the CSV Processor
   - Upload your property data CSV
   - Review the automatic categorization

2. **Manage Templates**
   - Create and edit letter templates for different property types
   - Use variables like `{{first_name}}` and `{{property_address}}`

3. **Generate Letters**
   - Select processed data and template
   - Generate personalized letters for all or specific categories
   - Review and export

4. **Analyze Data**
   - View distribution of property types
   - Analyze confidence levels of categorization
   - Get insights about your property data

## API Documentation

API documentation is available at http://localhost:3006/docs when the server is running.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 