// Service for template operations

/**
 * Get all templates for the current user
 * @returns {Promise<Array>} - List of templates
 */
export async function getTemplates() {
  try {
    const response = await fetch('/api/templates');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch templates');
    }

    return response.json();
  } catch (error) {
    console.error('Error in getTemplates service:', error);
    throw error;
  }
}

/**
 * Create a new template
 * @param {Object} data - Template data including name, category, content, and description
 * @returns {Promise<Object>} - The created template
 */
export async function createTemplate(data) {
  try {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create template');
    }

    return response.json();
  } catch (error) {
    console.error('Error in createTemplate service:', error);
    throw error;
  }
} 