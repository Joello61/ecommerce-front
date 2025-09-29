export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Emerald Store',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Votre boutique en ligne moderne',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'EUR',
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '€',
  itemsPerPage: parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || '20'),
  maxCartItems: parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS || '99'),
} as const

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  docsUrl: process.env.NEXT_PUBLIC_API_DOCS_URL || 'http://localhost:8000/docs',
  imagesUrl: process.env.NEXT_PUBLIC_IMAGES_URL || 'http://localhost:8000/uploads',
  imagesDomain: process.env.NEXT_PUBLIC_IMAGES_DOMAIN || 'localhost',
} as const

export const FEATURES = {
  registration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  guestCheckout: process.env.NEXT_PUBLIC_ENABLE_GUEST_CHECKOUT === 'true',
  wishlist: process.env.NEXT_PUBLIC_ENABLE_WISHLIST === 'true',
  reviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
} as const

export const CONTACT = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@emerald-store.com',
  support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@emerald-store.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '+33 1 23 45 67 89',
} as const

export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
} as const

export const ROUTES = {
  home: '/',
  products: '/products',
  categories: '/categories',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/account/orders',
  profile: '/account/profile',
  login: '/login',
  register: '/register',
  about: '/about',
  contact: '/contact',
} as const

export const ORDER_STATUSES = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
} as const

export const PRODUCT_SORT_OPTIONS = [
  { value: 'name:asc', label: 'Nom A-Z' },
  { value: 'name:desc', label: 'Nom Z-A' },
  { value: 'price:asc', label: 'Prix croissant' },
  { value: 'price:desc', label: 'Prix décroissant' },
  { value: 'createdAt:desc', label: 'Plus récents' },
  { value: 'createdAt:asc', label: 'Plus anciens' },
] as const

export const PAYMENT_METHODS = [
  { id: 'card', name: 'Carte bancaire', icon: 'CreditCard' },
  { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
  { id: 'bank', name: 'Virement bancaire', icon: 'Building' },
] as const

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Livraison standard', price: '4.99', days: '3-5 jours' },
  { id: 'express', name: 'Livraison express', price: '9.99', days: '1-2 jours' },
  { id: 'free', name: 'Livraison gratuite', price: '0.00', days: '5-7 jours', minAmount: 50 },
] as const