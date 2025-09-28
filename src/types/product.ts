export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
  imageName?: string;
  category: Category;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: string;
  stock: number;
  isActive?: boolean;
  isFeatured?: boolean;
  imageFile?: File;
  category: string; // IRI
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  imageFile?: File;
}

export interface ProductFilters {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  products?: Product[];
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