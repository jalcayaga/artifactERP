/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@artifact/ui', '@artifact/core'],
};

module.exports = nextConfig;
