'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import type { Product } from '@/types'
import { getImageUrl, formatPrice, cn } from '@/lib/utils'
import { useCart } from '@/components/providers/CartProvider'

interface ProductCardProps {
  product: Product
  className?: string
  showQuickActions?: boolean
}

export function ProductCard({ product, className, showQuickActions = true }: ProductCardProps) {
  const { addToCart, isProductInCart } = useCart()
  const inCart = isProductInCart(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart(product.id, 1)
    } catch (error) {
      console.error('Erreur ajout panier:', error)
    }
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className={cn('card-product group relative', className)}
      >
        {/* Image */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
          {product.imageName ? (
            <Image
              src={getImageUrl(product.imageName)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-4xl font-bold text-muted-foreground">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="badge-secondary text-xs px-2 py-1">Vedette</span>
            )}
            {!product.isInStock && (
              <span className="badge-danger text-xs px-2 py-1">Rupture</span>
            )}
          </div>

          {/* Actions rapides */}
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={!product.isInStock || inCart}
                className={cn(
                  'p-2 rounded-full bg-white shadow-lg transition-colors',
                  inCart 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary hover:text-white'
                )}
                title={inCart ? 'Dans le panier' : 'Ajouter au panier'}
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-danger hover:text-white transition-colors"
                title="Ajouter aux favoris"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Heart className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Informations */}
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground mb-1">
            {product.category.name}
          </p>
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <p className="price-large">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-2">
              {product.isInStock ? (
                <span className="text-xs text-success">En stock</span>
              ) : (
                <span className="text-xs text-danger">Rupture</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}