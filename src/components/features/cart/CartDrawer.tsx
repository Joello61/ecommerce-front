'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useUI } from '@/components/providers/ThemeProvider'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'

export function CartDrawer() {
  const router = useRouter()
  const { isCartDrawerOpen, closeCartDrawer } = useUI()
  const { cart, isEmpty, isLoading } = useCart()

  const handleCheckout = () => {
    closeCartDrawer()
    router.push('/checkout')
  }

  const handleViewCart = () => {
    closeCartDrawer()
    router.push('/cart')
  }

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">
                  Panier {!isEmpty() && `(${cart?.cart.totalItems})`}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCartDrawer}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEmpty() ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
                  <p className="text-muted-foreground mb-6">
                    Ajoutez des produits pour commencer vos achats
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      closeCartDrawer()
                      router.push('/products')
                    }}
                    className="btn-primary"
                  >
                    Découvrir les produits
                  </motion.button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cart?.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec résumé */}
            {!isEmpty() && (
              <div className="border-t border-border p-6 space-y-4">
                <CartSummary cart={cart!} compact />
                
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                  >
                    Commander
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleViewCart}
                    className="btn-outline w-full"
                  >
                    Voir le panier complet
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}