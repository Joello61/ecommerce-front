'use client'

import { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/lib/utils'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductSearch } from '@/components/products/ProductSearch'
import { ProductGrid } from '@/components/products/ProductGrid'

type SortOption = 'name:asc' | 'name:desc' | 'price:asc' | 'price:desc' | 'created_at:desc'

export default function ProductsPage() {
  const { 
    products, 
    isLoading, 
    pagination, 
    filters, 
    categories, // ← Ajouter ceci
    fetchProducts, 
    fetchCategories, 
    setFilters, 
    clearFilters, // ← Ajouter ceci pour onReset
    setPage 
  } = useProducts()
  
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(':') as [string, 'asc' | 'desc']
    setFilters({ sortBy: sortBy as 'name' | 'price' | 'created_at', sortOrder })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container py-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Nos Produits</h1>
          <p className="text-gray-600">
            Découvrez notre sélection de {pagination.total} produits
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <ProductFilters 
                categories={categories}
                currentFilters={filters}
                onFilterChange={setFilters}
                onReset={clearFilters}
              />
            </div>
          </aside>

          {/* Produits */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ProductSearch placeholder="Rechercher un produit..." showResults={false} />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-outline"
                >
                  Filtres
                </button>

                <select
                  value={`${filters.sortBy}:${filters.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="input min-w-[180px]"
                >
                  <option value="created_at:desc">Plus récents</option>
                  <option value="name:asc">Nom A-Z</option>
                  <option value="name:desc">Nom Z-A</option>
                  <option value="price:asc">Prix croissant</option>
                  <option value="price:desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Filtres mobile */}
            {showFilters && (
              <div className="lg:hidden">
                <ProductFilters 
                  categories={categories}
                  currentFilters={filters}
                  onFilterChange={setFilters}
                  onReset={clearFilters}
                />
              </div>
            )}

            {/* Grille produits */}
            <ProductGrid
              products={products}
              loading={isLoading}
              columns={3}
              emptyMessage="Aucun produit ne correspond à vos critères"
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-outline"
                >
                  Précédent
                </button>

                <div className="flex gap-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1
                    const isActive = page === pagination.page
                    const showPage = page === 1 || page === pagination.pages || 
                                    (page >= pagination.page - 1 && page <= pagination.page + 1)

                    if (showPage) {
                      return (
                        <button
                          key={page}
                          onClick={() => setPage(page)}
                          className={cn(
                            'px-3 py-1 rounded',
                            isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                          )}
                        >
                          {page}
                        </button>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn-outline"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}