'use client';

import { useState, useEffect } from 'react';
import { Send, Filter, FileText, Home, AlertCircle, ChevronRight, Map, Eye, Download, X, Printer } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { getNeighborhoodById } from '@/services/neighborhoodService';

// Mock data for templates
const mockTemplates = [
  {
    id: 1,
    name: 'Rental Property Inquiry',
    category: 'rental',
    content: 'Dear {{owner_name}},\n\nI am writing to inquire about your property at {{address}}...',
    created_at: '2024-03-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Commercial Property Offer',
    category: 'commercial',
    content: 'Dear {{owner_name}},\n\nI would like to present an offer for your commercial property at {{address}}...',
    created_at: '2024-03-10T14:45:00Z'
  },
  {
    id: 3,
    name: 'Vacant Land Development Proposal',
    category: 'land',
    content: 'Dear {{owner_name}},\n\nI am interested in discussing development opportunities for your vacant land at {{address}}...',
    created_at: '2024-03-05T09:15:00Z'
  }
];

export default function LetterGeneratorPage() {
  const [templates, setTemplates] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [generationStatus, setGenerationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [generatedLetters, setGeneratedLetters] = useState([]);
  const [previewLetter, setPreviewLetter] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // Load templates 
        setTemplates(mockTemplates);
        
        // Check if we have a selected neighborhood ID in localStorage
        if (typeof window !== 'undefined' && !hasLoadedFromStorage) {
          const neighborhoodId = localStorage.getItem('selectedNeighborhoodId');
          
          if (neighborhoodId) {
            try {
              // Fetch the neighborhood details
              const neighborhood = await getNeighborhoodById(neighborhoodId);
              setSelectedNeighborhood(neighborhood);
              setProperties(neighborhood.properties || []);
              
              // Clear the localStorage item to prevent it from being loaded again on refresh
              localStorage.removeItem('selectedNeighborhoodId');
            } catch (error) {
              console.error('Error loading neighborhood:', error);
              setProperties([]); 
            }
          } else {
            // If no neighborhood is selected, use mock data
            setProperties([
              { id: 1, ownerName: 'John Smith', first_name: 'John', last_name: 'Smith', address: '123 Main St', category: 'residential', ownerType: 'Owner-Occupied' },
              { id: 2, ownerName: 'Sarah Johnson', first_name: 'Sarah', last_name: 'Johnson', address: '456 Oak Ave', category: 'commercial', ownerType: 'Investor' },
              { id: 3, ownerName: 'Michael Brown', first_name: 'Michael', last_name: 'Brown', address: '789 Pine Rd', category: 'rental', ownerType: 'Renter' },
              { id: 4, ownerName: 'Emily Davis', first_name: 'Emily', last_name: 'Davis', address: '101 Cedar Ln', category: 'land', ownerType: 'Owner-Occupied' },
              { id: 5, ownerName: 'Robert Wilson', first_name: 'Robert', last_name: 'Wilson', address: '202 Elm St', category: 'residential', ownerType: 'Investor' },
              { id: 6, ownerName: 'Lisa Martinez', first_name: 'Lisa', last_name: 'Martinez', address: '303 Maple Dr', category: 'commercial', ownerType: 'Owner-Occupied' },
              { id: 7, ownerName: 'David Taylor', first_name: 'David', last_name: 'Taylor', address: '404 Birch Blvd', category: 'rental', ownerType: 'Renter' }
            ]);
          }
          
          setHasLoadedFromStorage(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hasLoadedFromStorage]);

  // Filter properties based on selected category
  const filteredProperties = selectedCategory === 'all'
    ? properties
    : properties.filter(property => {
        if (selectedCategory === 'residential') {
          return property.category === 'residential' || property.ownerType === 'Owner-Occupied';
        }
        if (selectedCategory === 'investor') {
          return property.ownerType === 'Investor';
        }
        if (selectedCategory === 'renter') {
          return property.ownerType === 'Renter';
        }
        return property.category === selectedCategory;
      });

  const handleGenerateLetters = () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    
    if (filteredProperties.length === 0) {
      alert('No properties match the selected category');
      return;
    }
    
    setGenerationStatus({
      status: 'generating',
      completed: 0,
      total: filteredProperties.length
    });
    
    // Generate the actual letter content
    const letters = filteredProperties.map(property => {
      // Replace template placeholders with property data
      let content = selectedTemplate.content;
      
      // Replace common placeholders
      content = content.replace(/{{owner_name}}/g, property.ownerName || '');
      content = content.replace(/{{first_name}}/g, property.first_name || '');
      content = content.replace(/{{last_name}}/g, property.last_name || '');
      content = content.replace(/{{address}}/g, property.address || '');
      
      // Add additional replacements for any other placeholders you might have
      
      return {
        id: `letter-${property.id}`,
        propertyId: property.id,
        ownerName: property.ownerName,
        address: property.address,
        content: content,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        generatedAt: new Date().toISOString(),
        ownerType: property.ownerType
      };
    });
    
    // Simulate letter generation progress
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setGenerationStatus({
        status: 'generating',
        completed: count,
        total: filteredProperties.length
      });
      
      if (count >= filteredProperties.length) {
        clearInterval(interval);
        setGenerationStatus({
          status: 'completed',
          completed: filteredProperties.length,
          total: filteredProperties.length
        });
        setGeneratedLetters(letters);
      }
    }, 100);
  };

  // Function to download a single letter as PDF
  const downloadLetter = (letter) => {
    // In a real app, you would generate a PDF here
    // For now, we'll create a simple text file
    const blob = new Blob([letter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Letter_to_${letter.ownerName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download all letters as a ZIP
  const downloadAllLetters = () => {
    // In a real app, you would generate a ZIP file with all PDFs
    // For now, just show a message
    alert(`In a real implementation, this would download a ZIP file containing ${generatedLetters.length} letters.`);
  };

  // Function to preview a letter
  const openLetterPreview = (letter) => {
    setPreviewLetter(letter);
    setShowPreviewModal(true);
  };

  // Function to close the preview
  const closeLetterPreview = () => {
    setShowPreviewModal(false);
    setPreviewLetter(null);
  };

  // Print the current letter preview
  const printLetter = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Letter</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 20px;
            }
            .letter-container {
              max-width: 800px;
              margin: 0 auto;
              white-space: pre-wrap;
            }
            @media print {
              body {
                margin: 0.5in;
              }
            }
          </style>
        </head>
        <body>
          <div class="letter-container">
            ${previewLetter.content.replace(/\n/g, '<br>')}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const categories = [
    { value: 'all', label: 'All Properties' },
    { value: 'residential', label: 'Residential/Owner-Occupied' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'investor', label: 'Investors' },
    { value: 'renter', label: 'Renters' },
    { value: 'land', label: 'Land' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Letter Generator</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and send personalized letters to property owners
            </p>
          </header>
          
          {selectedNeighborhood && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Map className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    Using properties from: <span className="font-bold">{selectedNeighborhood.name}</span>
                  </span>
                </div>
                <a 
                  href="/neighborhoods"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  View neighborhood
                  <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Templates Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Templates
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No templates found</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Create template
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600' 
                          : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-700'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{template.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {template.category === 'rental' ? 'Rental' : 
                           template.category === 'commercial' ? 'Commercial' : 
                           template.category === 'land' ? 'Land' : 'Other'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(template.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Properties Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Properties
                </h2>
                
                <select 
                  className="rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No properties in this category</p>
                  <div className="mt-4">
                    <a 
                      href="/neighborhoods"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <Map size={14} />
                      Select a neighborhood
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {filteredProperties.length} properties selected
                  </p>
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                    {filteredProperties.map(property => (
                      <div 
                        key={property.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{property.ownerName}</div>
                        <div className="text-gray-600 dark:text-gray-400">{property.address}</div>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            property.ownerType === 'Owner-Occupied' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : property.ownerType === 'Investor'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {property.ownerType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-center">
                <a
                  href="/neighborhoods"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <Map size={14} className="mr-1" />
                  {selectedNeighborhood ? 'Change neighborhood' : 'Select a neighborhood'}
                </a>
              </div>
            </div>
            
            {/* Generation Status Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Generate Letters
              </h2>
              
              <div className="space-y-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {selectedTemplate 
                      ? `Template: ${selectedTemplate.name}` 
                      : 'No template selected'}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {`Properties: ${filteredProperties.length} ${selectedCategory === 'all' ? 'total' : selectedCategory} properties`}
                  </p>
                  
                  <button
                    className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center gap-2 ${
                      !selectedTemplate || filteredProperties.length === 0 || generationStatus?.status === 'generating'
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                    }`}
                    disabled={!selectedTemplate || filteredProperties.length === 0 || generationStatus?.status === 'generating'}
                    onClick={handleGenerateLetters}
                  >
                    <Send className="h-4 w-4" />
                    Generate Letters
                  </button>
                </div>
                
                {generationStatus && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Progress</h3>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(generationStatus.completed / generationStatus.total) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {generationStatus.completed} of {generationStatus.total} letters
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {Math.round((generationStatus.completed / generationStatus.total) * 100)}%
                      </span>
                    </div>
                    
                    {generationStatus.status === 'completed' && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        All letters have been generated successfully!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Generated Letters Section - Show only when letters are generated */}
          {generatedLetters.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Letters</h2>
                <button
                  onClick={downloadAllLetters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download All
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {generatedLetters.length} Letters Generated
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Template: {selectedTemplate?.name}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Recipient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {generatedLetters.map((letter) => (
                        <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {letter.ownerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {letter.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                              ${letter.ownerType === 'Owner-Occupied' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                letter.ownerType === 'Investor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 
                                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}
                            >
                              {letter.ownerType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                            <button
                              onClick={() => openLetterPreview(letter)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Preview Letter"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => downloadLetter(letter)}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Download Letter"
                            >
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Letter Preview Modal */}
      {showPreviewModal && previewLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Letter Preview: {previewLetter.ownerName}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={printLetter}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  title="Print Letter"
                >
                  <Printer size={20} />
                </button>
                <button
                  onClick={() => downloadLetter(previewLetter)}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  title="Download Letter"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={closeLetterPreview}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  title="Close Preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="bg-white dark:bg-gray-700 p-8 border border-gray-200 dark:border-gray-600 rounded-md max-w-3xl mx-auto">
                <div className="whitespace-pre-wrap font-serif text-gray-900 dark:text-white">
                  {previewLetter.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 