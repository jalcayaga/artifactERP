/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@artifact/ui', '@artifact/core'],
  images: {
    domains: ['igscuchfztqvzwtehqag.supabase.co', 'artifact.cl', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
