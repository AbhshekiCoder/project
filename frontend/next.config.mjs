/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/socket', // our WebSocket proxy path
        destination: 'http://localhost:8080', // backend
      },
    ];
  },
};

export default nextConfig;

