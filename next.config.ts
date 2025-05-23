
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['.next/server/vendor-chunks/**/*'],
    },
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
      }
    ],
  },
};

export default nextConfig;
