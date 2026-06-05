import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing attacks
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Deny framing to block clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Control referer information leak
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser feature access
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Enforce HTTPS for 2 years, include subdomains, allow preload
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js inline scripts + Google AdSense
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://consentcdn.cookiebot.com",
      // Allow inline styles (needed by Next.js SSR) + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self, data URIs (base64 previews), Unsplash, uploads
      "img-src 'self' data: blob: https://images.unsplash.com https://pagead2.googlesyndication.com",
      // API calls
      "connect-src 'self' https://www.google-analytics.com",
      // Google AdSense iframes
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      // Block all framing of this site
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

