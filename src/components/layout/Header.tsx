'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingCart, Search, User, Menu, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useCart } from '@/components/providers/CartProvider'
import { useThemeMode, useUI } from '@/components/providers/ThemeProvider'
import { Navigation } from './Navigation'
import { APP_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const { isAuthenticated, user } = useAuth()
  const { getItemsCount } = useCart()
  const { isDark, toggleTheme } = useThemeMode()
  const { isMobileMenuOpen, toggleMobileMenu, openSearchModal, openCartDrawer } = useUI()
  
  const cartCount = getItemsCount()

  // Masquer le header au scroll down, afficher au scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' }
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'bg-background/80 backdrop-blur-lg border-b border-border',
          'transition-all duration-300'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-primary/10 p-2 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </span>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:block">
              <Navigation />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Recherche */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSearchModal}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Changer le thème"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              {/* Panier */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCartDrawer}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Panier"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Compte */}
              <Link href={isAuthenticated ? '/account/profile' : '/login'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <User className="h-5 w-5" />
                  {isAuthenticated && user && (
                    <span className="text-sm font-medium hidden md:inline">
                      {user.firstName}
                    </span>
                  )}
                </motion.button>
              </Link>

              {/* Menu Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Mobile */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-4 py-4">
              <Navigation mobile onLinkClick={toggleMobileMenu} />
              {!isAuthenticated && (
                <div className="mt-4 space-y-2">
                  <Link href="/login" onClick={toggleMobileMenu}>
                    <button className="w-full px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                      Se connecter
                    </button>
                  </Link>
                  <Link href="/register" onClick={toggleMobileMenu}>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                      S&apos;inscrire
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Spacer pour compenser le header fixed */}
      <div className="h-16" />
    </>
  )
}