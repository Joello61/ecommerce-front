import { Metadata } from 'next'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ConnectedProductGrid } from '@/components/features/products/ConnectedProductGrid'
import { ConnectedProductFilters } from '@/components/features/products/ConnectedProductFilters'
import { ConnectedProductSearch } from '@/components/features/products/ConnectedProductSearch'
import Loading from '@/components/ui/Loading'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Catégorie | Sunset Commerce'
}

type SortOption = 'name:asc' | 'name:desc' | 'price:asc' | 'price:desc' | 'created_at:desc'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const { categories, products, isLoading, pagination, filters, setFilters, setPage } = useProducts()
  const [showFilters, setShowFilters] = useState(false)

  const currentCategory = categories.find((c) => c.slug === slug)

  useEffect(() => {
    if (currentCategory) {
      setFilters({ categoryId: currentCategory.id })
    }
  }, [currentCategory, setFilters])

  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(':') as [string, 'asc' | 'desc']
    setFilters({ sortBy: sortBy as 'name' | 'price' | 'created_at', sortOrder })
  }

  if (isLoading && !currentCategory) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  if (!currentCategory) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Catégorie introuvable</h2>
        <Link href="/categories" className="btn-primary">
          Retour aux catégories
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container py-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-gray-900">Catégories</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{currentCategory.name}</span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container py-8">
          <button
            onClick={() => router.push('/categories')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>

          <h1 className="text-3xl font-semibold text-gray-900 mb-2">{currentCategory.name}</h1>
          {currentCategory.description && (
            <p className="text-gray-600">{currentCategory.description}</p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            {pagination.total} produit{pagination.total > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <ConnectedProductFilters />
            </div>
          </aside>

          {/* Produits */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ConnectedProductSearch placeholder={`Rechercher dans ${currentCategory.name}...`} showResults={false} />
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
                <ConnectedProductFilters />
              </div>
            )}

            {/* Grille produits */}
            <ConnectedProductGrid
              products={products}
              loading={isLoading}
              columns={3}
              emptyMessage={`Aucun produit dans ${currentCategory.name}`}
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