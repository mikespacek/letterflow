import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const getTemplate = async (id) => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching template with id ${id}:`, error);
    throw error;
  }
};

export const createTemplate = async (templateData) => {
  try {
    const response = await api.post('/templates', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (id, templateData) => {
  try {
    const response = await api.put(`/templates/${id}`, templateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating template with id ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting template with id ${id}:`, error);
    throw error;
  }
};

export const uploadCSV = async (formData) => {
  try {
    const response = await api.post('/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
};

export const getProperties = async () => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyCategories = async () => {
  try {
    const response = await api.get('/property-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching property categories:', error);
    throw error;
  }
};

export const generateLetters = async (data) => {
  try {
    const response = await api.post('/letters/generate', data);
    return response.data;
  } catch (error) {
    console.error('Error generating letters:', error);
    throw error;
  }
};

export { api }; 