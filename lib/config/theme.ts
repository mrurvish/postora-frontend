// 🎨 Theme Configuration - Customize everything from here!
export const THEME_CONFIG = {
  // Brand Identity
  brand: {
    name: 'Postora',
    logoLetter: 'P',
    tagline: 'Share Your Thoughts',
    description: 'A modern blog platform for sharing your thoughts with the world',
    fullDescription: 'Share your thoughts, connect with readers, and build your audience. Join thousands of writers who are already sharing their stories with the world.'
  },

  // Color Palette - Light Theme
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(220 15% 20%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(220 15% 20%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(220 15% 20%)',
    primary: 'hsl(262 83% 58%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(220 10% 96%)',
    secondaryForeground: 'hsl(220 15% 20%)',
    muted: 'hsl(220 10% 96%)',
    mutedForeground: 'hsl(220 10% 40%)',
    accent: 'hsl(220 10% 96%)',
    accentForeground: 'hsl(220 15% 20%)',
    destructive: 'hsl(0 84% 60%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(220 10% 90%)',
    input: 'hsl(220 10% 90%)',
    ring: 'hsl(262 83% 58%)',
    radius: '1rem',
    
    // Social Media Specific Colors
    like: 'hsl(0 84% 60%)',
    comment: 'hsl(200 70% 50%)',
    share: 'hsl(160 50% 40%)',
    follow: 'hsl(262 83% 58%)',
    story: 'hsl(280 50% 50%)',
    trending: 'hsl(40 70% 50%)',
    
    // Chart Colors
    chart1: 'hsl(262 83% 58%)',
    chart2: 'hsl(160 50% 40%)',
    chart3: 'hsl(40 70% 50%)',
    chart4: 'hsl(0 84% 60%)',
    chart5: 'hsl(280 50% 50%)'
  },

  // Color Palette - Dark Theme
  dark: {
    background: 'hsl(220 15% 8%)',
    foreground: 'hsl(220 10% 90%)',
    card: 'hsl(220 15% 12%)',
    cardForeground: 'hsl(220 10% 90%)',
    popover: 'hsl(220 15% 12%)',
    popoverForeground: 'hsl(220 10% 90%)',
    primary: 'hsl(262 83% 58%)',
    primaryForeground: 'hsl(220 15% 8%)',
    secondary: 'hsl(220 15% 16%)',
    secondaryForeground: 'hsl(220 10% 90%)',
    muted: 'hsl(220 15% 16%)',
    mutedForeground: 'hsl(220 10% 60%)',
    accent: 'hsl(220 15% 16%)',
    accentForeground: 'hsl(220 10% 90%)',
    destructive: 'hsl(0 60% 45%)',
    destructiveForeground: 'hsl(220 10% 90%)',
    border: 'hsl(220 15% 20%)',
    input: 'hsl(220 15% 20%)',
    ring: 'hsl(262 83% 58%)',
    radius: '1rem',
    
    // Social Media Specific Colors - Dark
    like: 'hsl(0 60% 45%)',
    comment: 'hsl(200 60% 40%)',
    share: 'hsl(160 50% 35%)',
    follow: 'hsl(262 83% 58%)',
    story: 'hsl(280 50% 50%)',
    trending: 'hsl(40 70% 45%)',
    
    // Chart Colors - Dark
    chart1: 'hsl(262 83% 58%)',
    chart2: 'hsl(160 50% 40%)',
    chart3: 'hsl(40 70% 45%)',
    chart4: 'hsl(0 60% 45%)',
    chart5: 'hsl(280 50% 50%)'
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem'
  },

  // Shadows
  shadows: {
    soft: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },

  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const;

// Export individual values for backward compatibility
export const BRAND_CONFIG = THEME_CONFIG.brand;
export const BRAND_NAME = THEME_CONFIG.brand.name;
export const BRAND_LOGO_LETTER = THEME_CONFIG.brand.logoLetter;
export const BRAND_TAGLINE = THEME_CONFIG.brand.tagline;
export const BRAND_DESCRIPTION = THEME_CONFIG.brand.description;
export const BRAND_FULL_DESCRIPTION = THEME_CONFIG.brand.fullDescription;
