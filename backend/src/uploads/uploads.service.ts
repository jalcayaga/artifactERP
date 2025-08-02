import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UploadsService {
  async deleteFile(filename: string): Promise<void> {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);
    try {
      await unlink(filePath);
    } catch (error) {
      // Log the error for debugging purposes
      console.error(`Error deleting file ${filename}:`, error);
      throw new InternalServerErrorException(`Failed to delete file ${filename}`);
    }
  }
}
