/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@artifact/ui', '@artifact/core'],
};

module.exports = nextConfig;
