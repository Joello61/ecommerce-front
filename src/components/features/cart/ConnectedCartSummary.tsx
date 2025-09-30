'use client'

import { CartSummary as CartSummaryUI } from '@/components/cart/CartSummary'
import { useCart } from '@/components/providers/CartProvider'

interface ConnectedCartSummaryProps {
  compact?: boolean
  showShipping?: boolean
  className?: string
}

export function ConnectedCartSummary({ 
  compact, 
  showShipping = true,
  className 
}: ConnectedCartSummaryProps) {
  const { cart } = useCart()

  if (!cart) {
    return (
      <div className={className}>
        <div className="card p-6 text-center text-gray-600">
          Chargement du panier...
        </div>
      </div>
    )
  }

  return (
    <CartSummaryUI
      cart={cart}
      compact={compact}
      showShipping={showShipping}
      className={className}
    />
  )
}