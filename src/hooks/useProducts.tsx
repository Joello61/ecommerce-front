// src/hooks/useProducts.ts
import { useCallback } from 'react'
import { 
  useProductStore,
  useProducts as useProductsState,
  useFeaturedProducts,
  useBestSellers,
  useCurrentProduct,
  useCategories,
  useProductLoading,
  useProductError,
  useProductPagination,
  useProductFilters as useProductFiltersFromStore,
  useSearchResults,
  useSearchLoading,
  useRecentlyViewed,
} from '@/store'
import { showToast } from '@/store'
import { formatPrice } from '@/lib/utils'
import type { ProductFilterRequest, Product, Category } from '@/types'

interface UseProductsReturn {
  // État
  products: Product[]
  featuredProducts: Product[]
  bestSellers: ReturnType<typeof useBestSellers>
  currentProduct: ReturnType<typeof useCurrentProduct>
  categories: Category[]
  isLoading: boolean
  error: string | null
  pagination: ReturnType<typeof useProductPagination>
  filters: ProductFilterRequest
  searchResults: Product[]
  isSearchLoading: boolean
  recentlyViewed: Product[]
  
  // Actions
  fetchProducts: (filters?: ProductFilterRequest) => Promise<void>
  fetchProduct: (id: number) => Promise<void>
  searchProducts: (query: string, categoryId?: number) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchFeaturedProducts: (limit?: number) => Promise<void>
  fetchBestSellers: (limit?: number) => Promise<void>
  
  // Filtres
  setFilters: (filters: Partial<ProductFilterRequest>) => void
  clearFilters: () => void
  setPage: (page: number) => Promise<void>
  setSortBy: (sortBy: "name" | "price" | "created_at" | "stock" | undefined, sortOrder?: 'asc' | 'desc') => void
  setCategory: (categoryId?: number) => void
  setPriceRange: (minPrice?: number, maxPrice?: number) => void
  
  // Utilitaires
  getProductById: (id: number) => Product | undefined
  getCategoryById: (id: number) => Category | undefined
  formatProductPrice: (product: Product) => string
  isProductAvailable: (product: Product) => boolean
  isProductInStock: (product: Product) => boolean
  isProductFeatured: (product: Product) => boolean
  
  // Actions avancées
  addToRecentlyViewed: (product: Product) => void
  clearRecentlyViewed: () => void
  refreshProducts: () => Promise<void>
  clearError: () => void
}

export const useProducts = (): UseProductsReturn => {
  const state = useProductStore()
  
  // Sélecteurs optimisés
  const products = useProductsState()
  const featuredProducts = useFeaturedProducts()
  const bestSellers = useBestSellers()
  const currentProduct = useCurrentProduct()
  const categories = useCategories()
  const isLoading = useProductLoading()
  const error = useProductError()
  const pagination = useProductPagination()
  const currentFilters = useProductFiltersFromStore()
  const searchResults = useSearchResults()
  const isSearchLoading = useSearchLoading()
  const recentlyViewed = useRecentlyViewed()

  // Actions avec gestion d'erreurs - SANS dépendances qui changent
  const fetchProducts = useCallback(async (newFilters?: ProductFilterRequest) => {
    try {
      await useProductStore.getState().fetchProducts(newFilters)
    } catch (error) {
      showToast.error('Erreur', 'Impossible de charger les produits')
      console.error('Erreur fetchProducts:', error)
    }
  }, [])

  const fetchProduct = useCallback(async (id: number) => {
    try {
      await useProductStore.getState().fetchProduct(id)
    } catch (error) {
      showToast.error('Erreur', 'Produit non trouvé')
      console.error('Erreur fetchProduct:', error)
    }
  }, [])

  const searchProducts = useCallback(async (query: string, categoryId?: number) => {
    try {
      await useProductStore.getState().searchProducts(query, categoryId)
    } catch (error) {
      showToast.error('Erreur', 'Problème lors de la recherche')
      console.error('Erreur searchProducts:', error)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      await useProductStore.getState().fetchCategories()
    } catch (error) {
      showToast.error('Erreur', 'Impossible de charger les catégories')
      console.error('Erreur fetchCategories:', error)
    }
  }, [])

  const fetchFeaturedProducts = useCallback(async (limit = 8) => {
    try {
      await useProductStore.getState().fetchFeaturedProducts(limit)
    } catch (error) {
      console.error('Erreur produits en vedette:', error)
    }
  }, [])

  const fetchBestSellers = useCallback(async (limit = 10) => {
    try {
      await useProductStore.getState().fetchBestSellers(limit)
    } catch (error) {
      console.error('Erreur meilleures ventes:', error)
    }
  }, [])

  // Gestion des filtres
  const setFilters = useCallback((newFilters: Partial<ProductFilterRequest>) => {
    useProductStore.getState().setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    useProductStore.getState().clearFilters()
  }, [])

  const setPage = useCallback(async (page: number) => {
    await useProductStore.getState().setPage(page)
  }, [])

  const setSortBy = useCallback((sortBy: 'name' | 'price' | 'created_at' | 'stock' | undefined, sortOrder: 'asc' | 'desc' = 'asc') => {
    useProductStore.getState().setFilters({ sortBy, sortOrder })
  }, [])

  const setCategory = useCallback((categoryId?: number) => {
    useProductStore.getState().setFilters({ categoryId, page: 1 })
  }, [])

  const setPriceRange = useCallback((minPrice?: number, maxPrice?: number) => {
    useProductStore.getState().setFilters({ minPrice, maxPrice, page: 1 })
  }, [])

  // Utilitaires
  const getProductById = useCallback((id: number) => {
    return useProductStore.getState().getProductById(id)
  }, [])

  const getCategoryById = useCallback((id: number) => {
    return useProductStore.getState().getCategoryById(id)
  }, [])

  const formatProductPrice = useCallback((product: Product) => {
    return formatPrice(product.price)
  }, [])

  const isProductAvailable = useCallback((product: Product) => {
    return product.isActive && product.isInStock
  }, [])

  const isProductInStock = useCallback((product: Product) => {
    return product.stock > 0
  }, [])

  const isProductFeatured = useCallback((product: Product) => {
    return product.isFeatured
  }, [])

  // Actions avancées
  const addToRecentlyViewed = useCallback((product: Product) => {
    useProductStore.getState().addToRecentlyViewed(product)
  }, [])

  const clearRecentlyViewed = useCallback(() => {
    // À implémenter selon vos besoins
  }, [])

  const refreshProducts = useCallback(async () => {
    await fetchProducts(currentFilters)
  }, [fetchProducts, currentFilters])

  const clearError = useCallback(() => {
    useProductStore.getState().clearError()
  }, [])

  return {
    products,
    featuredProducts,
    bestSellers,
    currentProduct,
    categories,
    isLoading,
    error,
    pagination,
    filters: currentFilters,
    searchResults,
    isSearchLoading,
    recentlyViewed,
    
    fetchProducts,
    fetchProduct,
    searchProducts,
    fetchCategories,
    fetchFeaturedProducts,
    fetchBestSellers,
    
    setFilters,
    clearFilters,
    setPage,
    setSortBy,
    setCategory,
    setPriceRange,
    
    getProductById,
    getCategoryById,
    formatProductPrice,
    isProductAvailable,
    isProductInStock,
    isProductFeatured,
    
    addToRecentlyViewed,
    clearRecentlyViewed,
    refreshProducts,
    clearError,
  }
}

export default useProducts