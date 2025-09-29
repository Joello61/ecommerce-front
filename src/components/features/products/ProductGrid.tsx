'use client'

import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  columns?: 2 | 3 | 4
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns]

  // Loading state
  if (loading) {
    return (
      <div className={cn('grid gap-6', gridClass, className)}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="px-4 pb-4 space-y-2">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
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
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  // Products grid
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn('grid gap-6', gridClass, className)}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}