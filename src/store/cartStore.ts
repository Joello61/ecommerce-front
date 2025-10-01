import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { getErrorMessage } from '@/lib/api'
import type { CartSummary, CartValidationResponse } from '@/types'
import cartService from '@/services/cartService'

interface CartState {
  // État
  cart: CartSummary | null
  isLoading: boolean
  error: string | null
  isValidating: boolean
  validationErrors: string[]

  // Actions panier
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateCartItem: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  
  // Actions avancées
  validateCart: () => Promise<CartValidationResponse>
  mergeGuestCart: (guestItems: Array<{ productId: number; quantity: number }>) => Promise<void>
  quickAddToCart: (productId: number, quantity?: number) => Promise<void>
  
  // Utilitaires
  isProductInCart: (productId: number) => boolean
  getProductQuantityInCart: (productId: number) => number
  getCartItemsCount: () => number
  getItemsCount: () => number // Alias pour compatibilité
  getCartTotal: () => string
  isCartEmpty: () => boolean
  
  // Alias pour composants (compatibilité)
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  
  // Actions internes
  setCart: (cart: CartSummary | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  cart: null,
  isLoading: false,
  error: null,
  isValidating: false,
  validationErrors: [],
}

export const useCartStore = create<CartState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions panier
        fetchCart: async () => {
          set({ isLoading: true, error: null })
          
          try {
            const cart = await cartService.getCart()
            set({ cart, isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              cart: null,
              isLoading: false, 
              error: errorMessage 
            })
          }
        },

        addToCart: async (productId: number, quantity = 1) => {
          const currentCart = get().cart
          set({ isLoading: true, error: null })
          
          try {
            const updatedCart = await cartService.addToCart(productId, quantity)
            set({ cart: updatedCart, isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              cart: currentCart,
              isLoading: false, 
              error: errorMessage 
            })
            throw error
          }
        },

        updateCartItem: async (itemId: number, quantity: number) => {
          const currentCart = get().cart
          set({ isLoading: true, error: null })
          
          try {
            const updatedCart = await cartService.updateCartItem(itemId, quantity)
            set({ cart: updatedCart, isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              cart: currentCart,
              isLoading: false, 
              error: errorMessage 
            })
            throw error
          }
        },

        removeFromCart: async (itemId: number) => {
          const currentCart = get().cart
          set({ isLoading: true, error: null })
          
          try {
            const updatedCart = await cartService.removeFromCart(itemId)
            set({ cart: updatedCart, isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              cart: currentCart,
              isLoading: false, 
              error: errorMessage 
            })
            throw error
          }
        },

        clearCart: async () => {
          set({ isLoading: true, error: null })
          
          try {
            const clearedCart = await cartService.clearCart()
            set({ cart: clearedCart, isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        // Actions avancées
        validateCart: async () => {
          set({ isValidating: true, validationErrors: [] })
          
          try {
            const validation = await cartService.validateCart()
            set({ 
              isValidating: false,
              validationErrors: validation.errors || []
            })
            
            if (validation.cartSummary) {
              const currentCart = get().cart
              if (currentCart) {
                set({
                  cart: {
                    ...currentCart,
                    cart: validation.cartSummary
                  }
                })
              }
            }
            
            return validation
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              isValidating: false,
              error: errorMessage,
              validationErrors: []
            })
            throw error
          }
        },

        mergeGuestCart: async (guestItems: Array<{ productId: number; quantity: number }>) => {
          if (!guestItems.length) return
          
          set({ isLoading: true, error: null })
          
          try {
            const mergedCart = await cartService.mergeGuestCart(guestItems)
            set({ cart: mergedCart, isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        quickAddToCart: async (productId: number, quantity = 1) => {
          const currentCart = get().cart
          
          try {
            await cartService.quickAddToCart(productId, quantity)
            await get().fetchCart()
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              cart: currentCart,
              error: errorMessage 
            })
            throw error
          }
        },

        // Utilitaires
        isProductInCart: (productId: number) => {
          const cart = get().cart
          if (!cart?.items) return false
          return cart.items.some(item => item.product.id === productId)
        },

        getProductQuantityInCart: (productId: number) => {
          const cart = get().cart
          if (!cart?.items) return 0
          const item = cart.items.find(item => item.product.id === productId)
          return item?.quantity || 0
        },

        getCartItemsCount: () => {
          const cart = get().cart
          return cart?.cart.totalItems || 0
        },

        getItemsCount: () => {
          const cart = get().cart
          return cart?.cart.totalItems || 0
        },

        getCartTotal: () => {
          const cart = get().cart
          return cart?.cart.totalPrice || '0.00'
        },

        isCartEmpty: () => {
          const cart = get().cart
          return cart?.cart.isEmpty ?? true
        },

        // Alias pour compatibilité
        updateQuantity: async (itemId: number, quantity: number) => {
          return get().updateCartItem(itemId, quantity)
        },

        removeItem: async (itemId: number) => {
          return get().removeFromCart(itemId)
        },

        // Actions internes
        setCart: (cart: CartSummary | null) => {
          set({ cart })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        setError: (error: string | null) => {
          set({ error })
        },

        clearError: () => {
          set({ error: null, validationErrors: [] })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'cart-store',
        partialize: (state) => ({
          cart: state.cart,
        }),
      }
    )
  )
)

// Sélecteurs optimisés
export const useCart = () => useCartStore((state) => state.cart)
export const useCartItems = () => useCartStore((state) => state.cart?.items || [])
export const useCartSummary = () => useCartStore((state) => state.cart?.cart)
export const useCartLoading = () => useCartStore((state) => state.isLoading)
export const useCartError = () => useCartStore((state) => state.error)
export const useCartItemsCount = () => useCartStore((state) => state.getCartItemsCount())
export const useCartTotal = () => useCartStore((state) => state.getCartTotal())
export const useIsCartEmpty = () => useCartStore((state) => state.isCartEmpty())

export const useIsProductInCart = (productId: number) => {
  return useCartStore((state) => state.isProductInCart(productId))
}

export const useProductQuantityInCart = (productId: number) => {
  return useCartStore((state) => state.getProductQuantityInCart(productId))
}