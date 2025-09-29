import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Optimisation des images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.votre-domaine.com',
        pathname: '/uploads/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Optimisation du build
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      'framer-motion',
      '@tanstack/react-query'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Compilation optimisée
  swcMinify: true,
  poweredByHeader: false,

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Redirections pour l'e-commerce
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/store',
        destination: '/products',
        permanent: true,
      },
    ]
  },

  // Rewrites pour l'API
  async rewrites() {
    return [
      {
        source: '/api-docs/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/docs/:path*`,
      },
    ]
  },

  // Webpack optimisations
  webpack: (config, { dev, isServer }) => {
    // Optimisation pour la production
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        '@/components': require('path').resolve(__dirname, 'src/components'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        '@/lib': require('path').resolve(__dirname, 'src/lib'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        '@/types': require('path').resolve(__dirname, 'src/types'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        '@/store': require('path').resolve(__dirname, 'src/store'),
      }
    }

    return config
  },

  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig