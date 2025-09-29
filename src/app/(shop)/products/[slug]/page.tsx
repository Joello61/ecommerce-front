// src/app/(shop)/products/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/components/providers/CartProvider'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { getImageUrl, formatPrice, cn } from '@/lib/utils'
import Loading from '@/components/ui/Loading'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const { currentProduct, isLoading, error, fetchProduct } = useProducts()
  const { addToCart, isProductInCart } = useCart()
  
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Charger le produit
  useEffect(() => {
    if (slug && currentProduct?.slug !== slug) {
      // Trouver l'ID du produit depuis le slug (à adapter selon votre logique)
      // Pour l'instant on simule avec un appel direct
      fetchProduct(parseInt(slug)) // À ADAPTER : utiliser un service getProductBySlug
    }
  }, [slug, currentProduct, fetchProduct])

  const handleAddToCart = async () => {
    if (!currentProduct) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(currentProduct.id, quantity)
    } catch (error) {
      console.error('Erreur ajout panier:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const incrementQuantity = () => {
    if (currentProduct && quantity < currentProduct.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // États de chargement et d'erreur
  if (isLoading) {
    return <Loading size="lg" text="Chargement du produit..." centered />
  }

  if (error || !currentProduct) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
        <p className="text-muted-foreground mb-6">
          Le produit que vous recherchez n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <button onClick={() => router.push('/products')} className="btn-primary">
          Retour aux produits
        </button>
      </div>
    )
  }

  const inCart = isProductInCart(currentProduct.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Produits
            </Link>
            <span>/</span>
            <Link 
              href={`/categories/${currentProduct.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {currentProduct.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{currentProduct.name}</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </motion.button>

        {/* Produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          >
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
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <span className="text-8xl font-bold text-muted-foreground">
                  {currentProduct.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {currentProduct.isFeatured && (
                <span className="badge-secondary">Vedette</span>
              )}
              {!currentProduct.isInStock && (
                <span className="badge-danger">Rupture de stock</span>
              )}
            </div>
          </motion.div>

          {/* Informations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {currentProduct.category.name}
              </p>
              <h1 className="text-4xl font-bold mb-4">{currentProduct.name}</h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(currentProduct.price)}
                </span>
              </div>
            </div>

            {currentProduct.description && (
              <div className="prose prose-slate">
                <p className="text-muted-foreground">{currentProduct.description}</p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'h-2 w-2 rounded-full',
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
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity === 1}
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-6 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= currentProduct.stock}
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || inCart}
                    className={cn(
                      'btn-primary flex-1 inline-flex items-center justify-center gap-2',
                      inCart && 'bg-success hover:bg-success'
                    )}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {inCart ? 'Dans le panier' : isAddingToCart ? 'Ajout...' : 'Ajouter au panier'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline p-3"
                    title="Ajouter aux favoris"
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline p-3"
                    title="Partager"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Avantages */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Livraison gratuite dès 50€ d&apos;achat</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Garantie satisfait ou remboursé 30 jours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Produits similaires */}
        {currentProduct.similarProducts && currentProduct.similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <ProductGrid
              products={currentProduct.similarProducts}
              columns={4}
            />
          </div>
        )}
      </div>
    </div>
  )
}