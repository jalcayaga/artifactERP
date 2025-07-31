/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
