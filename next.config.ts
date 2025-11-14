import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.samsung.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/soporte/comunidad",
        destination:
          "https://r1.community.samsung.com/t5/colombia/ct-p/co?profile.language=es&page=1&tab=recent_topics",
        permanent: false,
      },
      {
        source: "/soporte/comunidad",
        destination:
          "https://r1.community.samsung.com/t5/colombia/ct-p/co?profile.language=es&page=1&tab=recent_topics",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.devtunnels.ms https://imagiq-backend-production.up.railway.app https://customer-success-ms-production.up.railway.app https://www.clarity.ms https://*.clarity.ms https://scripts.clarity.ms https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://googletagmanager.com https://connect.facebook.net https://analytics.tiktok.com https://*.tiktok.com https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://media.flixsyndication.net https://syndication.flix360.com https://content.jwplatform.com https://assets-jpcust.jwpsrv.com https://ssl.p.jwpcdn.com https://d3nkfb7815bs43.cloudfront.net https://d2m3ikv8mpgiy8.cloudfront.net https://d3np41mctoibfu.cloudfront.net https://media.pointandplace.com https://player.pointandplace.com https://t.pointandplace.com https://delivery-alpha.flix360.io https://delivery-beta.flix360.io https://maps.googleapis.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http: http://localhost:* https://www.clarity.ms https://*.clarity.ms https://www.google-analytics.com https://www.facebook.com https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://res.cloudinary.com https://images.samsung.com https://images.unsplash.com https://d3nkfb7815bs43.cloudfront.net https://d2m3ikv8mpgiy8.cloudfront.net https://d3np41mctoibfu.cloudfront.net https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.ggpht.com https://*.googleusercontent.com",
              "font-src 'self' data: https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:* https://*.devtunnels.ms https://imagiq-backend-production.up.railway.app https://customer-success-ms-production.up.railway.app https://*.sentry.io https://*.ingest.sentry.io https://www.clarity.ms https://*.clarity.ms https://c.clarity.ms https://www.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.facebook.com https://graph.facebook.com https://analytics.tiktok.com https://*.tiktok.com https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://media.flixsyndication.net https://content.jwplatform.com https://assets-jpcust.jwpsrv.com https://ssl.p.jwpcdn.com https://d3nkfb7815bs43.cloudfront.net https://d2m3ikv8mpgiy8.cloudfront.net https://d3np41mctoibfu.cloudfront.net https://media.pointandplace.com https://player.pointandplace.com https://t.pointandplace.com https://maps.googleapis.com https://*.googleapis.com",
              "frame-src 'self' http://localhost:* https://imagiq-backend-production.up.railway.app https://www.googletagmanager.com https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://*.flix360.com https://content.jwplatform.com https://player.pointandplace.com https://*.google.com",
              "media-src 'self' blob: https://res.cloudinary.com https://media.flixcar.com https://media.flixfacts.com https://*.flix360.io https://content.jwplatform.com https://assets-jpcust.jwpsrv.com https://ssl.p.jwpcdn.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
