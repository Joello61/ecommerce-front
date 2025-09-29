// src/app/(shop)/layout.tsx
'use client'

import { ReactNode, useState, useEffect } from 'react'
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
  Package,
  UserCircle,
  Search
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/components/providers/CartProvider'
import { CartDrawer } from '@/components/features/cart/CartDrawer'
import { ProductSearch } from '@/components/features/products/ProductSearch'
import { cn } from '@/lib/utils'

interface ShopLayoutProps {
  children: ReactNode
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { getItemsCount } = useCart()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const cartItemsCount = getItemsCount()

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer les menus au changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/products', label: 'Produits' },
    { href: '/categories', label: 'Catégories' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-all duration-300',
          scrolled 
            ? 'bg-background/95 backdrop-blur-lg shadow-md' 
            : 'bg-background border-border'
        )}
      >
        <div className="container">
          {/* Barre du haut */}
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="hidden sm:block font-heading font-bold text-xl">
                Emerald Store
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Recherche mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Favoris */}
              <button
                onClick={() => router.push('/wishlist')}
                className="hidden sm:flex p-2 hover:bg-muted rounded-lg transition-colors relative"
                title="Favoris"
              >
                <Heart className="h-5 w-5" />
              </button>

              {/* Panier */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
                title="Panier"
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
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title={isAuthenticated ? 'Mon compte' : 'Connexion'}
                >
                  <User className="h-5 w-5" />
                </button>

                {/* Dropdown utilisateur */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="p-4 border-b border-border bg-muted/50">
                            <p className="font-semibold">{user?.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                            >
                              <UserCircle className="h-4 w-4" />
                              Mon profil
                            </Link>
                            <Link
                              href="/orders"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                            >
                              <Package className="h-4 w-4" />
                              Mes commandes
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-danger"
                            >
                              <LogOut className="h-4 w-4" />
                              Déconnexion
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 space-y-2">
                          <button
                            onClick={() => router.push('/login')}
                            className="btn-primary w-full"
                          >
                            Se connecter
                          </button>
                          <button
                            onClick={() => router.push('/register')}
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

              {/* Menu burger mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Barre de recherche desktop */}
          <div className="hidden lg:block pb-4">
            <ProductSearch className="max-w-2xl mx-auto" />
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="container py-4">
                <ProductSearch />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <nav className="container py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block px-4 py-3 rounded-lg transition-colors',
                      pathname === link.href
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* À propos */}
            <div>
              <h3 className="font-semibold mb-4">Emerald Store</h3>
              <p className="text-sm text-muted-foreground">
                Votre boutique en ligne de confiance pour des produits de qualité.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">À propos</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">CGV</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Confidentialité</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recevez nos offres exclusives
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="input flex-1 text-sm"
                />
                <button className="btn-primary px-4">OK</button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Emerald Store. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  )
}