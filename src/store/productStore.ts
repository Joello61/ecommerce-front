import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { getErrorMessage } from '@/lib/api'
import type { 
  Product, 
  ProductDetails, 
  Category, 
  ProductFilterRequest,
  BestSellerProduct
} from '@/types'
import productService from '@/services/productService'

interface ProductState {
  // Listes de produits
  products: Product[]
  featuredProducts: Product[]
  bestSellers: BestSellerProduct[]
  searchResults: Product[]
  recentlyViewed: Product[]
  
  // Produit actuel
  currentProduct: ProductDetails | null
  
  // Catégories
  categories: Category[]
  currentCategory: Category | null
  
  // Pagination et filtres
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  currentFilters: ProductFilterRequest
  
  // États de chargement
  isLoading: boolean
  isFeaturedLoading: boolean
  isBestSellersLoading: boolean
  isSearchLoading: boolean
  isCategoriesLoading: boolean
  
  // Erreurs
  error: string | null
  searchError: string | null
  
  // Actions principales
  fetchProducts: (filters?: ProductFilterRequest) => Promise<void>
  fetchProduct: (id: number) => Promise<void>
  searchProducts: (query: string, categoryId?: number) => Promise<void>
  
  // Actions catégories
  fetchCategories: () => Promise<void>
  fetchProductsByCategory: (categoryId: number) => Promise<void>
  
  // Actions produits spéciaux
  fetchFeaturedProducts: (limit?: number) => Promise<void>
  fetchBestSellers: (limit?: number) => Promise<void>
  fetchRecentlyViewed: () => Promise<void>
  
  // Filtres et pagination
  setFilters: (filters: Partial<ProductFilterRequest>) => void
  clearFilters: () => void
  setPage: (page: number) => Promise<void>
  
  // Utilitaires
  getProductById: (id: number) => Product | undefined
  getCategoryById: (id: number) => Category | undefined
  addToRecentlyViewed: (product: Product) => void
  
