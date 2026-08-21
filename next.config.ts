
import type {NextConfig} from 'next';

const securityHeaders = [
  // Force HTTPS on every future visit for a year, including subdomains.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Prevent the site from being embedded in a foreign <iframe> (clickjacking protection).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop browsers from MIME-sniffing a response away from its declared content-type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only send the origin (not full URL/path) as the referrer to other sites.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features this site doesn't use.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
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
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
