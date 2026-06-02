/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/components",
        permanent: true,
      },
      {
        source: "/docs/:path*",
        destination: "/components/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
