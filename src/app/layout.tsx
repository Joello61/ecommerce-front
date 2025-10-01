'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Figtree } from 'next/font/google'
import './globals.css'

import { useAuthStore } from '@/store/authStore'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { CartProvider } from '@/components/providers/CartProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

import { ShopHeader } from '@/components/layout/ShopHeader'
import { AuthHeader } from '@/components/layout/AuthHeader'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastManager } from '@/components/ToastManager'

const figtree = Figtree({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-figtree'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const checkAuth = useAuthStore(state => state.checkAuth)
  
  // Init auth au montage
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth()
    }, 50)

    return () => clearTimeout(timer)
  }, [checkAuth])
  
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
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                {isAuthPage ? <AuthHeader /> : <ShopHeader />}
                
                <main className="flex-1">{children}</main>
                
                <Footer />
                
                {!isAuthPage && <CartDrawer />}
              </div>
              <ToastManager />
            </CartProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}