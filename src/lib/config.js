// API Configuration
export const API_URL = 'http://localhost:3006/api';

// API Endpoints
export const ENDPOINTS = {
  TEMPLATES: '/templates',
  CSV_UPLOAD: '/csv/upload',
  PROPERTIES: '/properties',
  PROPERTY_CATEGORIES: '/property-categories',
  GENERATE_LETTERS: '/letters/generate',
  ANALYTICS: '/analytics',
};

// Property Categories
export const PROPERTY_CATEGORIES = {
  OWNER_OCCUPIED: 'owner-occupied',
  NON_OWNER_OCCUPIED: 'non-owner-occupied',
  VACANT: 'vacant',
  ABSENTEE: 'absentee',
  PROBATE: 'probate',
  OTHER: 'other',
};

// Category Labels
export const CATEGORY_LABELS = {
  [PROPERTY_CATEGORIES.OWNER_OCCUPIED]: 'Owner Occupied',
  [PROPERTY_CATEGORIES.NON_OWNER_OCCUPIED]: 'Non-Owner Occupied',
  [PROPERTY_CATEGORIES.VACANT]: 'Vacant',
  [PROPERTY_CATEGORIES.ABSENTEE]: 'Absentee Owner',
  [PROPERTY_CATEGORIES.PROBATE]: 'Probate',
  [PROPERTY_CATEGORIES.OTHER]: 'Other',
};

// Category Colors
export const CATEGORY_COLORS = {
  [PROPERTY_CATEGORIES.OWNER_OCCUPIED]: '#3b82f6', // blue
  [PROPERTY_CATEGORIES.NON_OWNER_OCCUPIED]: '#10b981', // green
  [PROPERTY_CATEGORIES.VACANT]: '#f59e0b', // amber
  [PROPERTY_CATEGORIES.ABSENTEE]: '#8b5cf6', // purple
  [PROPERTY_CATEGORIES.PROBATE]: '#ef4444', // red
  [PROPERTY_CATEGORIES.OTHER]: '#6b7280', // gray
}; 