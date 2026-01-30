/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dojiw2m9tvv09.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Add other Next.js specific configurations here if needed in the future.
  // For example, for internationalization or environment variables.
};

module.exports = nextConfig;
