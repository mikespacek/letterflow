'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, AlertCircle, Table, Save, Home, MapPin } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { createNeighborhood } from '@/services/neighborhoodService';

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
    
    try {
      const text = await file.text();
      const rows = text.split('\n');
      
      if (rows.length < 2) {
        throw new Error('CSV file is empty or invalid');
      }
      
      // Process headers - assume first row is headers
      const headerRow = rows[0].split(',');
      setHeaders(headerRow.map(h => h.trim()));
      
      // Generate preview with 10 rows max
      const previewData = rows.slice(1, 11).map(row => {
        const rowData = row.split(',');
        return headerRow.reduce((obj, header, index) => {
          obj[header.trim()] = rowData[index]?.trim() || '';
          return obj;
        }, {});
      }).filter(row => Object.values(row).some(val => val)); // Filter out empty rows
      
      setPreview(previewData);
      
      // Set default neighborhood name based on file name
      const defaultName = file.name.replace('.csv', '').replace(/[_-]/g, ' ');
      setNeighborhoodName(defaultName);
      
      setLoading(false);
    } catch (err) {
      setError('Error processing CSV file: ' + err.message);
      setLoading(false);
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
    if (!file || preview.length === 0) {
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
      // Process the CSV data to create properties
      const text = await file.text();
      const rows = text.split('\n');
      const headerRow = rows[0].split(',').map(h => h.trim());
      
      // Map CSV rows to property objects
      const properties = rows.slice(1)
        .map(row => {
          const rowData = row.split(',');
          return headerRow.reduce((obj, header, index) => {
            obj[header.trim()] = rowData[index]?.trim() || '';
            return obj;
          }, {});
        })
        .filter(row => Object.values(row).some(val => val))
        .map((row, index) => {
          // Map to property object with expected fields
          return {
            id: index + 1,
            ownerName: row.owner_name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
            first_name: row.first_name || '',
            last_name: row.last_name || '',
            address: row.address || '',
            category: row.category || 'residential',
            ownerType: row.owner_type || 'Owner-Occupied',
            estimatedValue: parseFloat(row.estimated_value || '0') || 0,
            lastSoldDate: row.last_sold_date || new Date().toISOString().split('T')[0]
          };
        });
      
      // Count property types
      const ownerOccupiedCount = properties.filter(p => 
        p.ownerType === 'Owner-Occupied').length;
      
      const investorCount = properties.filter(p => 
        p.ownerType === 'Investor').length;
      
      const renterCount = properties.filter(p => 
        p.ownerType === 'Renter').length;
      
      // Prepare neighborhood data
      const neighborhoodData = {
        name: neighborhoodName,
        city: properties[0]?.address?.split(',')[1]?.trim() || '',
        state: properties[0]?.address?.split(',')[2]?.trim()?.split(' ')[0] || '',
        zipCode: properties[0]?.address?.split(',')[2]?.trim()?.split(' ')[1] || '',
        propertiesCount: properties.length,
        ownerOccupiedCount,
        investorCount,
        renterCount,
        properties
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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CSV Processor</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a CSV file with property data to create a new neighborhood
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
              {/* Preview Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <Table className="h-5 w-5 mr-2 text-blue-600" /> 
                      Data Preview
                    </h2>
                    <p className="text-sm text-gray-500">
                      {file.name} • {preview.length} rows previewed
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview([]);
                      setHeaders([]);
                      setSaveSuccess(false);
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Save as Neighborhood Section */}
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