'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/providers'
import { useAuth, useCart } from '@/components/providers'
import Image from 'next/image'

// ===========================================
// HEADER COMPONENT
// ===========================================

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchFocused, setSearchFocused] = React.useState(false)
  
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const { cart } = useCart()

  // Fermer le menu mobile lors du changement de route
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const totalItems = cart.itemsCount

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container-custom">
        {/* Top bar - masqué sur mobile */}
        <div className="hidden sm:flex h-10 items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <span>Livraison gratuite dès 50€</span>
            <span>•</span>
            <span>Retours sous 30 jours</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/aide" className="hover:text-gray-900 dark:hover:text-gray-100">
              Aide
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-100">
              Contact
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-gray-100">
                E-commerce
              </span>
            </Link>
          </div>

          {/* Navigation - masquée sur mobile */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/products"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-600",
                pathname.startsWith('/products') 
                  ? "text-primary-600" 
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              Produits
            </Link>
            <Link
              href="/categories"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-600",
                pathname.startsWith('/categories') 
                  ? "text-primary-600" 
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              Catégories
            </Link>
            <Link
              href="/promotions"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-600",
                pathname.startsWith('/promotions') 
                  ? "text-primary-600" 
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              Promotions
            </Link>
            <Link
              href="/nouveautes"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-600",
                pathname.startsWith('/nouveautes') 
                  ? "text-primary-600" 
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              Nouveautés
            </Link>
          </nav>

          {/* Search bar - masquée sur très petit écran */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search mobile */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="sm:hidden"
              onClick={() => {
                // Toggle mobile search - à implémenter
              }}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <ThemeToggle size="sm" />

            {/* Wishlist */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
              >
                <Link href="/account/wishlist">
                  <HeartIcon className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon-sm"
              asChild
              className="relative"
            >
              <Link href="/cart">
                <ShoppingBagIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="error"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User menu */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
              >
                <Link href="/account">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link href="/login">
                  Connexion
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-950 shadow-xl">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <Link 
                href="/" 
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">E-commerce</span>
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                <Link
                  href="/products"
                  className="block text-lg font-medium text-gray-900 dark:text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Produits
                </Link>
                <Link
                  href="/categories"
                  className="block text-lg font-medium text-gray-900 dark:text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Catégories
                </Link>
                <Link
                  href="/promotions"
                  className="block text-lg font-medium text-gray-900 dark:text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Promotions
                </Link>
                <Link
                  href="/nouveautes"
                  className="block text-lg font-medium text-gray-900 dark:text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nouveautés
                </Link>
              </nav>

              {/* Mobile User Actions */}
              <div className="border-t pt-6 space-y-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="block text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mon compte
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mes commandes
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="block text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ma liste de souhaits
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button asChild fullWidth>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                    <Button variant="outline" asChild fullWidth>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Inscription
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Footer Links */}
              <div className="border-t pt-6 space-y-3">
                <Link
                  href="/aide"
                  className="block text-gray-600 dark:text-gray-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Aide & Support
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 dark:text-gray-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}