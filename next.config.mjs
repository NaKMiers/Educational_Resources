/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'img.vietqr.io',
      'api.qrserver.com',
    ].map(hostname => ({ protocol: 'https', hostname })),
  },
}

export default nextConfig
