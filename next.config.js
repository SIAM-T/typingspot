/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⛔ disables ESLint errors in production builds
  },
  typescript: {
    ignoreBuildErrors: true, // ⛔ ignores TypeScript errors
  },
  // Disable type checking during production builds
  experimental: {
    typedRoutes: false,
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
