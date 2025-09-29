// src/app/(shop)/cart/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { CartItem } from '@/components/features/cart/CartItem'
import { CartSummary } from '@/components/features/cart/CartSummary'
import Loading from '@/components/ui/Loading'

export default function CartPage() {
  const router = useRouter()
  const {
    cart,
    isLoading,
    isEmpty,
    clearCart,
    refreshCart
  } = useCart()

  // Rafraîchir le panier au montage
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const handleClearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  // État de chargement
  if (isLoading && !cart) {
    return <Loading size="lg" text="Chargement du panier..." centered />
  }

  // Panier vide
  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-6">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">
              Découvrez notre sélection de produits et ajoutez vos articles préférés
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/products')}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Découvrir les produits
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/categories')}
                className="btn-outline"
              >
                Parcourir les catégories
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Panier</h1>
            <p className="text-muted-foreground">
              {cart?.cart.totalItems} article{cart?.cart.totalItems && cart.cart.totalItems > 1 ? 's' : ''} dans votre panier
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {/* Actions en-tête */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Articles</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearCart}
                disabled={isLoading}
                className="inline-flex items-center gap-2 text-sm text-danger hover:text-danger/80 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Vider le panier
              </motion.button>
            </div>

            {/* Items */}
            <AnimatePresence mode="popLayout">
              {cart?.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>

            {/* Continuer les achats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-6"
            >
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continuer mes achats
              </Link>
            </motion.div>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-4"
            >
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>
                
                <CartSummary 
                  cart={cart!} 
                  showShipping 
                />

                <div className="mt-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                  >
                    Passer la commande
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/products')}
                    className="btn-outline w-full"
                  >
                    Continuer mes achats
                  </motion.button>
                </div>

                {/* Informations supplémentaires */}
                <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span>Livraison gratuite dès 50€</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span>Retour gratuit sous 30 jours</span>
                  </div>
                </div>
              </div>

              {/* Moyens de paiement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Moyens de paiement acceptés
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                    <div
                      key={method}
                      className="px-3 py-2 bg-muted rounded text-xs font-medium"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}