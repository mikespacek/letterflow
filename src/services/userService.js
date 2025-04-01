// Service for user and subscription operations

/**
 * Get the current user's data and subscription information
 * @returns {Promise<Object>} - User data and subscription details
 */
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/user');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user data');
    }

    return response.json();
  } catch (error) {
    console.error('Error in getCurrentUser service:', error);
    throw error;
  }
}

/**
 * Increment the user's upload count
 * @returns {Promise<Object>} - Updated user data
 */
export async function incrementUploadCount() {
  try {
    const response = await fetch('/api/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        incrementUploads: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update upload count');
    }

    return response.json();
  } catch (error) {
    console.error('Error in incrementUploadCount service:', error);
    throw error;
  }
} 