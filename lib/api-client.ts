import { AuthService } from './services/auth.service';
import { ProfileService } from './services/profile.service';
import { UserService } from './services/user.service';
import { BlogService } from './services/blog.service';
import { CommentService } from './services/comment.service';
import { UploadService } from './services/upload.service';

/**
 * Main API client that provides access to all service classes
 * This centralizes all API calls and provides a clean interface
 */
export class ApiClient {
  // Authentication and user management
  static auth = AuthService;
  static profile = ProfileService;
  static users = UserService;
  
  // Content management
  static blogs = BlogService;
  static comments = CommentService;
  
  // File management
  static upload = UploadService;

  // Helper method to get all available services
  static getServices() {
    return {
      auth: AuthService,
      profile: ProfileService,
      users: UserService,
      blogs: BlogService,
      comments: CommentService,
      upload: UploadService,
    };
  }

  // Method to check if a service is available
  static hasService(serviceName: string): boolean {
    const services = this.getServices();
    return serviceName in services;
  }

  // Method to get a specific service by name
  static getService<T>(serviceName: string): T | null {
    const services = this.getServices();
    return services[serviceName as keyof typeof services] as T || null;
  }

  // Method to get all service names
  static getServiceNames(): string[] {
    return Object.keys(this.getServices());
  }

  // Method to validate service availability
  static validateServices(): { available: string[]; missing: string[] } {
    const expectedServices = [
      'auth',
      'profile', 
      'users',
      'blogs',
      'comments',
      'upload'
    ];

    const available = expectedServices.filter(service => 
      this.hasService(service)
    );

    const missing = expectedServices.filter(service => 
      !this.hasService(service)
    );

    return { available, missing };
  }
}

// Export individual services for direct import
export {
  AuthService,
  ProfileService,
  UserService,
  BlogService,
  CommentService,
  UploadService,
};

// Export the main client
export default ApiClient;
