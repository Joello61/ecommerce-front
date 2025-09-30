'use client'

import { ProductCard } from '@/components/products/ProductCard'
import { useCart } from '@/components/providers/CartProvider'
import { showToast } from '@/store/uiStore'
import type { Product } from '@/types'

interface ConnectedProductCardProps {
  product: Product
  className?: string
  showQuickActions?: boolean
}

export function ConnectedProductCard({ 
  product, 
  className,
  showQuickActions = true 
}: ConnectedProductCardProps) {
  const { addToCart, isProductInCart } = useCart()

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
    // TODO: Implémenter la logique wishlist
    showToast.info('Fonctionnalité bientôt disponible')
    console.log('Add to wishlist:', productId)
  }

  return (
    <ProductCard
      product={product}
      className={className}
      showQuickActions={showQuickActions}
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleAddToWishlist}
      inCart={isProductInCart(product.id)}
    />
  )
}