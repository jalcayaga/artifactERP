// frontend/lib/services/uploadService.ts
import { api } from '../api'

export const UploadService = {
  async uploadImage(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post(
        `/uploads/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  async deleteImage(filename: string): Promise<void> {
    try {
      await api.delete(`/uploads/${filename}`)
    } catch (error) {
      console.error(`Error deleting image ${filename}:`, error)
      throw error
    }
  },
}
