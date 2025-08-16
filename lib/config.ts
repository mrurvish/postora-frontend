// Brand Configuration - Change values here to update across the entire application
export const BRAND_CONFIG = {
  name: 'Postora',
  logoLetter: 'P',
  tagline: 'Share Your Thoughts',
  description: 'A modern blog platform for sharing your thoughts with the world',
  fullDescription: 'Share your thoughts, connect with readers, and build your audience. Join thousands of writers who are already sharing their stories with the world.'
} as const;

// Export individual values for backward compatibility
export const BRAND_NAME = BRAND_CONFIG.name;
export const BRAND_LOGO_LETTER = BRAND_CONFIG.logoLetter;
export const BRAND_TAGLINE = BRAND_CONFIG.tagline;
export const BRAND_DESCRIPTION = BRAND_CONFIG.description;
export const BRAND_FULL_DESCRIPTION = BRAND_CONFIG.fullDescription;
