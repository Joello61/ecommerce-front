'use client'

import * as React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from './auth-provider'
import { CartProvider } from './cart-provider'

// ===========================================
// PROVIDERS COMPONENT
// ===========================================

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// ===========================================
// EXPORTS
// ===========================================

export { ThemeProvider, ThemeToggle, useThemeDetection } from './theme-provider'
export { 
  AuthProvider, 
  useAuth, 
  useAuthStatus, 
  useRequireAuth,
  AuthGuard,
  GuestGuard 
} from './auth-provider'
export { 
  CartProvider, 
  useCart, 
  useCartCount, 
  useCartTotal,
  useCartItem,
  useCartPersistence 
} from './cart-provider'