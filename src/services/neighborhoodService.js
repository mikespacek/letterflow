// Service for neighborhood operations

// Mock data for neighborhoods
const mockNeighborhoods = [
  {
    id: '1',
    name: 'Willow Creek',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    createdAt: '2024-01-15T08:30:00Z',
    propertiesCount: 87,
    ownerOccupiedCount: 45,
    investorCount: 32,
    renterCount: 10,
    properties: [
      { id: 101, ownerName: 'John Smith', first_name: 'John', last_name: 'Smith', address: '123 Willow St, Austin, TX 78704', category: 'residential', ownerType: 'Owner-Occupied', estimatedValue: 450000, lastSoldDate: '2019-05-12' },
      { id: 102, ownerName: 'Sarah Johnson', first_name: 'Sarah', last_name: 'Johnson', address: '456 Creek Ave, Austin, TX 78704', category: 'commercial', ownerType: 'Investor', estimatedValue: 780000, lastSoldDate: '2020-11-03' },
      { id: 103, ownerName: 'Michael Brown', first_name: 'Michael', last_name: 'Brown', address: '789 Pine Rd, Austin, TX 78704', category: 'rental', ownerType: 'Renter', estimatedValue: 320000, lastSoldDate: '2018-09-22' },
      { id: 104, ownerName: 'Emily Davis', first_name: 'Emily', last_name: 'Davis', address: '101 Cedar Ln, Austin, TX 78704', category: 'land', ownerType: 'Owner-Occupied', estimatedValue: 550000, lastSoldDate: '2021-03-15' }
    ]
  },
  {
    id: '2',
    name: 'Oak Ridge',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    createdAt: '2024-02-10T10:45:00Z',
    propertiesCount: 65,
    ownerOccupiedCount: 28,
    investorCount: 27,
    renterCount: 10,
    properties: [
      { id: 201, ownerName: 'Robert Wilson', first_name: 'Robert', last_name: 'Wilson', address: '202 Oak St, Dallas, TX 75201', category: 'residential', ownerType: 'Investor', estimatedValue: 620000, lastSoldDate: '2020-07-18' },
      { id: 202, ownerName: 'Lisa Martinez', first_name: 'Lisa', last_name: 'Martinez', address: '303 Ridge Ave, Dallas, TX 75201', category: 'commercial', ownerType: 'Owner-Occupied', estimatedValue: 890000, lastSoldDate: '2022-01-05' },
      { id: 203, ownerName: 'David Taylor', first_name: 'David', last_name: 'Taylor', address: '404 Maple Dr, Dallas, TX 75201', category: 'rental', ownerType: 'Renter', estimatedValue: 410000, lastSoldDate: '2019-12-11' }
    ]
  },
  {
    id: '3',
    name: 'Sunset Hills',
    city: 'Houston',
    state: 'TX',
    zipCode: '77002',
    createdAt: '2024-03-05T14:20:00Z',
    propertiesCount: 112,
    ownerOccupiedCount: 67,
    investorCount: 35,
    renterCount: 10,
    properties: [
      { id: 301, ownerName: 'Jennifer Lee', first_name: 'Jennifer', last_name: 'Lee', address: '505 Sunset Blvd, Houston, TX 77002', category: 'residential', ownerType: 'Owner-Occupied', estimatedValue: 520000, lastSoldDate: '2021-05-30' },
      { id: 302, ownerName: 'Thomas White', first_name: 'Thomas', last_name: 'White', address: '606 Hill Rd, Houston, TX 77002', category: 'commercial', ownerType: 'Investor', estimatedValue: 750000, lastSoldDate: '2020-02-14' },
      { id: 303, ownerName: 'Amanda Clark', first_name: 'Amanda', last_name: 'Clark', address: '707 Valley Dr, Houston, TX 77002', category: 'rental', ownerType: 'Renter', estimatedValue: 380000, lastSoldDate: '2019-08-26' },
      { id: 304, ownerName: 'Kevin Rodriguez', first_name: 'Kevin', last_name: 'Rodriguez', address: '808 Mountain Ln, Houston, TX 77002', category: 'land', ownerType: 'Investor', estimatedValue: 490000, lastSoldDate: '2022-04-19' },
      { id: 305, ownerName: 'Michelle Parker', first_name: 'Michelle', last_name: 'Parker', address: '909 Forest Ave, Houston, TX 77002', category: 'residential', ownerType: 'Owner-Occupied', estimatedValue: 610000, lastSoldDate: '2021-11-08' }
    ]
  }
];

