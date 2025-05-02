import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Image optimization configuration
  images: {
    domains: ['avatars.githubusercontent.com'], // For future GitHub auth
    formats: ['image/avif', 'image/webp'],
  },

  // Headers for security
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ],

  // Redirects
  redirects: async () => [
    {
      source: '/github',
      destination: 'https://github.com/yourusername/typingspot',
      permanent: true,
    },
  ],
};

export default nextConfig;
