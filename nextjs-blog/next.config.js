/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  i18n: {
    locales: ["zh"],
    defaultLocale: "zh",
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost']
  },
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `http://localhost:${process.env.PORT}/api/:slug*`
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          
        ],
      },
    ]
  },
  
}

module.exports = withBundleAnalyzer(nextConfig)
