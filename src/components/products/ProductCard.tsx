'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
  showQuickActions?: boolean
  onAddToCart?: (productId: number) => void
  onAddToWishlist?: (productId: number) => void
  inCart?: boolean
}

const getImageUrl = (imageName: string) => {
  return `/api/uploads/${imageName}`
}

export function ProductCard({ 
  product, 
  className, 
  showQuickActions = true,
  onAddToCart,
  onAddToWishlist,
  inCart = false
}: ProductCardProps) {

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product.id)
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className={cn('block h-full', className)}>
      <div className="card-product h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          {product.imageName ? (
            <Image
              src={getImageUrl(product.imageName)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-4xl font-bold text-gray-400">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="badge bg-secondary text-white">Vedette</span>
            )}
            {!product.isInStock && (
              <span className="badge bg-danger text-white">Rupture</span>
            )}
          </div>

          {/* Actions rapides */}
          {showQuickActions && (
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleAddToCart}
                disabled={!product.isInStock || inCart}
                className={cn(
                  'p-2 rounded-full shadow-lg transition-colors',
                  inCart 
                    ? 'bg-primary text-white' 
                    : 'bg-white hover:bg-primary hover:text-white',
                  (!product.isInStock || inCart) && 'opacity-50 cursor-not-allowed'
                )}
                title={inCart ? 'Dans le panier' : 'Ajouter au panier'}
                aria-label="Ajouter au panier"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-danger hover:text-white transition-colors"
                title="Ajouter aux favoris"
                aria-label="Ajouter aux favoris"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="px-4 pb-4 flex-1 flex flex-col">
          <p className="text-sm text-gray-600 mb-1">
            {product.category.name}
          </p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            <p className="price">{formatPrice(product.price)}</p>
            {product.isInStock ? (
              <span className="text-xs text-success font-medium">En stock</span>
            ) : (
              <span className="text-xs text-danger font-medium">Rupture</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}