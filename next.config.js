/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during builds if SKIP_ESLINT_CHECK is set
    ignoreDuringBuilds: !!process.env.SKIP_ESLINT_CHECK,
  },
}

module.exports = nextConfig 