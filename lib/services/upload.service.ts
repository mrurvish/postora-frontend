import { apiService } from '@/lib/api';

export interface UploadImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface UploadedFile {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  dimensions?: {
    width: number;
    height: number;
  };
  originalName: string;
  uploadedAt: Date;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    url: string;
    size: number;
    mimetype: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface MultipleUploadResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    files: Array<{
      filename: string;
      url: string;
      size: number;
      mimetype: string;
      dimensions?: {
        width: number;
        height: number;
      };
    }>;
  };
}

export interface ListFilesResponse {
  success: boolean;
  data: {
    files: UploadedFile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface FileInfoResponse {
  success: boolean;
  data: UploadedFile;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Upload Service - Handles all image upload operations
 * 
 * This service provides methods for uploading, managing, and retrieving images.
 * All endpoints require authentication and support various image processing options.
 */
class UploadService {
  /**
   * Upload a single image with processing options
   * 
   * @param file - The image file to upload
   * @param options - Image processing options (width, height, quality, format)
   * @returns Promise with upload result including filename, URL, and metadata
   * 
   * Use case: Profile picture upload, blog featured image, avatar upload
   * 
   * @example
   * ```typescript
   * const result = await UploadService.uploadImage(file, {
   *   width: 800,
   *   height: 600,
   *   quality: 80,
   *   format: 'jpeg'
   * });
   * ```
   */
  async uploadImage(
    file: File, 
    options: UploadImageOptions = {}
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add processing options if provided
    if (options.width) formData.append('width', options.width.toString());
    if (options.height) formData.append('height', options.height.toString());
    if (options.quality) formData.append('quality', options.quality.toString());
    if (options.format) formData.append('format', options.format);

    const response = await apiService.post('/upload/image', formData);
    
    if (!response.data) {
      throw new Error('Upload failed: No response data');
    }

    return response.data as UploadResponse;
  }

  /**
   * Upload multiple images at once
   * 
   * @param files - Array of image files to upload
   * @returns Promise with upload results for all images
   * 
   * Use case: Gallery upload, multiple blog images, batch profile pictures
   * 
   * @example
   * ```typescript
   * const results = await UploadService.uploadMultipleImages([file1, file2, file3]);
   * console.log(`Uploaded ${results.data.count} images`);
   * ```
   */
  async uploadMultipleImages(files: File[]): Promise<MultipleUploadResponse> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    const response = await apiService.post('/upload/multiple', formData);
    
    if (!response.data) {
      throw new Error('Multiple upload failed: No response data');
    }

    return response.data as MultipleUploadResponse;
  }

  /**
   * Delete an uploaded image by filename
   * 
   * @param filename - The filename of the image to delete
   * @returns Promise with deletion confirmation
   * 
   * Use case: Remove old profile pictures, clean up unused blog images
   * 
   * @example
   * ```typescript
   * await UploadService.deleteImage('1234567890-abc123.jpg');
   * ```
   */
  async deleteImage(filename: string): Promise<DeleteResponse> {
    const response = await apiService.delete(`/upload/${filename}`);
    
    if (!response.data) {
      throw new Error('Delete failed: No response data');
    }

    return response.data as DeleteResponse;
  }

  /**
   * List all uploaded files with pagination and filtering
   * 
   * @param options - Pagination and filter options
   * @returns Promise with paginated list of uploaded files
   * 
   * Use case: File management dashboard, image gallery, cleanup operations
   * 
   * @example
   * ```typescript
   * const files = await UploadService.listFiles({
   *   page: 1,
   *   limit: 20,
   *   type: 'jpeg',
   *   search: 'profile'
   * });
   * ```
   */
  async listFiles(options: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  } = {}): Promise<ListFilesResponse> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.type) params.append('type', options.type);
    if (options.search) params.append('search', options.search);

    const response = await apiService.get(`/upload/list?${params.toString()}`);
    
    if (!response.data) {
      throw new Error('List files failed: No response data');
    }

    return response.data as ListFilesResponse;
  }

  /**
   * Get detailed information about a specific uploaded file
   * 
   * @param filename - The filename to get info for
   * @returns Promise with detailed file information
   * 
   * Use case: File metadata display, image optimization analysis, storage management
   * 
   * @example
   * ```typescript
   * const fileInfo = await UploadService.getFileInfo('1234567890-abc123.jpg');
   * console.log(`File size: ${fileInfo.data.size} bytes`);
   * ```
   */
  async getFileInfo(filename: string): Promise<FileInfoResponse> {
    const response = await apiService.get(`/upload/info/${filename}`);
    
    if (!response.data) {
      throw new Error('Get file info failed: No response data');
    }

    return response.data as FileInfoResponse;
  }

  /**
   * Get upload statistics and analytics
   * 
   * @returns Promise with upload statistics
   * 
   * Use case: Dashboard analytics, storage monitoring, usage tracking
   * 
   * @example
   * ```typescript
   * const stats = await UploadService.getUploadStats();
   * console.log(`Total files: ${stats.data.totalFiles}`);
   * ```
   */
  async getUploadStats(): Promise<{
    success: boolean;
    data: {
      totalFiles: number;
      totalSize: number;
      fileTypes: Record<string, number>;
    };
  }> {
    const response = await apiService.get('/upload/stats');
    
    if (!response.data) {
      throw new Error('Get stats failed: No response data');
    }

    return response.data;
  }

  /**
   * Helper method to get the full URL for an uploaded image
   * 
   * @param filename - The filename of the image
   * @returns Full URL to access the image
   * 
   * Use case: Display images in UI, generate image tags, share image links
   * 
   * @example
   * ```typescript
   * const imageUrl = UploadService.getImageUrl('1234567890-abc123.jpg');
   * // Returns: http://localhost:5000/uploads/1234567890-abc123.jpg
   * ```
   */
  getImageUrl(filename: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${filename}`;
  }

  /**
   * Helper method to validate file before upload
   * 
   * @param file - The file to validate
   * @returns Validation result with error message if invalid
   * 
   * Use case: Client-side validation before upload, user feedback
   * 
   * @example
   * ```typescript
   * const validation = UploadService.validateFile(file);
   * if (!validation.valid) {
   *   console.error(validation.error);
   * }
   * ```
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Only image files are allowed' };
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'Only JPG, PNG, WebP, and GIF files are allowed' };
    }

    return { valid: true };
  }
}

export default new UploadService();

