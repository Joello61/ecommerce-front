// src/hooks/useCart.ts
import { useCallback } from 'react'
import { 
  useCartStore,
  useCart as useCartState,
  useCartItems,
  useCartSummary,
  useCartLoading,
  useCartError,
  useCartItemsCount,
  useCartTotal,
  useIsCartEmpty,
  useIsProductInCart,
  useProductQuantityInCart
} from '@/store'
import { showToast } from '@/store'
import { formatPrice } from '@/lib/utils'
import type { CartSummary, CartValidationResponse } from '@/types'
import useAuth from './useAuth'

interface UseCartReturn {
  // État
  cart: CartSummary | null
  items: ReturnType<typeof useCartItems>
  summary: ReturnType<typeof useCartSummary>
  isLoading: boolean
  error: string | null
  itemsCount: number
  total: string
  totalFormatted: string
  isEmpty: boolean
  
  // Actions
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  validateCart: () => Promise<CartValidationResponse>
  
  // Utilitaires produits
  isProductInCart: (productId: number) => boolean
  getProductQuantity: (productId: number) => number
  canAddProduct: (productId: number, quantity?: number) => boolean
  
  // Actions rapides
  incrementItem: (itemId: number) => Promise<void>
  decrementItem: (itemId: number) => Promise<void>
  quickAdd: (productId: number) => Promise<void>
  
  // Utilitaires
  refreshCart: () => Promise<void>
  clearError: () => void
}

export const useCart = (): UseCartReturn => {
  const cartStore = useCartStore()
  
  // Sélecteurs optimisés
  const cart = useCartState()
  const items = useCartItems()
  const summary = useCartSummary()
  const isLoading = useCartLoading()
  const error = useCartError()
  const itemsCount = useCartItemsCount()
  const total = useCartTotal()
  const isEmpty = useIsCartEmpty()

  // Actions avec gestion d'erreurs et notifications
  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    try {
      await cartStore.addToCart(productId, quantity)
      showToast.success(
        'Produit ajouté au panier',
        `${quantity} article${quantity > 1 ? 's' : ''} ajouté${quantity > 1 ? 's' : ''}`
      )
    } catch (error) {
      showToast.error('Erreur', 'Impossible d\'ajouter le produit au panier')
      throw error
    }
  }, [cartStore])

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId)
    }

    try {
      await cartStore.updateCartItem(itemId, quantity)
      showToast.success('Quantité mise à jour')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de mettre à jour la quantité')
      throw error
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartStore])

  const removeItem = useCallback(async (itemId: number) => {
    try {
      await cartStore.removeFromCart(itemId)
      showToast.success('Produit supprimé du panier')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de supprimer le produit')
      throw error
    }
  }, [cartStore])

  const clearCart = useCallback(async () => {
    try {
      await cartStore.clearCart()
      showToast.success('Panier vidé')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de vider le panier')
      throw error
    }
  }, [cartStore])

  const validateCart = useCallback(async () => {
    try {
      const validation = await cartStore.validateCart()
      
      if (!validation.isValid && validation.errors) {
        validation.errors.forEach(error => {
          showToast.warning('Problème détecté', error)
        })
      }
      
      return validation
    } catch (error) {
      showToast.error('Erreur', 'Impossible de valider le panier')
      throw error
    }
  }, [cartStore])

  // Utilitaires produits
  const isProductInCart = useCallback((productId: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useIsProductInCart(productId)
  }, [])

  const getProductQuantity = useCallback((productId: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useProductQuantityInCart(productId)
  }, [])

  const canAddProduct = useCallback((productId: number, quantity = 1) => {
    // Vérifier si le produit peut être ajouté (stock, limites, etc.)
    const currentQuantity = getProductQuantity(productId)
    const newTotal = currentQuantity + quantity
    
    // Limite arbitraire de 99 articles par produit
    return newTotal <= 99
  }, [getProductQuantity])

  // Actions rapides
  const incrementItem = useCallback(async (itemId: number) => {
    const item = items.find(item => item.id === itemId)
    if (!item) return

    const newQuantity = item.quantity + 1
    if (newQuantity > 99) {
      showToast.warning('Limite atteinte', 'Maximum 99 articles par produit')
      return
    }

    await updateQuantity(itemId, newQuantity)
  }, [items, updateQuantity])

  const decrementItem = useCallback(async (itemId: number) => {
    const item = items.find(item => item.id === itemId)
    if (!item) return

    const newQuantity = item.quantity - 1
    await updateQuantity(itemId, newQuantity)
  }, [items, updateQuantity])

  const quickAdd = useCallback(async (productId: number) => {
    try {
      await cartStore.quickAddToCart(productId)
      showToast.success('Ajouté rapidement au panier')
    } catch (error) {
      showToast.error('Erreur', 'Impossible d\'ajouter le produit')
      throw error
    }
  }, [cartStore])

  // Utilitaires
  const refreshCart = useCallback(async () => {
    try {
      await cartStore.fetchCart()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error('Erreur', 'Impossible de rafraîchir le panier')
    }
  }, [cartStore])

  const clearError = useCallback(() => {
    cartStore.clearError()
  }, [cartStore])

  // Prix formaté
  const totalFormatted = formatPrice(total)

  return {
    // État
    cart,
    items,
    summary,
    isLoading,
    error,
    itemsCount,
    total,
    totalFormatted,
    isEmpty,
    
    // Actions
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    validateCart,
    
    // Utilitaires produits
    isProductInCart,
    getProductQuantity,
    canAddProduct,
    
    // Actions rapides
    incrementItem,
    decrementItem,
    quickAdd,
    
    // Utilitaires
    refreshCart,
    clearError,
  }
}

// Hook pour la gestion du panier invité (localStorage)
interface GuestCartItem {
  productId: number
  quantity: number
}

export const useGuestCart = () => {
  const { isAuthenticated } = useAuth()
  const cartStore = useCartStore()

  const getGuestCart = useCallback((): GuestCartItem[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const guestCart = localStorage.getItem('guest-cart')
      return guestCart ? JSON.parse(guestCart) : []
    } catch {
      return []
    }
  }, [])

  const setGuestCart = useCallback((items: GuestCartItem[]) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('guest-cart', JSON.stringify(items))
    } catch (error) {
      console.error('Erreur sauvegarde panier invité:', error)
    }
  }, [])

  const addToGuestCart = useCallback((productId: number, quantity = 1) => {
    if (isAuthenticated) return

    const guestCart = getGuestCart()
    const existingItem = guestCart.find(item => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      guestCart.push({ productId, quantity })
    }

    setGuestCart(guestCart)
    showToast.success('Produit ajouté au panier')
  }, [isAuthenticated, getGuestCart, setGuestCart])

  const mergeGuestCartToUser = useCallback(async () => {
    if (!isAuthenticated) return

    const guestCart = getGuestCart()
    if (guestCart.length === 0) return

    try {
      await cartStore.mergeGuestCart(guestCart)
      localStorage.removeItem('guest-cart')
      showToast.success('Panier synchronisé', 'Vos articles ont été ajoutés')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error('Erreur', 'Impossible de synchroniser le panier')
    }
  }, [isAuthenticated, getGuestCart, cartStore])

  const clearGuestCart = useCallback(() => {
    localStorage.removeItem('guest-cart')
  }, [])

  return {
    getGuestCart,
    addToGuestCart,
    mergeGuestCartToUser,
    clearGuestCart,
  }
}

export default useCart