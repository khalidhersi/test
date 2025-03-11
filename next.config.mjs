/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'logo.clearbit.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'example.com',
      'images.unsplash.com'
    ],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
}

export default nextConfig;

