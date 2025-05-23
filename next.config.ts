
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  // ✅ Moved out of experimental as per Next.js 15+ changes
  outputFileTracingIncludes: {
    '/*': ['.next/server/vendor-chunks/**/*'],
  },

  experimental: {
    // You can add other experimental features here if needed
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // For ImgBB
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added for fallback images
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
