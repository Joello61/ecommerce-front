import { useAuthStore } from './authStore'
import { useCartStore } from './cartStore'
import { useProductStore } from './productStore'
import { useUIStore } from './uiStore'
import { useUserStore } from './userStore'

// Export des stores principaux
export { 
  useAuthStore,
  useUser,
  useIsAuthenticated, 
  useAuthLoading,
  useAuthError,
  useIsAdmin,
  useHasRole,
  authActions
} from './authStore'

export {
  useCartStore,
  useCart,
  useCartItems,
  useCartSummary,
  useCartLoading,
  useCartError,
  useCartItemsCount,
  useCartTotal,
  useIsCartEmpty,
  useIsProductInCart,
  useProductQuantityInCart,
  cartActions
} from './cartStore'

export {
  useProductStore,
  useProducts,
  useFeaturedProducts,
  useBestSellers,
  useCurrentProduct,
  useCategories,
  useProductLoading,
  useProductError,
  useProductPagination,
  useProductFilters,
  useSearchResults,
  useSearchLoading,
  useRecentlyViewed,
  useProductById,
  useCategoryById,
  productActions
} from './productStore'

export {
  useUIStore,
  useTheme,
  useLanguage,
  useToasts,
  usePageLoading,
  useShowLoader,
  useIsSidebarOpen,
  useIsCartDrawerOpen,
  useIsMobileMenuOpen,
  useIsSearchModalOpen,
  useIsProfileMenuOpen,
  useIsModalOpen,
  uiActions,
  showToast
} from './uiStore'

export {
  useUserStore,
  useUserProfile,
  useUserAddresses,
  useUserStats,
  useUserNotificationPreferences,
  useUserLoading,
  useUserError,
  useIsUserUpdating,
  useDefaultAddress,
  useHasAddresses,
  useAddressById,
  userActions
} from './userStore'

// Types et interfaces utiles
export type {
  AuthState,
  CartState,
  ProductState,
  UIState,
  UserState
} from '@/types'

// Objet centralisé pour toutes les actions
export const storeActions = {
  auth: {
    login: () => useAuthStore.getState().login,
    logout: () => useAuthStore.getState().logout,
    checkAuth: () => useAuthStore.getState().checkAuth,
    clearError: () => useAuthStore.getState().clearError,
  },
  cart: {
    fetchCart: () => useCartStore.getState().fetchCart,
    addToCart: () => useCartStore.getState().addToCart,
    clearCart: () => useCartStore.getState().clearCart,
    clearError: () => useCartStore.getState().clearError,
  },
  products: {
    fetchProducts: () => useProductStore.getState().fetchProducts,
    fetchProduct: () => useProductStore.getState().fetchProduct,
    searchProducts: () => useProductStore.getState().searchProducts,
    fetchCategories: () => useProductStore.getState().fetchCategories,
    setFilters: () => useProductStore.getState().setFilters,
    clearFilters: () => useProductStore.getState().clearFilters,
    clearError: () => useProductStore.getState().clearError,
  },
  user: {
    fetchProfile: () => useUserStore.getState().fetchProfile,
    updateProfile: () => useUserStore.getState().updateProfile,
    fetchAddresses: () => useUserStore.getState().fetchAddresses,
    createAddress: () => useUserStore.getState().createAddress,
    updateAddress: () => useUserStore.getState().updateAddress,
    deleteAddress: () => useUserStore.getState().deleteAddress,
    setDefaultAddress: () => useUserStore.getState().setDefaultAddress,
    fetchStats: () => useUserStore.getState().fetchStats,
    clearError: () => useUserStore.getState().clearError,
  },
  ui: {
    addToast: () => useUIStore.getState().addToast,
    removeToast: () => useUIStore.getState().removeToast,
    openModal: () => useUIStore.getState().openModal,
    closeModal: () => useUIStore.getState().closeModal,
    setTheme: () => useUIStore.getState().setTheme,
    toggleTheme: () => useUIStore.getState().toggleTheme,
    closeAllDrawers: () => useUIStore.getState().closeAllDrawers,
  }
} as const

// Hook pour réinitialiser tous les stores
export const useResetAllStores = () => {
  return () => {
    useAuthStore.getState().reset()
    useCartStore.getState().reset()
    useProductStore.getState().reset()
    useUserStore.getState().reset()
    useUIStore.getState().reset()
  }
}

// Hook pour initialiser l'application
export const useInitializeApp = () => {
  return async () => {
    try {
      // Vérifier l'authentification
      await useAuthStore.getState().checkAuth()
      
      // Si authentifié, charger les données utilisateur
      if (useAuthStore.getState().isAuthenticated) {
        await useCartStore.getState().fetchCart()
        await useUserStore.getState().fetchProfile()
        await useUserStore.getState().fetchAddresses()
      }
      
      // Charger les données de base
      await useProductStore.getState().fetchCategories()
      await useProductStore.getState().fetchFeaturedProducts()
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'application:', error)
    }
  }
}