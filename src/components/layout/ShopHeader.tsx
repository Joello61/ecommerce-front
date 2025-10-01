'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  LogOut,
  UserCircle,
  Search,
  Home, Package, Grid, Info, Mail
} from 'lucide-react'
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { ProductSearch } from '../products/ProductSearch'

export function ShopHeader() {
  const router = useRouter()
  const pathname = usePathname()
  
  // Store selectors
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const logout = useAuthStore(state => state.logout)
  const cartItemsCount = useCartStore(state => state.getItemsCount())
  const openCartDrawer = useUIStore(state => state.openCartDrawer)
  
  // Local state
  const [scrolled, setScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
      
      return () => document.removeEventListener('mousedown', handleClickOutside)
      }
  }, [isUserMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handlers
  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  const handleToggleUserMenu = () => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setIsUserMenuOpen(prev => !prev)
  }

  const handleToggleMobileMenu = () => {
    setIsUserMenuOpen(false)
    setIsSearchOpen(false)
    setIsMobileMenuOpen(prev => !prev)
  }

  const handleToggleSearch = () => {
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(prev => !prev)
  }

  const navLinks = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/products', label: 'Produits', icon: Package },
  { href: '/categories', label: 'Catégories', icon: Grid },
  { href: '/about', label: 'À propos', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
]

  const isProfilePage = pathname?.includes('/profile') || pathname?.includes('/orders') || pathname === '/'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-md'
          : 'bg-background border-gray-200'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-primary to-secondary group-hover:opacity-90 transition-opacity">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>

            <span className="hidden sm:block font-bold text-xl">C&apos;est KDO Store</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-[16px] font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSearch}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => router.push('/wishlist')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Liste de souhaits"
            >
              <Heart className="h-5 w-5" />
            </button>

            <button
              onClick={openCartDrawer}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
              aria-label="Panier"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center"
                >
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </motion.span>
              )}
            </button>

            {/* Menu utilisateur */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleToggleUserMenu}
                className={cn(
                  'p-2 hover:bg-gray-50 rounded-lg transition-colors',
                  isUserMenuOpen && 'bg-gray-100'
                )}
                aria-label="Menu utilisateur"
                aria-expanded={isUserMenuOpen}
              >
                <User className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <p className="font-semibold text-gray-900">{user?.fullName}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            <UserCircle className="h-4 w-4" />
                            Mon profil
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            <Package className="h-4 w-4" />
                            Mes commandes
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-danger text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 space-y-2">
                        <button
                          onClick={() => {
                            router.push('/login')
                            setIsUserMenuOpen(false)
                          }}
                          className="btn-primary w-full"
                        >
                          Se connecter
                        </button>
                        <button
                          onClick={() => {
                            router.push('/register')
                            setIsUserMenuOpen(false)
                          }}
                          className="btn-outline w-full"
                        >
                          Créer un compte
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={handleToggleMobileMenu}
              className={cn(
                'lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors',
                isMobileMenuOpen && 'bg-gray-100'
              )}
              aria-label="Menu de navigation"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Barre de recherche desktop */}
        {isProfilePage ? null : (
          <div className="hidden lg:block pb-4">
          <div className="max-w-2xl mx-auto">
            <ProductSearch />
          </div>
        </div>
        )}
      </div>

      {/* Barre de recherche mobile */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-gray-200"
          >
            <div className="container py-4">
              <ProductSearch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu mobile de navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-gray-200 bg-white"
          >
            <nav className="container py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-lg transition-colors',
                      pathname === link.href
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                )
              })}

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}