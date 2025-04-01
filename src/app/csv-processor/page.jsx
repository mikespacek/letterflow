'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, AlertCircle, Table, Save, Home, MapPin, Download, Filter } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { createNeighborhood } from '@/services/neighborhoodService';
import { Button } from '@/components/ui/button';

export default function CSVProcessorPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [processingDownload, setProcessingDownload] = useState(false);
  const [dataProcessed, setDataProcessed] = useState(false);
  const [propertyCountsByType, setPropertyCountsByType] = useState({
    ownerOccupied: 0,
    investor: 0,
    renter: 0
  });

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
    processCSV(selectedFile);
  };

  const processCSV = async (file) => {
    setLoading(true);
    setDataProcessed(false);
    setError('');
    
    try {
      const text = await file.text();
      
      // First handle the parsing of CSV with quotes correctly
      let rows = [];
      let currentRow = [];
      let currentCell = '';
      let inQuotes = false;
      
      // More robust CSV parsing that handles quotes properly
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '"') {
          // Toggle quote mode
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          // End of cell
          currentRow.push(currentCell.trim());
          currentCell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          // End of row
          if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
            // Skip the \n in \r\n
            i++;
          }
          
          // Add the last cell in the row
          if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            if (currentRow.some(cell => cell)) { // Only add non-empty rows
              rows.push([...currentRow]);
            }
            currentRow = [];
            currentCell = '';
          }
        } else {
          // Regular character
          currentCell += char;
        }
      }
      
      // Add any remaining data
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell)) { // Only add non-empty rows
          rows.push([...currentRow]);
        }
      }
      
      if (rows.length < 2) {
        throw new Error('CSV file is empty or invalid');
      }
      
      // Clean headers - remove quotes and trim
      const headerRow = rows[0];
      const cleanHeaders = headerRow.map(h => {
        let header = h.trim();
        // Remove quotes if they exist
        if (header.startsWith('"') && header.endsWith('"')) {
          header = header.substring(1, header.length - 1);
        }
        return header;
      });
      
      console.log('Headers:', cleanHeaders);
      setHeaders(cleanHeaders);
      
      // Process all rows to properties
      const properties = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].some(cell => cell.trim())) continue; // Skip empty rows
        
        const rowData = rows[i];
        const propertyData = {};
        
        // Map each value to its corresponding clean header
        cleanHeaders.forEach((header, index) => {
          let value = rowData[index]?.trim() || '';
          // Remove quotes if they exist
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          propertyData[header] = value;
        });
        
        console.log('Row data:', propertyData);
        
        // Determine owner type based on data
        let ownerType = 'Owner-Occupied'; // Default to owner-occupied
        
        // Check for explicit "OWNER OCCUPIED" column or variant with case insensitivity
        const ownerOccupiedColumn = cleanHeaders.find(header => 
          header.toUpperCase() === 'OWNER OCCUPIED' || 
          header.toUpperCase() === 'OWNER_OCCUPIED' || 
          header.toUpperCase() === 'OWNEROCCUPIED'
        );
        
        if (ownerOccupiedColumn) {
          console.log('Found owner occupied column:', ownerOccupiedColumn, 'Value:', propertyData[ownerOccupiedColumn]);
          
          const ownerOccupiedValue = propertyData[ownerOccupiedColumn];
          // Check if the value indicates "No" or similar
          if (ownerOccupiedValue && 
              (ownerOccupiedValue.toLowerCase() === 'no' || 
               ownerOccupiedValue.toLowerCase() === 'false' || 
               ownerOccupiedValue === '0' ||
               ownerOccupiedValue.toLowerCase() === 'n')) {
            
            // It's not owner-occupied, so check if it's an investor or renter
            const mailOwnerColumn = cleanHeaders.find(header => 
              header.toUpperCase().includes('MAIL OWNER') || 
              header.toUpperCase().includes('OWNER NAME')
            );
            
            if (mailOwnerColumn && propertyData[mailOwnerColumn]) {
              // Business indicators to identify investors
              const businessIndicators = [
                'llc', 'inc', 'corporation', 'corp', 'trust', 'properties',
                'investments', 'associates', 'rentals', 'management', 'company',
                'partners', 'holdings', 'group', 'enterprise', 'services'
              ];
              
              const ownerName = propertyData[mailOwnerColumn].toLowerCase();
              const isBusinessOwner = businessIndicators.some(indicator => ownerName.includes(indicator));
              
              if (isBusinessOwner) {
                ownerType = 'Investor';
                console.log('Classified as Investor based on business name:', ownerName);
              } else {
                // In real estate, if it's not owner-occupied and not a business/investor, it's typically a renter
                ownerType = 'Renter';
                console.log('Classified as Renter (not owner-occupied, not business name)');
              }
            } else {
              // Default to renter if we can't determine investor status
              ownerType = 'Renter';
              console.log('Defaulting to Renter (not owner-occupied, no owner name found)');
            }
          } else {
            // Explicitly marked as owner-occupied
            ownerType = 'Owner-Occupied';
            console.log('Classified as Owner-Occupied based on owner occupied field value');
          }
        } else {
          // No explicit owner occupied column, try to infer from address comparison
          console.log('No owner occupied column found, comparing addresses...');
          
          // Look for property address and mailing address columns
          const propertyAddrColumns = cleanHeaders.filter(header => 
            header.toUpperCase().includes('PROPERTY') || 
            header.toUpperCase().includes('SITUS') || 
            header.toUpperCase() === 'ADDRESS'
          );
          
          const mailingAddrColumns = cleanHeaders.filter(header => 
            header.toUpperCase().includes('MAILING') || 
            header.toUpperCase().includes('TAX BILLING') || 
            header.toUpperCase().includes('MAIL ADDR')
          );
          
          // Get the addresses if columns are found
          let propertyAddr = '';
          let mailingAddr = '';
          
          if (propertyAddrColumns.length > 0) {
            propertyAddr = propertyData[propertyAddrColumns[0]] || '';
          }
          
          if (mailingAddrColumns.length > 0) {
            mailingAddr = propertyData[mailingAddrColumns[0]] || '';
          }
          
          if (propertyAddr && mailingAddr) {
            // Simple address comparison - normalize and check if addresses match
            const normalizeAddress = (addr) => {
              if (!addr) return '';
              // Convert to lowercase and remove common suffixes, punctuation, etc.
              return addr.toLowerCase()
                .replace(/\b(street|avenue|boulevard|drive|court|lane|road|place|way|circle|terrace|parkway)\b/g, '')
                .replace(/\b(st|ave|blvd|dr|ct|ln|rd|pl|wy|cir|ter|pkwy)\b\.?/g, '')
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            };
            
            const normPropertyAddr = normalizeAddress(propertyAddr);
            const normMailingAddr = normalizeAddress(mailingAddr);
            
            console.log('Comparing addresses:', 
                        'Property:', propertyAddr, '(normalized:', normPropertyAddr, ')',
                        'Mailing:', mailingAddr, '(normalized:', normMailingAddr, ')');
            
            // Check if addresses match (one contains the other)
            if (normPropertyAddr && normMailingAddr &&
                (normPropertyAddr.includes(normMailingAddr) || 
                 normMailingAddr.includes(normPropertyAddr))) {
              // Addresses match, likely owner-occupied
              ownerType = 'Owner-Occupied';
              console.log('Classified as Owner-Occupied based on matching addresses');
            } else {
              // Addresses don't match, likely not owner-occupied
              // Check if it's an investor or renter
              const mailOwnerColumn = cleanHeaders.find(header => 
                header.toUpperCase().includes('MAIL OWNER') || 
                header.toUpperCase().includes('OWNER NAME')
              );
              
              if (mailOwnerColumn && propertyData[mailOwnerColumn]) {
                // Business indicators to identify investors
                const businessIndicators = [
                  'llc', 'inc', 'corporation', 'corp', 'trust', 'properties',
                  'investments', 'associates', 'rentals', 'management', 'company',
                  'partners', 'holdings', 'group', 'enterprise', 'services'
                ];
                
                const ownerName = propertyData[mailOwnerColumn].toLowerCase();
                const isBusinessOwner = businessIndicators.some(indicator => ownerName.includes(indicator));
                
                if (isBusinessOwner) {
                  ownerType = 'Investor';
                  console.log('Classified as Investor based on business name:', ownerName);
                } else {
                  ownerType = 'Renter';
                  console.log('Classified as Renter (addresses don\'t match, not a business name)');
                }
              } else {
                // Default to renter if we can't determine investor status
                ownerType = 'Renter';
                console.log('Defaulting to Renter (addresses don\'t match, no owner name found)');
              }
            }
          } else {
            // Can't determine from addresses, check owner type based on name
            console.log('Could not find both property and mailing addresses, using owner name...');
            
            const mailOwnerColumn = cleanHeaders.find(header => 
              header.toUpperCase().includes('MAIL OWNER') || 
              header.toUpperCase().includes('OWNER NAME')
            );
            
            if (mailOwnerColumn && propertyData[mailOwnerColumn]) {
              // Business indicators to identify investors
              const businessIndicators = [
                'llc', 'inc', 'corporation', 'corp', 'trust', 'properties',
                'investments', 'associates', 'rentals', 'management', 'company',
                'partners', 'holdings', 'group', 'enterprise', 'services'
              ];
              
              const ownerName = propertyData[mailOwnerColumn].toLowerCase();
              const isBusinessOwner = businessIndicators.some(indicator => ownerName.includes(indicator));
              
              if (isBusinessOwner) {
                ownerType = 'Investor';
                console.log('Classified as Investor based on business name:', ownerName);
              } else {
                // Default to owner-occupied if we can't determine from addresses and it's not a business
                ownerType = 'Owner-Occupied';
                console.log('Defaulting to Owner-Occupied (no address comparison, not a business)');
              }
            }
          }
        }
        
        // Only add valid properties to our array
        if (Object.values(propertyData).some(val => val)) {
          properties.push({
            ...propertyData,
            ownerType
          });
        }
      }
      
      // Count properties by type
      const ownerOccupiedCount = properties.filter(p => p.ownerType === 'Owner-Occupied').length;
      const investorCount = properties.filter(p => p.ownerType === 'Investor').length;
      const renterCount = properties.filter(p => p.ownerType === 'Renter').length;
      
      console.log('Final property counts:', {
        total: properties.length,
        ownerOccupied: ownerOccupiedCount,
        investor: investorCount,
        renter: renterCount
      });
      
      setPropertyCountsByType({
        ownerOccupied: ownerOccupiedCount,
        investor: investorCount,
        renter: renterCount
      });
      
      setAllProperties(properties);
      
      // Generate preview with 10 rows max
      setPreview(properties.slice(0, 10));
      
      // Set default neighborhood name based on file name
      const defaultName = file.name.replace('.csv', '').replace(/[_-]/g, ' ');
      setNeighborhoodName(defaultName);
      
      setDataProcessed(true);
      setLoading(false);
    } catch (err) {
      console.error('CSV processing error:', err);
      setError('Error processing CSV file: ' + err.message);
      setLoading(false);
      setDataProcessed(false);
    }
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      
      setFile(droppedFile);
      setError('');
      processCSV(droppedFile);
    }
  }, []);

  const saveAsNeighborhood = async () => {
    if (!file || allProperties.length === 0) {
      setError('No data to save');
      return;
    }
    
    if (!neighborhoodName.trim()) {
      setError('Please enter a name for this neighborhood');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      // Count property types
      const ownerOccupiedCount = allProperties.filter(p => 
        p.ownerType === 'Owner-Occupied').length;
      
      const investorCount = allProperties.filter(p => 
        p.ownerType === 'Investor').length;
      
      const renterCount = allProperties.filter(p => 
        p.ownerType === 'Renter').length;
      
      // Prepare neighborhood data
      const neighborhoodData = {
        name: neighborhoodName,
        city: allProperties[0]?.address?.split(',')[1]?.trim() || '',
        state: allProperties[0]?.address?.split(',')[2]?.trim()?.split(' ')[0] || '',
        zipCode: allProperties[0]?.address?.split(',')[2]?.trim()?.split(' ')[1] || '',
        propertiesCount: allProperties.length,
        ownerOccupiedCount,
        investorCount,
        renterCount,
        properties: allProperties.map((prop, index) => ({
          id: index + 1,
          ownerName: prop.owner_name || `${prop.first_name || ''} ${prop.last_name || ''}`.trim(),
          first_name: prop.first_name || '',
          last_name: prop.last_name || '',
          address: prop.address || prop.property_address || '',
          category: prop.category || 'residential',
          ownerType: prop.ownerType,
          estimatedValue: parseFloat(prop.estimated_value || '0') || 0,
          lastSoldDate: prop.last_sold_date || new Date().toISOString().split('T')[0]
        }))
      };
      
      // Save to the database
      const savedNeighborhood = await createNeighborhood(neighborhoodData);
      
      setSaveSuccess(true);
      setIsSaving(false);
      
      // Redirect to the neighborhood details page after a short delay
      setTimeout(() => {
        router.push('/neighborhoods');
      }, 2000);
      
    } catch (err) {
      setError('Error saving neighborhood: ' + err.message);
      setIsSaving(false);
    }
  };

  const filterProperties = (filter) => {
    setActiveFilter(filter);
    if (!allProperties || allProperties.length === 0) {
      setPreview([]);
      return;
    }

    let filtered = [];
    
    if (filter === 'all') {
      filtered = allProperties;
    } else if (filter === 'owner-occupied') {
      filtered = allProperties.filter(p => p.ownerType === 'Owner-Occupied');
    } else if (filter === 'investor') {
      filtered = allProperties.filter(p => p.ownerType === 'Investor');
    } else if (filter === 'renter') {
      filtered = allProperties.filter(p => p.ownerType === 'Renter');
    }
    
    // Update preview with at most 10 items
    setPreview(filtered.slice(0, 10));
  };

  const downloadFilteredList = async () => {
    if (!allProperties || allProperties.length === 0) {
      alert('No properties to download');
      return;
    }
    
    setProcessingDownload(true);
    
    try {
      // Filter the properties based on the activeFilter
      let dataToDownload = [];
      
      if (activeFilter === 'all') {
        dataToDownload = [...allProperties];
      } else if (activeFilter === 'owner-occupied') {
        dataToDownload = allProperties.filter(p => p.ownerType === 'Owner-Occupied');
      } else if (activeFilter === 'investor') {
        dataToDownload = allProperties.filter(p => p.ownerType === 'Investor');
      } else if (activeFilter === 'renter') {
        dataToDownload = allProperties.filter(p => p.ownerType === 'Renter');
      }
      
      if (dataToDownload.length === 0) {
        alert('No properties match the selected filter');
        setProcessingDownload(false);
        return;
      }
      
      // Get all headers from the properties
      const headers = Object.keys(dataToDownload[0]);
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      dataToDownload.forEach(property => {
        const row = headers.map(header => {
          const value = property[header] || '';
          // Escape quotes and wrap in quotes if the value contains a comma
          return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvContent += row.join(',') + '\n';
      });
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set filename based on the filter
      let filename = '';
      if (activeFilter === 'all') {
        filename = 'all_properties.csv';
      } else if (activeFilter === 'owner-occupied') {
        filename = 'owner_occupied_properties.csv';
      } else if (activeFilter === 'investor') {
        filename = 'investor_properties.csv';
      } else if (activeFilter === 'renter') {
        filename = 'renter_properties.csv';
      }
      
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error creating download. Please try again.');
    } finally {
      setProcessingDownload(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CSV Processor</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a CSV file with property data to create a new neighborhood or download specific property lists
            </p>
          </header>
          
          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center bg-white dark:bg-gray-800"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <Upload size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Upload CSV File
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Drag and drop your CSV file here, or click below to select a file
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Select CSV File
              </button>
            </div>
          ) : (
            <div>
              {/* Loading State */}
              {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-10 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Processing CSV Data
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we analyze and categorize your property data...
                  </p>
                </div>
              )}
              
              {/* Filter and Download Section */}
              {dataProcessed && (
                <div className="mt-6 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Property Filters</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button 
                      variant={activeFilter === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => filterProperties('all')}
                      className="flex items-center"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      All Properties ({allProperties?.length || 0})
                    </Button>
                    <Button 
                      variant={activeFilter === 'owner-occupied' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => filterProperties('owner-occupied')}
                      className="flex items-center"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Owner-Occupied ({propertyCountsByType?.ownerOccupied || 0})
                    </Button>
                    <Button 
                      variant={activeFilter === 'investor' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => filterProperties('investor')}
                      className="flex items-center"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Investor ({propertyCountsByType?.investor || 0})
                    </Button>
                    <Button 
                      variant={activeFilter === 'renter' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => filterProperties('renter')}
                      className="flex items-center"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Renter ({propertyCountsByType?.renter || 0})
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadFilteredList()}
                      disabled={processingDownload || !allProperties || allProperties.length === 0}
                      className="flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {processingDownload ? 'Processing...' : `Download ${activeFilter === 'all' ? 'All' : 
                        activeFilter === 'owner-occupied' ? 'Owner-Occupied' : 
                        activeFilter === 'investor' ? 'Investor' : 'Renter'} List`}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Preview Section - Only show if data is processed */}
              {dataProcessed && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Table className="h-5 w-5 mr-2 text-blue-600" /> 
                        Data Preview
                      </h2>
                      <p className="text-sm text-gray-500">
                        {file.name} • {preview.length} rows previewed {activeFilter !== 'all' ? `(filtered to ${activeFilter})` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview([]);
                        setHeaders([]);
                        setSaveSuccess(false);
                        setAllProperties([]);
                        setDataProcessed(false);
                      }}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Change File
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {headers.map((header, index) => (
                            <th 
                              key={index} 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Owner Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {preview.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                            {headers.map((header, cellIndex) => (
                              <td 
                                key={cellIndex} 
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                              >
                                {row[header] || '-'}
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                ${row.ownerType === 'Owner-Occupied' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                  row.ownerType === 'Investor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 
                                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                {row.ownerType}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Save as Neighborhood Section - Only show if data is processed */}
              {dataProcessed && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-blue-600" /> 
                    Save as Neighborhood
                  </h2>
                  
                  <div className="mb-4">
                    <label htmlFor="neighborhood-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Neighborhood Name
                    </label>
                    <input
                      type="text"
                      id="neighborhood-name"
                      value={neighborhoodName}
                      onChange={(e) => setNeighborhoodName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter neighborhood name"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      onClick={saveAsNeighborhood}
                      disabled={loading || isSaving || saveSuccess}
                      className={`px-4 py-2 rounded-md text-white flex items-center ${
                        loading || isSaving || saveSuccess
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Saved Successfully
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save as Neighborhood
                        </>
                      )}
                    </button>
                    
                    {saveSuccess && (
                      <span className="ml-4 text-sm text-green-600 dark:text-green-400">
                        Redirecting to neighborhoods page...
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                    <span className="text-red-800 dark:text-red-300">{error}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 