'use client'

import { useProductStore } from '@/store/productStore'
import { useCart } from '@/components/providers/CartProvider'
import { showToast } from '@/store/uiStore'
import type { Product } from '@/types'
import { ProductGrid } from '@/components/products/ProductGrid'

interface ConnectedProductGridProps {
  products?: Product[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  columns?: 2 | 3 | 4
}

export function ConnectedProductGrid({ 
  products: externalProducts,
  loading: externalLoading,
  emptyMessage,
  className,
  columns = 4
}: ConnectedProductGridProps) {
  const { products: storeProducts, isLoading: storeLoading } = useProductStore()
  const { addToCart, getProductQuantity } = useCart()

  // Utiliser les produits externes si fournis, sinon utiliser le store
  const products = externalProducts || storeProducts
  const loading = externalLoading !== undefined ? externalLoading : storeLoading

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1)
      showToast.success('Produit ajouté au panier')
    } catch (error) {
      showToast.error('Impossible d\'ajouter le produit')
      console.error('Error adding to cart:', error)
    }
  }

  const handleAddToWishlist = async (productId: number) => {
    showToast.info('Fonctionnalité bientôt disponible')
    console.log('Add to wishlist:', productId)
  }

  // Récupérer les IDs des produits dans le panier
  const productsInCart = products
    .filter(product => getProductQuantity(product.id) > 0)
    .map(product => product.id)

  return (
    <ProductGrid
      products={products}
      loading={loading}
      emptyMessage={emptyMessage}
      className={className}
      columns={columns}
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleAddToWishlist}
      productsInCart={productsInCart}
    />
  )
}