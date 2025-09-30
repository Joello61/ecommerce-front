'use client'

import { CartDrawer } from '@/components/cart/CartDrawer'
import { useCart } from '@/components/providers/CartProvider'
import { useUI } from '@/components/providers/ThemeProvider'

export function ConnectedCartDrawer() {
  const { 
    cart, 
    isLoading, 
    updateQuantity, 
    removeItem 
  } = useCart()
  
  const { isCartDrawerOpen, closeCartDrawer } = useUI()

  return (
    <CartDrawer
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      cart={cart}
      isLoading={isLoading}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
    />
  )
}