/**
 * Save a neighborhood and its properties to the database
 * @param {Object} data - Object containing neighborhood name, description, and properties
 * @returns {Promise<Object>} - The saved neighborhood data
 */
export async function saveNeighborhood(data) {
  try {
    const response = await fetch('/api/neighborhoods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save neighborhood');
    }

    return response.json();
  } catch (error) {
    console.error('Error in saveNeighborhood service:', error);
    throw error;
  }
}

/**
 * Get all neighborhoods
 * @returns {Promise<Array>} Neighborhoods data
 */
export const getNeighborhoods = async () => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNeighborhoods);
    }, 500);
  });
};

/**
 * Get a specific neighborhood by ID
 * @param {string} id Neighborhood ID
 * @returns {Promise<Object>} Neighborhood data
 */
export const getNeighborhoodById = async (id) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const neighborhood = mockNeighborhoods.find(n => n.id === id);
      
      if (neighborhood) {
        resolve(neighborhood);
      } else {
        reject(new Error(`Neighborhood with ID ${id} not found`));
      }
    }, 300);
  });
};

/**
 * Create a new neighborhood from CSV data
 * @param {Object} data Neighborhood data
 * @returns {Promise<Object>} Created neighborhood
 */
export const createNeighborhood = async (neighborhoodData) => {
  try {
    // Map backend categories to frontend categories if necessary
    if (neighborhoodData.properties && Array.isArray(neighborhoodData.properties)) {
      neighborhoodData.properties = neighborhoodData.properties.map(property => {
        // If ownerType is from backend format (owner, renter, investor), convert it
        if (property.ownerType === 'owner') {
          return { ...property, ownerType: 'Owner-Occupied' };
        } else if (property.ownerType === 'renter') {
          return { ...property, ownerType: 'Renter' };
        } else if (property.ownerType === 'investor') {
          return { ...property, ownerType: 'Investor' };
        }
        return property;
      });
    }
    
    const response = await fetch('/api/neighborhoods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(neighborhoodData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create neighborhood');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating neighborhood:', error);
    throw error;
  }
};

/**
 * Update a neighborhood
 * @param {string} id Neighborhood ID
 * @param {Object} data Updated neighborhood data
 * @returns {Promise<Object>} Updated neighborhood
 */
export const updateNeighborhood = async (id, data) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const neighborhoodIndex = mockNeighborhoods.findIndex(n => n.id === id);
      
      if (neighborhoodIndex !== -1) {
        const updatedNeighborhood = {
          ...mockNeighborhoods[neighborhoodIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        // In a real app, this would update the database
        resolve(updatedNeighborhood);
      } else {
        reject(new Error(`Neighborhood with ID ${id} not found`));
      }
    }, 500);
  });
};

/**
 * Delete a neighborhood
 * @param {string} id Neighborhood ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteNeighborhood = async (id) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const neighborhoodIndex = mockNeighborhoods.findIndex(n => n.id === id);
      
      if (neighborhoodIndex !== -1) {
        // In a real app, this would delete from the database
        resolve(true);
      } else {
        reject(new Error(`Neighborhood with ID ${id} not found`));
      }
    }, 400);
  });
};

/**
 * Select a neighborhood for letter generation
 * @param {string} id Neighborhood ID
 */
export const selectNeighborhoodForLetters = (id) => {
  // Save the selected neighborhood ID to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedNeighborhoodId', id);
  }
}; 