// src/app/(shop)/categories/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Grid, List, SlidersHorizontal } from 'lucide-react'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductFilters } from '@/components/features/products/ProductFilters'
import { ProductSearch } from '@/components/features/products/ProductSearch'
import { useProducts } from '@/hooks/useProducts'
import { useProductStore } from '@/store'
import { cn } from '@/lib/utils'
import Loading from '@/components/ui/Loading'

type ViewMode = 'grid' | 'list'
type SortOption = 'name:asc' | 'name:desc' | 'price:asc' | 'price:desc' | 'created_at:desc' | 'created_at:asc'

export default function CategoryProductsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const {
    products,
    categories,
    isLoading,
    pagination,
    filters,
    fetchCategories,
    setFilters,
    clearFilters,
    setPage
  } = useProducts()

  const currentCategory = useProductStore(state => state.currentCategory)
  const fetchProductsByCategory = useProductStore(state => state.fetchProductsByCategory)

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Charger la catégorie et ses produits
  useEffect(() => {
    fetchCategories()
    
    // Trouver l'ID de la catégorie depuis le slug
    const category = categories.find(c => c.slug === slug)
    if (category) {
      fetchProductsByCategory(category.id)
    }
  }, [slug, categories, fetchCategories, fetchProductsByCategory])

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

  if (isLoading && !currentCategory) {
    return <Loading size="lg" text="Chargement de la catégorie..." centered />
  }

  if (!currentCategory && !isLoading) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Catégorie non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La catégorie que vous recherchez n&apos;existe pas.
        </p>
        <button onClick={() => router.push('/categories')} className="btn-primary">
          Retour aux catégories
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-foreground transition-colors">
              Catégories
            </Link>
            <span>/</span>
            <span className="text-foreground">{currentCategory?.name}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/categories')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux catégories
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">{currentCategory?.name}</h1>
            {currentCategory?.description && (
              <p className="text-muted-foreground">{currentCategory.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {pagination.total} {pagination.total > 1 ? 'produits' : 'produit'}
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
                  placeholder={`Rechercher dans ${currentCategory?.name}...`}
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
              emptyMessage={`Aucun produit dans la catégorie ${currentCategory?.name}`}
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

            {/* Autres catégories */}
            {categories.length > 1 && (
              <div className="mt-12 pt-12 border-t border-border">
                <h3 className="text-xl font-semibold mb-4">Autres catégories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter(cat => cat.id !== currentCategory?.id)
                    .slice(0, 6)
                    .map(category => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="badge-primary hover:bg-primary-dark transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}