// src/app/(shop)/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid, List } from 'lucide-react'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductFilters } from '@/components/features/products/ProductFilters'
import { ProductSearch } from '@/components/features/products/ProductSearch'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list'
type SortOption = 'name:asc' | 'name:desc' | 'price:asc' | 'price:desc' | 'created_at:desc' | 'created_at:asc'

export default function ProductsPage() {
  const {
    products,
    categories,
    isLoading,
    pagination,
    filters,
    fetchProducts,
    fetchCategories,
    setFilters,
    clearFilters,
    setPage
  } = useProducts()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // ✅ Charger produits et catégories UNE SEULE FOIS au montage
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Dépendances vides = exécution unique

  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(':') as [string, 'asc' | 'desc']
    setFilters({ 
      sortBy: sortBy as 'name' | 'price' | 'created_at', 
      sortOrder 
    })
  }

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Nos Produits</h1>
            <p className="text-muted-foreground">
              Découvrez notre sélection de {pagination.total} produits
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar filtres - Desktop */}
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

          {/* Contenu produits */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <ProductSearch
                  placeholder="Rechercher un produit..."
                  onSearch={handleSearch}
                  showResults={false}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Bouton filtres mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-outline inline-flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                </button>

                {/* Tri */}
                <select
                  value={`${filters.sortBy}:${filters.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="input min-w-[180px]"
                >
                  <option value="created_at:desc">Plus récents</option>
                  <option value="created_at:asc">Plus anciens</option>
                  <option value="name:asc">Nom A-Z</option>
                  <option value="name:desc">Nom Z-A</option>
                  <option value="price:asc">Prix croissant</option>
                  <option value="price:desc">Prix décroissant</option>
                </select>

                {/* Vue grid/list */}
                <div className="hidden sm:flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'grid' 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-muted'
                    )}
                    title="Vue grille"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'list' 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-muted'
                    )}
                    title="Vue liste"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
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

            {/* Grille de produits */}
            <ProductGrid
              products={products}
              loading={isLoading}
              columns={viewMode === 'grid' ? 3 : 2}
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
                
                <div className="flex items-center gap-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setPage(page)}
                          className={cn(
                            'px-3 py-1 rounded',
                            page === pagination.page
                              ? 'bg-primary text-white'
                              : 'hover:bg-muted'
                          )}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === pagination.page - 2 ||
                      page === pagination.page + 2
                    ) {
                      return <span key={page}>...</span>
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