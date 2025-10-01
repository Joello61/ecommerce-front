'use client'

import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  columns?: 2 | 3 | 4
}

export function ProductGrid({ 
  products, 
  loading, 
  emptyMessage = 'Aucun produit trouvé',
  className,
  columns = 4
}: ProductGridProps) {
  
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'product-grid' // Utilise la class du globals.css
  }[columns]

  // Loading state
  if (loading) {
    return (
      <div className={cn('grid gap-6', gridClass, className)}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse h-full">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="px-4 pb-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  // Products grid
  return (
    <div className={cn('grid gap-6', gridClass, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}