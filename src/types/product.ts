export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isInStock: boolean;
  createdAt: string;
  updatedAt?: string;
  imageName?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductDetails extends Product {
  // Informations supplémentaires pour la page produit
  similarProducts?: Product[];
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  isActive?: boolean;
  isFeatured?: boolean;
  imageFile?: File;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  imageFile?: File;
}

export interface UpdateStockRequest {
  quantity: number;
  operation: 'set' | 'add' | 'subtract';
  comment?: string;
}

export interface ProductFilterRequest {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'created_at' | 'stock';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  query: string;
}

export interface ProductAvailability {
  available: boolean;
  stock: number;
  isActive: boolean;
  productId: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
}

export interface BestSellerProduct extends Product {
  totalSold: number;
}

// Types pour les catégories
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  productsCount?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
}

export interface CategoryWithProducts {
  products: Product[];
  total: number;
  category: Category;
}

export interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  bestSellers: BestSellerProduct[]
  searchResults: Product[]
  recentlyViewed: Product[]
  currentProduct: ProductDetails | null
  categories: Category[]
  currentCategory: Category | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  currentFilters: ProductFilterRequest
  isLoading: boolean
  isFeaturedLoading: boolean
  isBestSellersLoading: boolean
  isSearchLoading: boolean
  isCategoriesLoading: boolean
  error: string | null
  searchError: string | null
}
