// src/app/(shop)/categories/page.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, ArrowRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/lib/utils'
import Loading from '@/components/ui/Loading'

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories } = useProducts()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  if (isLoading) {
    return <Loading size="lg" text="Chargement des catégories..." centered />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-6">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Nos Catégories</h1>
            <p className="text-lg text-muted-foreground">
              Explorez notre sélection de produits par catégorie et trouvez exactement ce que vous cherchez
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grille de catégories */}
      <div className="container py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune catégorie disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <div className="card-feature group cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                    </div>

                    {category.productsCount !== undefined && (
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                          {category.productsCount} {category.productsCount > 1 ? 'produits' : 'produit'}
                        </span>
                        <span className={cn(
                          'badge',
                          category.isActive ? 'badge-success' : 'badge-secondary'
                        )}>
                          {category.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </p>
          <Link href="/products" className="btn-outline">
            Voir tous les produits
          </Link>
        </motion.div>
      </div>
    </div>
  )
}