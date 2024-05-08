/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'anphashop.s3.ap-southeast-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
