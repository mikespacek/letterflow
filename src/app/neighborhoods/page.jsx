'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowLeft, FileText, Users, Home, Building, User, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { getNeighborhoods, getNeighborhoodById, selectNeighborhoodForLetters } from '@/services/neighborhoodService';

export default function NeighborhoodsPage() {
  const router = useRouter();
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailView, setIsDetailView] = useState(false);
  
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const data = await getNeighborhoods();
        setNeighborhoods(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch neighborhoods:', error);
        setIsLoading(false);
      }
    };
    
    fetchNeighborhoods();
  }, []);
  
  const handleNeighborhoodSelect = async (id) => {
    try {
      setIsLoading(true);
      const neighborhood = await getNeighborhoodById(id);
      setSelectedNeighborhood(neighborhood);
      setProperties(neighborhood.properties || []);
      setIsDetailView(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch neighborhood details:', error);
      setIsLoading(false);
    }
  };
  
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedNeighborhood(null);
    setProperties([]);
  };
  
  const handleUseForLetters = (id) => {
    // Save the selected neighborhood to localStorage
    selectNeighborhoodForLetters(id);
    
    // Navigate to the letter generator page
    router.push('/letter-generator');
  };
  
  const filteredNeighborhoods = neighborhoods.filter(neighborhood => 
    neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.zipCode.includes(searchTerm)
  );
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <header className="mb-8">
            {isDetailView ? (
              <div className="flex items-center mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-4"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to neighborhoods
                </button>
              </div>
            ) : null}
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isDetailView ? selectedNeighborhood?.name : 'Neighborhoods'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isDetailView 
                ? `${selectedNeighborhood?.city}, ${selectedNeighborhood?.state} ${selectedNeighborhood?.zipCode}`
                : 'Manage and select neighborhoods for your letter campaigns'}
            </p>
          </header>
          
          {isDetailView ? (
            <div>
              {/* Neighborhood Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <Home className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedNeighborhood?.propertiesCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total properties</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Owner-Occupied</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedNeighborhood?.ownerOccupiedCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((selectedNeighborhood?.ownerOccupiedCount / selectedNeighborhood?.propertiesCount) * 100)}% of total
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investor-Owned</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedNeighborhood?.investorCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((selectedNeighborhood?.investorCount / selectedNeighborhood?.propertiesCount) * 100)}% of total
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Renter-Occupied</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedNeighborhood?.renterCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((selectedNeighborhood?.renterCount / selectedNeighborhood?.propertiesCount) * 100)}% of total
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex mb-8 space-x-4">
                <button
                  onClick={() => handleUseForLetters(selectedNeighborhood.id)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Use for Letter Generation
                </button>
              </div>
              
              {/* Properties Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Properties</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Est. Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {properties.map(property => (
                        <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {property.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {property.ownerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              property.ownerType === 'Owner-Occupied' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : property.ownerType === 'Investor'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {property.ownerType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${property.estimatedValue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(property.lastSoldDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search neighborhoods by name, city, state, or zip code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Neighborhoods List */}
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredNeighborhoods.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No neighborhoods found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload a CSV file to create your first neighborhood'}
                  </p>
                  <a
                    href="/csv-processor"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Upload CSV
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNeighborhoods.map(neighborhood => (
                    <div key={neighborhood.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{neighborhood.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {neighborhood.city}, {neighborhood.state} {neighborhood.zipCode}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(neighborhood.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{neighborhood.propertiesCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Properties</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{neighborhood.ownerOccupiedCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Owners</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{neighborhood.investorCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Investors</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleNeighborhoodSelect(neighborhood.id)}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleUseForLetters(neighborhood.id)}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                          >
                            <FileText size={14} className="mr-1" />
                            Use for Letters
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 