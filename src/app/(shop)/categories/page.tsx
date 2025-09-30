'use client'

import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import { useEffect } from 'react'
import Loading from '@/components/ui/Loading'

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories } = useProducts()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  if (isLoading) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Nos Catégories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez notre sélection par catégorie
          </p>
        </div>
      </div>

      {/* Grille */}
      <div className="container py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune catégorie disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div className="card p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {category.productsCount !== undefined && (
                    <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
                      {category.productsCount} produit{category.productsCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Vous cherchez quelque chose de précis ?
          </p>
          <Link href="/products" className="btn-outline">
            Voir tous les produits
          </Link>
        </div>
      </div>
    </div>
  )
}