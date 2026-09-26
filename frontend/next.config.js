/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      {
        source: '/faxina',
        destination: 'https://frontend-production-48dbe.up.railway.app/faxina/',
      },
      {
        source: '/faxina/:path*',
        destination: 'https://frontend-production-48dbe.up.railway.app/faxina/:path*',
      },
      {
        source: '/teomed-filemaker',
        destination:
          'https://frontend-production-d0898.up.railway.app/teomed-filemaker',
      },
      {
        source: '/teomed-filemaker/:path*',
        destination:
          'https://frontend-production-d0898.up.railway.app/teomed-filemaker/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
