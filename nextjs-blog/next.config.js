/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const path = require('path');

// 设置内容安全策略
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  child-src 'none';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  media-src 'none';
  object-src 'none';
  img-src * data:;
`

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
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  },
  async rewrites() {
    return [
      {
        source: '/api/image/:slug*',
        destination: `http://localhost:${process.env.PORT}/api/image/:slug*`
      },
      {
        source: '/api/comments/:slug*',
        destination: `http://localhost:${process.env.PORT}/api/comments/:slug*`
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
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
  
}

module.exports = withBundleAnalyzer(nextConfig)
