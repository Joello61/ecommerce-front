'use client'

import { motion } from 'framer-motion'
import { Tag, Truck, CreditCard } from 'lucide-react'
import type { CartSummary as CartSummaryType } from '@/types'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  cart: CartSummaryType
  compact?: boolean
  showShipping?: boolean
  className?: string
}

export function CartSummary({ 
  cart, 
  compact = false, 
  showShipping = false,
  className 
}: CartSummaryProps) {
  const subtotal = parseFloat(cart.cart.totalPrice)
  const shipping = showShipping ? 4.99 : 0
  const total = subtotal + shipping
  const hasFreeShipping = subtotal >= 50

  return (
    <div className={className}>
      {/* Version compacte */}
      {compact ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{formatPrice(cart.cart.totalPrice)}</span>
          </div>
          
          {showShipping && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-medium">
                {hasFreeShipping ? (
                  <span className="text-success">Gratuite</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="font-semibold">Total</span>
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
            <span className="text-muted-foreground">
              Sous-total ({cart.cart.totalItems} article{cart.cart.totalItems > 1 ? 's' : ''})
            </span>
            <span className="font-semibold">{formatPrice(cart.cart.totalPrice)}</span>
          </div>

          {/* Livraison */}
          {showShipping && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Livraison</span>
                </div>
                <span className="font-semibold">
                  {hasFreeShipping ? (
                    <span className="text-success">Gratuite</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>

              {/* Barre de progression livraison gratuite */}
              {!hasFreeShipping && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-primary font-medium">
                      Livraison gratuite à partir de 50€
                    </span>
                    <span className="text-primary font-bold">
                      {formatPrice(50 - subtotal)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(subtotal / 50) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Plus que {formatPrice(50 - subtotal)} pour profiter de la livraison gratuite
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Code promo (placeholder) */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ajouter un code promo</span>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
            
            {/* Info paiement sécurisé */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}