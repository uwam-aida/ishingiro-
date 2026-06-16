/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ishingiro-m4th.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;