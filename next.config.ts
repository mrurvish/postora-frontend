import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React 19 experimental features that can cause hydration issues
  experimental: {
    // Disable React 19's new features temporarily
    reactCompiler: false,
  },
  // Configure image domains for next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add webpack configuration to handle React 19
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure client-side rendering is consistent
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
