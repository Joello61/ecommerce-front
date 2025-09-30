'use client'

import { Tag, Truck, CreditCard } from 'lucide-react'
import type { CartSummary } from '@/types'

interface CartSummaryProps {
  cart: CartSummary
  compact?: boolean
  showShipping?: boolean
  className?: string
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(numPrice)
}

export function CartSummary({ 
  cart, 
  compact = false, 
  showShipping = false,
  className 
}: CartSummaryProps) {
  const subtotal = typeof cart.cart.totalPrice === 'string' 
    ? parseFloat(cart.cart.totalPrice) 
    : cart.cart.totalPrice
  const shipping = showShipping ? 4.99 : 0
  const total = subtotal + shipping
  const hasFreeShipping = subtotal >= 50

  return (
    <div className={className}>
      {/* Version compacte */}
      {compact ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          
          {showShipping && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium text-gray-900">
                {hasFreeShipping ? (
                  <span className="text-success">Gratuite</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      ) : (
        /* Version complète */
        <div className="space-y-4">
          {/* Sous-total */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Sous-total ({cart.cart.totalItems} article{cart.cart.totalItems > 1 ? 's' : ''})
            </span>
            <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          {/* Livraison */}
          {showShipping && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Livraison</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {hasFreeShipping ? (
                    <span className="text-success">Gratuite</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>

              {/* Barre de progression livraison gratuite */}
              {!hasFreeShipping && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-primary font-medium">
                      Livraison gratuite à partir de 50€
                    </span>
                    <span className="text-primary font-bold">
                      {formatPrice(50 - subtotal)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Plus que {formatPrice(50 - subtotal)} pour profiter de la livraison gratuite
                  </p>
                </div>
              )}
            </>
          )}

          {/* Code promo (placeholder) */}
          <button className="flex items-center gap-2 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <Tag className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Ajouter un code promo</span>
          </button>

          {/* Total */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
            
            {/* Info paiement sécurisé */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}