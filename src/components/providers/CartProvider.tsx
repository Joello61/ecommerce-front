'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/uiStore'
import type { CartSummary, CartValidationResponse } from '@/types'

interface CartContextValue {
  // État
  cart: CartSummary | null
  isLoading: boolean
  error: string | null
  isValidating: boolean
  validationErrors: string[]

  // Actions de base
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>

  // Actions avancées
  validateCart: () => Promise<CartValidationResponse>
  quickAdd: (productId: number, quantity?: number) => Promise<void>
  
  // Utilitaires
  getItemsCount: () => number
  getTotalPrice: () => string
  isEmpty: () => boolean
  isProductInCart: (productId: number) => boolean
  getProductQuantity: (productId: number) => number
  clearError: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const {
    // État du store
    cart,
    isLoading,
    error,
    isValidating,
    validationErrors,
    
    // Actions du store
    fetchCart,
    addToCart: addToCartAction,
    updateCartItem,
    removeFromCart,
    clearCart: clearCartAction,
    validateCart: validateCartAction,
    quickAddToCart,
    mergeGuestCart,
    
    // Utilitaires du store
    isProductInCart: isProductInCartStore,
    getProductQuantityInCart,
    getCartItemsCount,
    getCartTotal,
    isCartEmpty,
    clearError: clearErrorAction,
  } = useCartStore()

  const { isAuthenticated, user } = useAuthStore()

  // Chargement initial du panier
  useEffect(() => {
    const initializeCart = async () => {
      if (isAuthenticated) {
        try {
          await fetchCart()
          
          // Fusionner le panier invité si nécessaire
          const guestCartItems = getGuestCartFromStorage()
          if (guestCartItems.length > 0) {
            await mergeGuestCart(guestCartItems)
            clearGuestCartFromStorage()
            showToast.success('Votre panier invité a été fusionné', 'Panier synchronisé')
          }
        } catch (error) {
          console.warn('Erreur lors du chargement du panier:', error)
        }
      }
    }

    initializeCart()
  }, [isAuthenticated, user?.id, fetchCart, mergeGuestCart])

  // Gestion des erreurs avec toast
  useEffect(() => {
    if (error) {
      showToast.error(error, 'Erreur panier')
    }
  }, [error])

  // Gestion des erreurs de validation
  useEffect(() => {
    if (validationErrors.length > 0) {
      validationErrors.forEach(errorMsg => {
        showToast.warning(errorMsg, 'Problème de panier')
      })
    }
  }, [validationErrors])

