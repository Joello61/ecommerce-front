'use client'

import Link from 'next/link'
import { useCartStore, useCart, useIsCartEmpty } from '@/store/cartStore'
import { CartSummary } from '@/components/cart/CartSummary'
import { CartItem } from '@/components/cart/CartItem'

export default function CartPage() {
  const cart = useCart()
  const isEmpty = useIsCartEmpty()
  const isLoading = useCartStore(state => state.isLoading)
  const clearCart = useCartStore(state => state.clearCart)

  const handleClearCart = async () => {
    if (window.confirm('Vider votre panier ?')) {
      await clearCart()
    }
  }

  // Panier vide
  if (isEmpty) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 mb-8">
            Découvrez nos produits et ajoutez vos articles préférés
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn-primary">
              Découvrir les produits
            </Link>
            <Link href="/categories" className="btn-outline">
              Parcourir les catégories
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container py-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Panier</h1>
          <p className="text-gray-600">
            {cart?.cart.totalItems} article{cart?.cart.totalItems && cart.cart.totalItems > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
              <button
                onClick={handleClearCart}
                disabled={isLoading}
                className="text-sm text-danger hover:text-red-700 transition-colors disabled:opacity-50"
              >
                Vider le panier
              </button>
            </div>

            {cart?.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continuer mes achats
              </Link>
            </div>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Résumé
              </h2>

              <CartSummary showShipping />

              <div className="mt-6 space-y-3">
                <Link href="/checkout" className="btn-primary w-full">
                  Passer la commande
                </Link>
                <Link href="/products" className="btn-outline w-full">
                  Continuer mes achats
                </Link>
              </div>

              {/* Infos */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>Livraison gratuite dès 50€</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>Retour gratuit 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}