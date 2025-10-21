import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://media.flixsyndication.net https://syndication.flix360.com https://content.jwplatform.com https://assets-jpcust.jwpsrv.com https://ssl.p.jwpcdn.com https://d3nkfb7815bs43.cloudfront.net http://d2m3ikv8mpgiy8.cloudfront.net https://d3np41mctoibfu.cloudfront.net https://media.pointandplace.com https://player.pointandplace.com https://t.pointandplace.com https://delivery-alpha.flix360.io https://delivery-beta.flix360.io",
              "style-src 'self' 'unsafe-inline' https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com",
              "img-src 'self' data: blob: https: https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://res.cloudinary.com https://images.samsung.com https://images.unsplash.com https://d3nkfb7815bs43.cloudfront.net https://d2m3ikv8mpgiy8.cloudfront.net https://d3np41mctoibfu.cloudfront.net",
              "font-src 'self' data: https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io",
              "connect-src 'self' http://localhost:* https://imagiq-backend-production.up.railway.app http://localhost:3001 https://media.flixcar.com https://media.flixcar.com http://media.flixfacts.com https://media.flixfacts.com http://*.flix360.io https://*.flix360.io http://*.flix360.com https://*.flix360.com https://media.flixsyndication.net https://content.jwplatform.com https://assets-jpcust.jwpsrv.com https://ssl.p.jwpcdn.com https://d3nkfb7815bs43.cloudfront.net http://d2m3ikv8mpgiy8.cloudfront.net https://d3np41mctoibfu.cloudfront.net https://media.pointandplace.com https://player.pointandplace.com https://t.pointandplace.com",
              "frame-src 'self' https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://content.jwplatform.com https://player.pointandplace.com intent://arvr.google.com",
              "media-src 'self' blob: https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://content.jwplatform.com https://assets-jpcust.jwpsrv.com https://ssl.p.jwpcdn.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
