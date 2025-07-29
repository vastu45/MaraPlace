/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  webpack: (config, { isServer }) => {
    // Disable SWC minification
    config.optimization.minimize = false;
    return config;
  },
  env: {
    NEXT_SWC_DISABLE: '1',
  },
}

module.exports = nextConfig 