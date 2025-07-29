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
    // Disable SWC minification and other optimizations
    config.optimization.minimize = false;
    config.optimization.minimizer = [];
    
    // Disable SWC loader
    config.module.rules.forEach((rule) => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use.forEach((use) => {
          if (use.loader && use.loader.includes('swc')) {
            use.loader = 'babel-loader';
          }
        });
      }
    });
    
    return config;
  },
  env: {
    NEXT_SWC_DISABLE: '1',
  },
  output: 'standalone',
  trailingSlash: false,
}

module.exports = nextConfig 