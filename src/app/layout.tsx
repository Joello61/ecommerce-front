// app/layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Figtree } from 'next/font/google'
import './globals.css'

import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/components/providers/CartProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

import { ConnectedShopHeader } from '@/components/features/layouts/ConnectedShopHeader'
import { AuthHeader } from '@/components/layout/AuthHeader'
import { Footer } from '@/components/layout/Footer'
import { ConnectedCartDrawer } from '@/components/features/cart/ConnectedCartDrawer'

const figtree = Figtree({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-figtree'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isAuthPage = pathname?.includes('/login') || 
                     pathname?.includes('/register') || 
                     pathname?.includes('/forgot-password') ||
                     pathname?.includes('/reset-password') ||
                     pathname?.includes('/change-password')

  return (
    <html lang="fr" suppressHydrationWarning className={figtree.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <ThemeProvider defaultLanguage="fr">
            <AuthProvider>
              <CartProvider>
                <div className="min-h-screen flex flex-col">
                  {/* Header conditionnel */}
                  {isAuthPage ? <AuthHeader /> : <ConnectedShopHeader />}
                  
                  {/* Contenu */}
                  <main className="flex-1">{children}</main>
                  
                  {/* Footer */}
                  <Footer />
                  
                  {/* CartDrawer - seulement hors auth */}
                  {!isAuthPage && <ConnectedCartDrawer />}
                </div>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}