// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PaginatedResponse<T = any> {
  data: T[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    from: number
    to: number
  }
}

// ===========================================
// UTILISATEUR & AUTHENTIFICATION
// ===========================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  avatar?: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  newsletter: boolean
  smsNotifications: boolean
  language: 'fr' | 'en' | 'es'
  currency: 'EUR' | 'USD' | 'GBP'
  theme: 'light' | 'dark' | 'system'
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
  acceptTerms: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthUser {
  user: User
  tokens: AuthTokens
}

// ===========================================
// ADRESSES
// ===========================================

export interface Address {
  id: string
  type: 'billing' | 'shipping'
  firstName: string
  lastName: string
  company?: string
  street: string
  streetComplement?: string
  city: string
  postalCode: string
  country: string
  countryCode: string
  phone?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type AddressFormData = Omit<Address, 'id' | 'createdAt' | 'updatedAt'>;

// ===========================================
// PRODUITS & CATALOGUE
// ===========================================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  currency: string
  sku: string
  barcode?: string
  weight?: number
  dimensions?: ProductDimensions
  images: ProductImage[]
  category: Category
  brand?: Brand
  tags: string[]
  variants: ProductVariant[]
  inventory: ProductInventory
  seo: ProductSeo
  status: 'active' | 'inactive' | 'draft'
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  position: number
  isMain: boolean
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price?: number
  comparePrice?: number
  inventory: ProductInventory
  attributes: ProductAttribute[]
}

export interface ProductAttribute {
  name: string
  value: string
  type: 'color' | 'size' | 'material' | 'style' | 'other'
}

export interface ProductInventory {
  quantity: number
  lowStockThreshold: number
  trackInventory: boolean
  allowBackorder: boolean
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface ProductSeo {
  title?: string
  description?: string
  keywords?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  position: number
  isActive: boolean
  productsCount: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  isActive: boolean
}

// ===========================================
// PANIER & COMMANDES
// ===========================================

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product: {
    id: string
    name: string
    slug: string
    image: string
    sku: string
  }
  variant?: {
    id: string
    name: string
    attributes: ProductAttribute[]
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  itemsCount: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  total: number
  currency: string
  couponCode?: string
}

export interface Order {
  id: string
  reference: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  items: OrderItem[]
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  shippingAddress: Address
  billingAddress: Address
  payment: OrderPayment
  shipping: OrderShipping
  pricing: OrderPricing
  notes?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'partially_paid' 
  | 'refunded' 
  | 'partially_refunded' 
  | 'failed'

export type FulfillmentStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'partially_shipped' 
  | 'delivered' 
  | 'returned'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  productImage: string
  variantId?: string
  variantName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  sku: string
}

export interface OrderPayment {
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  currency: string
  transactionId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gatewayResponse?: Record<string, any>
}

export interface OrderShipping {
  method: string
  cost: number
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  actualDelivery?: string
}

export interface OrderPricing {
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  total: number
  currency: string
}

// ===========================================
// PAIEMENTS
// ===========================================

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery'
  isDefault: boolean
  details: PaymentMethodDetails
  createdAt: string
  updatedAt: string
}

export interface PaymentMethodDetails {
  // Pour les cartes
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  
  // Pour PayPal
  email?: string
  
  // Pour virement bancaire
  accountNumber?: string
  bankName?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed'
  clientSecret?: string
  paymentMethod?: PaymentMethod
}

// ===========================================
// LISTE DE SOUHAITS
// ===========================================

export interface WishlistItem {
  id: string
  productId: string
  variantId?: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
    isInStock: boolean
  }
  variant?: {
    id: string
    name: string
    attributes: ProductAttribute[]
  }
  addedAt: string
}

export interface Wishlist {
  id: string
  items: WishlistItem[]
  itemsCount: number
}

// ===========================================
// RETOURS & REMBOURSEMENTS
// ===========================================

export interface ReturnRequest {
  id: string
  orderId: string
  orderReference: string
  status: ReturnStatus
  reason: ReturnReason
  description: string
  items: ReturnItem[]
  refundAmount: number
  refundMethod?: string
  createdAt: string
  updatedAt: string
  processedAt?: string
}

export type ReturnStatus = 
  | 'requested' 
  | 'approved' 
  | 'rejected' 
  | 'processing' 
  | 'completed'

export type ReturnReason = 
  | 'defective' 
  | 'wrong_item' 
  | 'not_as_described' 
  | 'damaged_shipping' 
  | 'changed_mind' 
  | 'other'

export interface ReturnItem {
  orderItemId: string
  productName: string
  variantName?: string
  quantity: number
  unitPrice: number
  reason: ReturnReason
  condition: 'new' | 'used' | 'damaged'
}

// ===========================================
// RECHERCHE & FILTRES
// ===========================================

export interface SearchFilters {
  query?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  onSale?: boolean
  tags?: string[]
  attributes?: Record<string, string[]>
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_desc'
  page?: number
  limit?: number
}

export interface SearchResults {
  products: Product[]
  filters: {
    categories: Array<{ id: string; name: string; count: number }>
    brands: Array<{ id: string; name: string; count: number }>
    priceRange: { min: number; max: number }
    attributes: Array<{
      name: string
      values: Array<{ value: string; count: number }>
    }>
  }
  pagination: {
    total: number
    page: number
    pages: number
    limit: number
  }
}

// ===========================================
// NOTIFICATIONS
// ===========================================

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

// ===========================================
// CONFIGURATION & PARAMÈTRES
// ===========================================

export interface SiteSettings {
  name: string
  description: string
  logo: string
  favicon: string
  currency: string
  language: string
  timezone: string
  maintenance: boolean
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  methods: ShippingMethod[]
}

export interface ShippingMethod {
  id: string
  name: string
  description?: string
  cost: number
  freeThreshold?: number
  estimatedDays: { min: number; max: number }
  isActive: boolean
}

// ===========================================
// ANALYTICS & STATISTIQUES
// ===========================================

export interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  favoriteCategory?: string
  joinDate: string
  lastOrderDate?: string
}

export interface ProductStats {
  views: number
  purchases: number
  rating: number
  reviewsCount: number
  wishlistsCount: number
}

// ===========================================
// ERREURS & VALIDATION
// ===========================================

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: ValidationError[]
}

// ===========================================
// FORMULAIRES
// ===========================================

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterSubscription {
  email: string
  preferences: {
    promotions: boolean
    newProducts: boolean
    newsletter: boolean
  }
}