  // Actions internes
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialFilters: ProductFilterRequest = {
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'desc'
}

const initialState = {
  products: [],
  featuredProducts: [],
  bestSellers: [],
  searchResults: [],
  recentlyViewed: [],
  currentProduct: null,
  categories: [],
  currentCategory: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  currentFilters: initialFilters,
  isLoading: false,
  isFeaturedLoading: false,
  isBestSellersLoading: false,
  isSearchLoading: false,
  isCategoriesLoading: false,
  error: null,
  searchError: null,
}

export const useProductStore = create<ProductState>()(
  subscribeWithSelector(
    (set, get) => ({
      ...initialState,

      // Actions principales
      fetchProducts: async (filters?: ProductFilterRequest) => {
        const finalFilters = filters || get().currentFilters
        
        set({ 
          isLoading: true, 
          error: null,
          currentFilters: finalFilters
        })
        
        try {
          const response = await productService.getProducts(finalFilters)
          set({
            products: response.products,
            pagination: response.pagination,
            isLoading: false
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({
            products: [],
            isLoading: false,
            error: errorMessage
          })
        }
      },

      fetchProduct: async (id: number) => {
        set({ isLoading: true, error: null, currentProduct: null })
        
        try {
          const product = await productService.getProduct(id)
          set({
            currentProduct: product,
            isLoading: false
          })
          
          // Ajouter aux vus récemment
          get().addToRecentlyViewed(product)
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({
            currentProduct: null,
            isLoading: false,
            error: errorMessage
          })
        }
      },

      searchProducts: async (query: string, categoryId?: number) => {
        set({ isSearchLoading: true, searchError: null, searchResults: [] })
        
        try {
          const response = await productService.searchProducts(query, categoryId)
          set({
            searchResults: response.products,
            isSearchLoading: false
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({
            searchResults: [],
            isSearchLoading: false,
            searchError: errorMessage
          })
        }
      },

      // Actions catégories
      fetchCategories: async () => {
        set({ isCategoriesLoading: true, error: null })
        
        try {
          const categories = await productService.getCategories()
          set({
            categories,
            isCategoriesLoading: false
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({
            categories: [],
            isCategoriesLoading: false,
            error: errorMessage
          })
        }
      },

      fetchProductsByCategory: async (categoryId: number) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await productService.getProductsByCategory(categoryId)
          set({
            products: response.products,
            currentCategory: response.category,
            pagination: {
              page: 1,
              limit: 20,
              total: response.total,
              pages: Math.ceil(response.total / 20)
            },
            isLoading: false
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({
            products: [],
            currentCategory: null,
            isLoading: false,
            error: errorMessage
          })
        }
      },

      // Actions produits spéciaux
      fetchFeaturedProducts: async (limit = 8) => {
        set({ isFeaturedLoading: true })
        
        try {
          const products = await productService.getFeaturedProducts(limit)
          set({
            featuredProducts: products,
            isFeaturedLoading: false
          })
        } catch (error) {
          console.error('Erreur lors du chargement des produits en vedette:', error)
          set({
            featuredProducts: [],
            isFeaturedLoading: false
          })
        }
      },

      fetchBestSellers: async (limit = 10) => {
        set({ isBestSellersLoading: true })
        
        try {
          const products = await productService.getBestSellers(limit)
          set({
            bestSellers: products,
            isBestSellersLoading: false
          })
        } catch (error) {
          console.error('Erreur lors du chargement des meilleures ventes:', error)
          set({
            bestSellers: [],
            isBestSellersLoading: false
          })
        }
      },

      fetchRecentlyViewed: async () => {
        try {
          const products = await productService.getRecentlyViewed()
          set({ recentlyViewed: products })
        } catch (error) {
          console.error('Erreur lors du chargement des produits vus récemment:', error)
        }
      },

      // Filtres et pagination
      setFilters: (filters: Partial<ProductFilterRequest>) => {
        const currentFilters = get().currentFilters
        const newFilters = { ...currentFilters, ...filters }
        
        // Réinitialiser la page sauf si explicitement fournie
        if (!filters.hasOwnProperty('page')) {
          newFilters.page = 1
        }
        
        // Mettre à jour l'état
        set({ currentFilters: newFilters })
        
        // Déclencher la recherche
        get().fetchProducts(newFilters)
      },

      clearFilters: () => {
        get().fetchProducts(initialFilters)
      },

      setPage: async (page: number) => {
        const filters = { ...get().currentFilters, page }
        await get().fetchProducts(filters)
      },

      // Utilitaires
      getProductById: (id: number) => {
        const state = get()
        return (
          state.products.find(p => p.id === id) ||
          state.featuredProducts.find(p => p.id === id) ||
          state.bestSellers.find(p => p.id === id) ||
          state.searchResults.find(p => p.id === id) ||
          state.recentlyViewed.find(p => p.id === id)
        )
      },

      getCategoryById: (id: number) => {
        return get().categories.find(c => c.id === id)
      },

      addToRecentlyViewed: (product: Product) => {
        const state = get()
        const recentlyViewed = state.recentlyViewed.filter(p => p.id !== product.id)
        recentlyViewed.unshift(product)
        
        // Garder seulement les 10 derniers
        const limitedRecentlyViewed = recentlyViewed.slice(0, 10)
        
        set({ recentlyViewed: limitedRecentlyViewed })
        
        // Envoyer au backend
        productService.addToRecentlyViewed(product.id).catch(console.error)
      },

      // Actions internes
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null, searchError: null })
      },

      reset: () => {
        set(initialState)
      },
    })
  )
)

// Sélecteurs pour optimiser les re-renders
export const useProducts = () => useProductStore((state) => state.products)
export const useFeaturedProducts = () => useProductStore((state) => state.featuredProducts)
export const useBestSellers = () => useProductStore((state) => state.bestSellers)
export const useCurrentProduct = () => useProductStore((state) => state.currentProduct)
export const useCategories = () => useProductStore((state) => state.categories)
export const useProductLoading = () => useProductStore((state) => state.isLoading)
export const useProductError = () => useProductStore((state) => state.error)
export const useProductPagination = () => useProductStore((state) => state.pagination)
export const useProductFilters = () => useProductStore((state) => state.currentFilters)
export const useSearchResults = () => useProductStore((state) => state.searchResults)
export const useSearchLoading = () => useProductStore((state) => state.isSearchLoading)
export const useRecentlyViewed = () => useProductStore((state) => state.recentlyViewed)

// Hook pour récupérer un produit par ID
export const useProductById = (id: number) => {
  return useProductStore((state) => state.getProductById(id))
}

// Hook pour récupérer une catégorie par ID
export const useCategoryById = (id: number) => {
  return useProductStore((state) => state.getCategoryById(id))
}

// Actions pour usage direct
export const productActions = {
  fetchProducts: (filters?: ProductFilterRequest) => 
    useProductStore.getState().fetchProducts(filters),
  
  fetchProduct: (id: number) => 
    useProductStore.getState().fetchProduct(id),
  
  searchProducts: (query: string, categoryId?: number) => 
    useProductStore.getState().searchProducts(query, categoryId),
  
  fetchCategories: () => 
    useProductStore.getState().fetchCategories(),
  
  fetchProductsByCategory: (categoryId: number) => 
    useProductStore.getState().fetchProductsByCategory(categoryId),
  
  fetchFeaturedProducts: (limit?: number) => 
    useProductStore.getState().fetchFeaturedProducts(limit),
  
  fetchBestSellers: (limit?: number) => 
    useProductStore.getState().fetchBestSellers(limit),
  
  fetchRecentlyViewed: () => 
    useProductStore.getState().fetchRecentlyViewed(),
  
  setFilters: (filters: Partial<ProductFilterRequest>) => 
    useProductStore.getState().setFilters(filters),
  
  clearFilters: () => 
    useProductStore.getState().clearFilters(),
  
  setPage: (page: number) => 
    useProductStore.getState().setPage(page),
  
  getProductById: (id: number) => 
    useProductStore.getState().getProductById(id),
  
  getCategoryById: (id: number) => 
    useProductStore.getState().getCategoryById(id),
  
  addToRecentlyViewed: (product: Product) => 
    useProductStore.getState().addToRecentlyViewed(product),
  
  setLoading: (loading: boolean) => 
    useProductStore.getState().setLoading(loading),
  
  setError: (error: string | null) => 
    useProductStore.getState().setError(error),
  
  clearError: () => 
    useProductStore.getState().clearError(),
  
  reset: () => 
    useProductStore.getState().reset(),
}

export default useProductStore
export type ProductStoreState = ReturnType<typeof useProductStore.getState>