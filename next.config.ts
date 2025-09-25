import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ==========================================
  // PERFORMANCE & OPTIMIZATION ESSENTIELLES
  // ==========================================
  
  experimental: {
    // Optimisation des imports
    optimizePackageImports: [
      '@heroicons/react',
      '@headlessui/react',
      'framer-motion',
    ],
    
    // Server Actions pour les formulaires
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

  // ==========================================
  // IMAGES OPTIMIZATION
  // ==========================================
  
  images: {
    formats: ['image/webp', 'image/avif'],
    
    // Domaines autorisés pour images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },

  // ==========================================
  // API PROXY VERS SYMFONY
  // ==========================================
  
  async rewrites() {
    return [
      {
        source: '/api/symfony/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },

  // ==========================================
  // WEBPACK CONFIGURATION MINIMALE
  // ==========================================
  
  webpack: (config) => {
    // Support SVG comme composants React
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    // Alias pour imports absolus
    config.resolve.alias = {
      ...config.resolve.alias,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      '@': require('path').resolve(__dirname, 'src'),
    }

    return config
  },

  // ==========================================
  // DÉVELOPPEMENT
  // ==========================================
  
  // React Strict Mode
  reactStrictMode: true,
  
  // Ignore les erreurs TypeScript en dev
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },

  // ==========================================
  // VARIABLES D'ENVIRONNEMENT
  // ==========================================
  
  env: {
    NEXT_PUBLIC_APP_NAME: 'E-commerce App',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

export default nextConfig