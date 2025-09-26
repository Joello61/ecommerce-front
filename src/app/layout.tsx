import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'
import Script from 'next/script'

// ===========================================
// FONT CONFIGURATION
// ===========================================

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

// ===========================================
// METADATA
// ===========================================

export const metadata: Metadata = {
  title: {
    default: 'E-commerce - Votre boutique en ligne',
    template: '%s | E-commerce'
  },
  description: 'Découvrez notre sélection de produits de qualité avec livraison rapide et service client exceptionnel. Livraison gratuite dès 50€.',
  keywords: ['e-commerce', 'boutique en ligne', 'livraison gratuite', 'qualité'],
  authors: [{ name: 'E-commerce Team' }],
  creator: 'E-commerce',
  publisher: 'E-commerce',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'E-commerce - Votre boutique en ligne',
    description: 'Découvrez notre sélection de produits de qualité avec livraison rapide.',
    siteName: 'E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce - Votre boutique en ligne',
    description: 'Découvrez notre sélection de produits de qualité avec livraison rapide.',
    creator: '@ecommerce',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

// ===========================================
// VIEWPORT CONFIGURATION
// ===========================================

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

// ===========================================
// ROOT LAYOUT COMPONENT
// ===========================================

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="fr" 
      className={cn(inter.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <head>
        {/* DNS Prefetch pour les domaines externes */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Preconnect pour Google Fonts (améliore les performances) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          'selection:bg-primary-500/20 selection:text-primary-900',
          'dark:selection:bg-primary-400/20 dark:selection:text-primary-100'
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* Skip to main content (accessibilité) */}
            <a 
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md"
            >
              Aller au contenu principal
            </a>
            
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <main 
              id="main-content" 
              className="flex-1"
              role="main"
            >
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
          
          {/* Toast Container sera injecté ici par NotificationProvider */}
        </Providers>
        
        {/* Analytics Scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `,
                  }}
                />
              </>
            )}
            
            {/* Google Tag Manager */}
            {process.env.NEXT_PUBLIC_GTM_ID && (
              <>
                <Script id="gtm-script" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
      `}
    </Script>
                <noscript>
                  <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                  />
                </noscript>
              </>
            )}
          </>
        )}
      </body>
    </html>
  )
} 