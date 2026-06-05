// Next.js config with next-pwa for offline-capable PWA builds
const withPWA = require('next-pwa')({
  dest: 'public',
  /** Disable service worker in development to avoid cache confusion */
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/v1\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'portfolio-api',
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    // Optimise packages imported only on server
    optimizePackageImports: ['@tabler/icons-react'],
  },
};

module.exports = withPWA(nextConfig);
