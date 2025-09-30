'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/components/providers/CartProvider'
import { ConnectedProductGrid } from '@/components/features/products/ConnectedProductGrid'
import { getImageUrl, formatPrice, cn } from '@/lib/utils'
import Loading from '@/components/ui/Loading'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const { currentProduct, isLoading, fetchProduct } = useProducts()
  const { addToCart, isProductInCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchProduct(parseInt(slug))
    }
  }, [slug, fetchProduct])

  const handleAddToCart = async () => {
    if (!currentProduct) return

    setIsAddingToCart(true)
    try {
      await addToCart(currentProduct.id, quantity)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  if (!currentProduct) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Produit introuvable</h2>
        <Link href="/products" className="btn-primary">
          Retour aux produits
        </Link>
      </div>
    )
  }

  const inCart = isProductInCart(currentProduct.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container py-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-900">Produits</Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${currentProduct.category.slug}`} className="hover:text-gray-900">
            {currentProduct.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{currentProduct.name}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>

        {/* Produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {currentProduct.imageName ? (
              <Image
                src={getImageUrl(currentProduct.imageName)}
                alt={currentProduct.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                <span className="text-8xl font-bold text-gray-400">
                  {currentProduct.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {currentProduct.isFeatured && (
                <span className="badge bg-secondary text-white">Vedette</span>
              )}
              {!currentProduct.isInStock && (
                <span className="badge bg-danger text-white">Rupture</span>
              )}
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {currentProduct.category.name}
              </p>
              <h1 className="text-4xl font-semibold text-gray-900 mb-4">
                {currentProduct.name}
              </h1>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(currentProduct.price)}
                </span>
              </div>
            </div>

            {currentProduct.description && (
              <p className="text-gray-600">{currentProduct.description}</p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                currentProduct.isInStock ? 'bg-success' : 'bg-danger'
              )} />
              <span className="text-sm">
                {currentProduct.isInStock
                  ? `${currentProduct.stock} en stock`
                  : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantité */}
            {currentProduct.isInStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantité:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-6 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || inCart}
                    className={cn(
                      'btn-primary flex-1',
                      inCart && 'bg-success hover:bg-success'
                    )}
                  >
                    {inCart ? 'Dans le panier' : isAddingToCart ? 'Ajout...' : 'Ajouter au panier'}
                  </button>

                  <button className="btn-outline p-3" title="Favoris">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button className="btn-outline p-3" title="Partager">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Avantages */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Livraison gratuite dès 50€</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Garantie 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {currentProduct.similarProducts && currentProduct.similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Produits similaires
            </h2>
            <ConnectedProductGrid
              products={currentProduct.similarProducts}
              columns={4}
            />
          </div>
        )}
      </div>
    </div>
  )
}