import axios from 'axios';
import { ENDPOINTS } from './config';

// Types
export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  created_at: string;
}

export interface TemplateCreate {
  name: string;
  content: string;
  category: string;
}

export interface ProcessingStats {
  total: number;
  owner_occupied: number;
  renter_occupied: number;
  investor: number;
  unknown: number;
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  file_id?: string;
  stats?: ProcessingStats;
}

export interface ProcessedProperty {
  id: number;
  data: Record<string, any>;
  category: string;
  confidence: number;
  name_parsed: {
    first_name: string;
    last_name: string;
    is_business: boolean;
    original: string;
  };
}

export interface ProcessedFile {
  filename: string;
  processed_at: string;
  stats: ProcessingStats;
  data: ProcessedProperty[];
}

export interface GeneratedLetter {
  id: string;
  property_id: number;
  recipient: string;
  category: string;
  content: string;
}

export interface GeneratedLettersResponse {
  generated_at: string;
  template_id: string;
  file_id: string;
  count: number;
  categories: string[];
  letters: GeneratedLetter[];
}

// API client functions
export const api = {
  // Health check
  async checkHealth() {
    try {
      const response = await axios.get(ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      console.error('Health check failed', error);
      return { status: 'offline' };
    }
  },

  // Upload and process CSV file
  async uploadCSV(file: File): Promise<ProcessingResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('CSV upload failed', error);
      throw error;
    }
  },

  // Get processed file data
  async getProcessedFile(fileId: string): Promise<ProcessedFile> {
    try {
      const response = await axios.get(ENDPOINTS.PROCESSED(fileId));
      return response.data;
    } catch (error) {
      console.error(`Failed to get processed file ${fileId}`, error);
      throw error;
    }
  },

  // Template management
  async getTemplates(): Promise<Template[]> {
    try {
      const response = await axios.get(ENDPOINTS.TEMPLATES);
      return response.data;
    } catch (error) {
      console.error('Failed to get templates', error);
      throw error;
    }
  },

  async getTemplate(id: string): Promise<Template> {
    try {
      const response = await axios.get(ENDPOINTS.TEMPLATE(id));
      return response.data;
    } catch (error) {
      console.error(`Failed to get template ${id}`, error);
      throw error;
    }
  },

  async createTemplate(template: TemplateCreate): Promise<Template> {
    try {
      const response = await axios.post(ENDPOINTS.TEMPLATES, template);
      return response.data;
    } catch (error) {
      console.error('Failed to create template', error);
      throw error;
    }
  },

  async updateTemplate(id: string, template: TemplateCreate): Promise<Template> {
    try {
      const response = await axios.put(ENDPOINTS.TEMPLATE(id), template);
      return response.data;
    } catch (error) {
      console.error(`Failed to update template ${id}`, error);
      throw error;
    }
  },

  async deleteTemplate(id: string): Promise<{ status: string; message: string }> {
    try {
      const response = await axios.delete(ENDPOINTS.TEMPLATE(id));
      return response.data;
    } catch (error) {
      console.error(`Failed to delete template ${id}`, error);
      throw error;
    }
  },

  // Letter generation
  async generateLetters(
    fileId: string,
    templateId: string,
    categories?: string[]
  ): Promise<{ success: boolean; message: string; output_id?: string; count?: number }> {
    try {
      const response = await axios.post(
        ENDPOINTS.GENERATE_LETTERS(fileId, templateId),
        {},
        {
          params: {
            categories: categories,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate letters', error);
      throw error;
    }
  },

  async getGeneratedLetters(outputId: string): Promise<GeneratedLettersResponse> {
    try {
      const response = await axios.get(ENDPOINTS.GENERATED(outputId));
      return response.data;
    } catch (error) {
      console.error(`Failed to get generated letters ${outputId}`, error);
      throw error;
    }
  },
}; 