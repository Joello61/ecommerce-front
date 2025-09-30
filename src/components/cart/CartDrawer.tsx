'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import type { CartSummary as Cart } from '@/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: Cart | null
  isLoading?: boolean
  onUpdateQuantity?: (itemId: number, quantity: number) => Promise<void>
  onRemoveItem?: (itemId: number) => Promise<void>
}

export function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  isLoading = false,
  onUpdateQuantity,
  onRemoveItem 
}: CartDrawerProps) {
  const router = useRouter()
  const isEmpty = !cart || cart.items.length === 0

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  const handleViewCart = () => {
    onClose()
    router.push('/cart')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay avec animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer avec animation slide */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">
                  Panier {!isEmpty && `(${cart.cart.totalItems})`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEmpty ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center h-full p-6 text-center"
                >
                  <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ajoutez des produits pour commencer vos achats
                  </p>
                  <button
                    onClick={() => {
                      onClose()
                      router.push('/products')
                    }}
                    className="btn-primary"
                  >
                    Découvrir les produits
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 space-y-4"
                >
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CartItem 
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemoveItem}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer avec résumé */}
            {!isEmpty && cart && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t border-gray-200 p-6 space-y-4"
              >
                <CartSummary cart={cart} compact />
                
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full"
                  >
                    Commander
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleViewCart}
                    className="btn-outline w-full"
                  >
                    Voir le panier complet
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}