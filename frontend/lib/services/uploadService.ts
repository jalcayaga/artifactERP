// frontend/lib/services/uploadService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const UploadService = {
  async uploadImage(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/uploads/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async deleteImage(filename: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/uploads/${filename}`);
    } catch (error) {
      console.error(`Error deleting image ${filename}:`, error);
      throw error;
    }
  },
};
