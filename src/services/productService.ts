import { apiClient } from '@/lib/api'
import type {
  Product,
  ProductDetails,
  Category,
  ProductListResponse,
  ProductSearchResponse,
  ProductAvailability,
  ProductStats,
  BestSellerProduct,
  CategoryWithProducts,
  ProductFilterRequest
} from '@/types'

class ProductService {
  /**
   * Récupération de la liste des produits avec filtres et pagination
   */
  async getProducts(filters?: ProductFilterRequest): Promise<ProductListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.search) params.append('search', filters.search)
      if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString())
      if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
    }

    const response = await apiClient.get<ProductListResponse>(`/products?${params.toString()}`)
    return response.data
  }

  /**
   * Récupération d'un produit par ID
   */
  async getProduct(id: number): Promise<ProductDetails> {
    const response = await apiClient.get<{ product: ProductDetails; similarProducts: Product[] }>(`/products/${id}`)
    return {
      ...response.data.product,
      similarProducts: response.data.similarProducts
    }
  }

  /**
   * Récupération des produits en vedette
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[] }>(`/products/featured?limit=${limit}`)
    return response.data.products
  }

  /**
   * Récupération des meilleures ventes
   */
  async getBestSellers(limit = 10): Promise<BestSellerProduct[]> {
    const response = await apiClient.get<{ products: BestSellerProduct[] }>(`/products/best-sellers?limit=${limit}`)
    return response.data.products
  }

  /**
   * Recherche de produits
   */
  async searchProducts(query: string, categoryId?: number): Promise<ProductSearchResponse> {
    const params = new URLSearchParams({ search: query })
    if (categoryId) params.append('categoryId', categoryId.toString())

    const response = await apiClient.get<ProductSearchResponse>(`/products/search?${params.toString()}`)
    return response.data
  }

  /**
   * Récupération des produits par catégorie
   */
  async getProductsByCategory(categoryId: number): Promise<CategoryWithProducts> {
    const response = await apiClient.get<CategoryWithProducts>(`/products/categories/${categoryId}`)
    return response.data
  }

  /**
   * Vérification de la disponibilité d'un produit
   */
  async checkAvailability(productId: number): Promise<ProductAvailability> {
    const response = await apiClient.get<ProductAvailability>(`/products/check-availability/${productId}`)
    return response.data
  }

  /**
   * Récupération de toutes les catégories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<{ categories: Category[] }>('/products/categories')
    return response.data.categories
  }

  /**
   * Récupération d'une catégorie par ID
   */
  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`)
    return response.data
  }

  /**
   * Récupération des statistiques produits (admin)
   */
  async getProductStats(): Promise<ProductStats> {
    const response = await apiClient.get<ProductStats>('/products/stats')
    return response.data
  }

  /**
   * Récupération des produits similaires
   */
  async getSimilarProducts(productId: number, limit = 4): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[] }>(`/products/${productId}/similar?limit=${limit}`)
    return response.data.products
  }

  /**
   * Récupération des nouveaux produits
   */
  async getNewProducts(limit = 12): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[] }>(`/products/new?limit=${limit}`)
    return response.data.products
  }

  /**
   * Récupération des produits en promotion
   */
  async getOnSaleProducts(limit = 12): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[] }>(`/products/on-sale?limit=${limit}`)
    return response.data.products
  }

  /**
   * Récupération des produits recommandés pour un utilisateur
   */
  async getRecommendedProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[] }>(`/products/recommended?limit=${limit}`)
    return response.data.products
  }

  /**
   * Récupération des filtres disponibles (prix min/max, catégories, etc.)
   */
  async getAvailableFilters(): Promise<{
    categories: Category[]
    priceRange: { min: number; max: number }
    brands: string[]
  }> {
    const response = await apiClient.get<{
      categories: Category[]
      priceRange: { min: number; max: number }
      brands: string[]
    }>('/products/filters')
    return response.data
  }

  /**
   * Récupération des suggestions de recherche
   */
  async getSearchSuggestions(query: string, limit = 5): Promise<string[]> {
    const response = await apiClient.get<{ suggestions: string[] }>(`/products/search-suggestions?q=${encodeURIComponent(query)}&limit=${limit}`)
    return response.data.suggestions
  }

  /**
   * Récupération de l'historique des produits vus récemment
   */
  async getRecentlyViewed(limit = 10): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[] }>(`/products/recently-viewed?limit=${limit}`)
    return response.data.products
  }

  /**
   * Ajout d'un produit à l'historique des vus récemment
   */
  async addToRecentlyViewed(productId: number): Promise<void> {
    await apiClient.post('/products/recently-viewed', { productId })
  }

  /**
   * Comparaison de produits
   */
  async compareProducts(productIds: number[]): Promise<Product[]> {
    const response = await apiClient.post<{ products: Product[] }>('/products/compare', { productIds })
    return response.data.products
  }
}

// Instance singleton
export const productService = new ProductService()
export default productService