  // Actions wrapper avec gestion des notifications et panier invité
  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        await addToCartAction(productId, quantity)
        showToast.success('Produit ajouté au panier', 'Succès')
      } else {
        // Gestion panier invité
        addToGuestCart(productId, quantity)
        showToast.success('Produit ajouté au panier', 'Panier invité')
      }
    } catch (error) {
      throw error
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }
      
      if (isAuthenticated) {
        await updateCartItem(itemId, quantity)
      } else {
        updateGuestCartItem(itemId, quantity)
      }
    } catch (error) {
      throw error
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      if (isAuthenticated) {
        await removeFromCart(itemId)
        showToast.info('Produit retiré du panier')
      } else {
        removeFromGuestCart(itemId)
        showToast.info('Produit retiré du panier invité')
      }
    } catch (error) {
      throw error
    }
  }

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await clearCartAction()
        showToast.info('Panier vidé')
      } else {
        clearGuestCartFromStorage()
        showToast.info('Panier invité vidé')
      }
    } catch (error) {
      throw error
    }
  }

  const refreshCart = async () => {
    if (isAuthenticated) {
      try {
        await fetchCart()
      } catch (error) {
        console.warn('Erreur lors du rafraîchissement du panier:', error)
      }
    }
  }

  const validateCart = async (): Promise<CartValidationResponse> => {
    if (!isAuthenticated) {
      throw new Error('Vous devez être connecté pour valider le panier')
    }
    
    try {
      return await validateCartAction()
    } catch (error) {
      throw error
    }
  }

  const quickAdd = async (productId: number, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        await quickAddToCart(productId, quantity)
        showToast.success('Ajout rapide réussi')
      } else {
        await addToCart(productId, quantity)
      }
    } catch (error) {
      throw error
    }
  }

  // Utilitaires
  const getItemsCount = () => {
    if (isAuthenticated) {
      return getCartItemsCount()
    } else {
      const guestItems = getGuestCartFromStorage()
      return guestItems.reduce((total, item) => total + item.quantity, 0)
    }
  }

  const getTotalPrice = () => {
    if (isAuthenticated) {
      return getCartTotal()
    } else {
      // Pour le panier invité, on ne peut pas calculer le prix total
      // car on n'a pas accès aux prix des produits
      return '0.00'
    }
  }

  const isEmpty = () => {
    if (isAuthenticated) {
      return isCartEmpty()
    } else {
      return getGuestCartFromStorage().length === 0
    }
  }

  const isProductInCart = (productId: number) => {
    if (isAuthenticated) {
      return isProductInCartStore(productId)
    } else {
      const guestItems = getGuestCartFromStorage()
      return guestItems.some(item => item.productId === productId)
    }
  }

  const getProductQuantity = (productId: number) => {
    if (isAuthenticated) {
      return getProductQuantityInCart(productId)
    } else {
      const guestItems = getGuestCartFromStorage()
      const item = guestItems.find(item => item.productId === productId)
      return item?.quantity || 0
    }
  }

  const clearError = () => {
    clearErrorAction()
  }

  const contextValue: CartContextValue = {
    // État
    cart,
    isLoading,
    error,
    isValidating,
    validationErrors,

    // Actions
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
    validateCart,
    quickAdd,

    // Utilitaires
    getItemsCount,
    getTotalPrice,
    isEmpty,
    isProductInCart,
    getProductQuantity,
    clearError,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

// Hook pour utiliser le contexte de panier
export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  return context
}

// Hook pour les statistiques du panier
export function useCartStats() {
  const { cart, getItemsCount, getTotalPrice, isEmpty } = useCart()
  
  return {
    itemsCount: getItemsCount(),
    totalPrice: getTotalPrice(),
    isEmpty: isEmpty(),
    itemsDetails: cart?.items || [],
    cartSummary: cart?.cart,
  }
}

// Hook pour les actions rapides du panier
export function useCartActions() {
  const { addToCart, removeItem, updateQuantity, clearCart } = useCart()
  
  return {
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
  }
}

// Utilitaires pour le panier invité (localStorage)
function getGuestCartFromStorage(): Array<{ productId: number; quantity: number }> {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('guest-cart')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveGuestCartToStorage(items: Array<{ productId: number; quantity: number }>) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('guest-cart', JSON.stringify(items))
  } catch (error) {
    console.warn('Erreur lors de la sauvegarde du panier invité:', error)
  }
}

function addToGuestCart(productId: number, quantity: number) {
  const items = getGuestCartFromStorage()
  const existingIndex = items.findIndex(item => item.productId === productId)
  
  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity
  } else {
    items.push({ productId, quantity })
  }
  
  saveGuestCartToStorage(items)
}

function updateGuestCartItem(productId: number, quantity: number) {
  const items = getGuestCartFromStorage()
  const existingIndex = items.findIndex(item => item.productId === productId)
  
  if (existingIndex >= 0) {
    if (quantity <= 0) {
      items.splice(existingIndex, 1)
    } else {
      items[existingIndex].quantity = quantity
    }
    saveGuestCartToStorage(items)
  }
}

function removeFromGuestCart(productId: number) {
  const items = getGuestCartFromStorage()
  const filteredItems = items.filter(item => item.productId !== productId)
  saveGuestCartToStorage(filteredItems)
}

function clearGuestCartFromStorage() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('guest-cart')
  } catch (error) {
    console.warn('Erreur lors du nettoyage du panier invité:', error)
  }
}