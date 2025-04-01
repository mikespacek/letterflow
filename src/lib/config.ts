// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

// API endpoints
export const ENDPOINTS = {
  // Health check
  HEALTH: `${API_URL}/health`,
  
  // File processing
  UPLOAD: `${API_URL}/upload`,
  PROCESSED: (fileId: string) => `${API_URL}/processed/${fileId}`,
  
  // Templates
  TEMPLATES: `${API_URL}/templates`,
  TEMPLATE: (id: string) => `${API_URL}/templates/${id}`,
  
  // Letter generation
  GENERATE_LETTERS: (fileId: string, templateId: string) => 
    `${API_URL}/generate-letters/${fileId}/${templateId}`,
  GENERATED: (outputId: string) => `${API_URL}/generated/${outputId}`,
};

// Property categories
export const PROPERTY_CATEGORIES = {
  OWNER: 'owner',
  RENTER: 'renter',
  INVESTOR: 'investor',
  VACANT: 'vacant',
  DISTRESSED: 'distressed',
  ABSENTEE: 'absentee',
  ALL: 'all',
};

// Property category labels
export const CATEGORY_LABELS = {
  [PROPERTY_CATEGORIES.OWNER]: 'Owner-Occupied',
  [PROPERTY_CATEGORIES.RENTER]: 'Renter-Occupied',
  [PROPERTY_CATEGORIES.INVESTOR]: 'Investor',
  [PROPERTY_CATEGORIES.VACANT]: 'Vacant',
  [PROPERTY_CATEGORIES.DISTRESSED]: 'Distressed',
  [PROPERTY_CATEGORIES.ABSENTEE]: 'Absentee',
  [PROPERTY_CATEGORIES.ALL]: 'All Properties',
};

// Category colors
export const CATEGORY_COLORS = {
  [PROPERTY_CATEGORIES.OWNER]: '#4CAF50',
  [PROPERTY_CATEGORIES.RENTER]: '#2196F3',
  [PROPERTY_CATEGORIES.INVESTOR]: '#FF9800',
  [PROPERTY_CATEGORIES.VACANT]: '#9C27B0',
  [PROPERTY_CATEGORIES.DISTRESSED]: '#F44336',
  [PROPERTY_CATEGORIES.ABSENTEE]: '#607D8B',
  unknown: '#9E9E9E',
}; 