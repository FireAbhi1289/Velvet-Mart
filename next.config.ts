
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // This configuration helps ensure that specific files or patterns,
    // which might be missed by Next.js's automatic output file tracing,
    // are included in the 'standalone' build output.
    // The key is a glob pattern for routes, and the value is an array of
    // file/directory globs (relative to the project root) to include.
    outputFileTracingIncludes: {
      // For all routes matched by '/*', ensure that all files within
      // the '.next/server/vendor-chunks' directory (generated during the build)
      // are included in the standalone output. This can help resolve
      // "module not found" errors for chunks at runtime.
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
