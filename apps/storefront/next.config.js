/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    transpilePackages: ['@artifact/ui', '@artifact/core'],
  },
};

module.exports = nextConfig;
