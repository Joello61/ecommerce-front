// ===== ConnectedShopHeader.tsx =====
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShopHeader } from '@/components/layout/ShopHeader'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/components/providers/CartProvider'
import { useUI } from '@/components/providers/ThemeProvider'
import { ConnectedProductSearch } from '@/components/features/products/ConnectedProductSearch'

export function ConnectedShopHeader() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { getItemsCount } = useCart()
  const { openCartDrawer } = useUI()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // ✅ FIX: Utiliser useCallback pour éviter les recréations
  const handleCloseUserMenu = useCallback(() => setIsUserMenuOpen(false), [])
  const handleCloseMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  const handleToggleUserMenu = () => {
    console.log('Toggle User Menu - Avant:', { isUserMenuOpen, isMobileMenuOpen, isSearchOpen })
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setIsUserMenuOpen(prev => !prev)
    console.log('Toggle User Menu - Après toggle')
  }

  const handleToggleMobileMenu = () => {
    console.log('Toggle Mobile Menu - Avant:', { isUserMenuOpen, isMobileMenuOpen, isSearchOpen })
    setIsUserMenuOpen(false)
    setIsSearchOpen(false)
    setIsMobileMenuOpen(prev => !prev)
    console.log('Toggle Mobile Menu - Après toggle')
  }

  const handleToggleSearch = () => {
    console.log('Toggle Search - Avant:', { isUserMenuOpen, isMobileMenuOpen, isSearchOpen })
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(prev => !prev)
    console.log('Toggle Search - Après toggle')
  }

  return (
    <ShopHeader
      user={user}
      isAuthenticated={isAuthenticated}
      cartItemsCount={getItemsCount()}
      isUserMenuOpen={isUserMenuOpen}
      isMobileMenuOpen={isMobileMenuOpen}
      isSearchOpen={isSearchOpen}
      onToggleUserMenu={handleToggleUserMenu}
      onToggleMobileMenu={handleToggleMobileMenu}
      onToggleSearch={handleToggleSearch}
      onCloseUserMenu={handleCloseUserMenu}
      onCloseMobileMenu={handleCloseMobileMenu}
      onLogout={handleLogout}
      onOpenCart={openCartDrawer}
      onNavigate={(path) => router.push(path)}
      searchComponent={<ConnectedProductSearch />}
    />
  )
}