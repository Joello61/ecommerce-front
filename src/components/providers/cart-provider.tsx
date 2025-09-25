'use client'

import * as React from 'react'
import { Cart, CartItem, Product } from '@/lib/types'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'

// ===========================================
// CART CONTEXT & TYPES
// ===========================================

interface CartContextType {
  cart: Cart
  isLoading: boolean
  
  // Actions
  addItem: (product: Product, quantity?: number, variantId?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  
  // Helpers
  getItemQuantity: (productId: string, variantId?: string) => number
  isInCart: (productId: string, variantId?: string) => boolean
  getTotalItems: () => number
  getTotalPrice: () => number
  
  // Coupon
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => void
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

// ===========================================
// CART PROVIDER COMPONENT
// ===========================================

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = React.useState<Cart>({
    id: '',
    items: [],
    itemsCount: 0,
    subtotal: 0,
    taxAmount: 0,
    shippingAmount: 0,
    discountAmount: 0,
    total: 0,
    currency: 'EUR',
  })
  const [isLoading, setIsLoading] = React.useState(true)

  // ===========================================
  // INITIALIZATION - Charger le panier depuis localStorage
  // ===========================================

  React.useEffect(() => {
    const initializeCart = () => {
      try {
        const storedCart = getLocalStorage<Cart | null>('cart', null)
        
        if (storedCart) {
          setCart(storedCart)
        } else {
          // Créer un nouveau panier
          const newCart: Cart = {
            id: `cart_${Date.now()}`,
            items: [],
            itemsCount: 0,
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            discountAmount: 0,
            total: 0,
            currency: 'EUR',
          }
          setCart(newCart)
          setLocalStorage('cart', newCart)
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCart()
  }, [])

  // ===========================================
  // SAVE CART TO LOCALSTORAGE
  // ===========================================

  const saveCart = React.useCallback((updatedCart: Cart) => {
    setLocalStorage('cart', updatedCart)
    setCart(updatedCart)
  }, [])

  // ===========================================
  // CALCULATE CART TOTALS
  // ===========================================

  const calculateTotals = React.useCallback((items: CartItem[]): Partial<Cart> => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Calculs basiques (à adapter selon votre logique métier)
    const taxRate = 0.20 // 20% TVA
    const taxAmount = subtotal * taxRate
    
    // Frais de port gratuits au-dessus de 50€
    const shippingAmount = subtotal > 50 ? 0 : 5.99
    
    const total = subtotal + taxAmount + shippingAmount

    return {
      itemsCount,
      subtotal,
      taxAmount,
      shippingAmount,
      total,
    }
  }, [])

  // ===========================================
  // ADD ITEM TO CART
  // ===========================================

  const addItem = React.useCallback((product: Product, quantity = 1, variantId?: string) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(
        item => item.productId === product.id && item.variant?.id === variantId
      )

      let updatedItems: CartItem[]

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité de l'élément existant
        updatedItems = [...currentCart.items]
        const existingItem = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
          totalPrice: (existingItem.quantity + quantity) * existingItem.unitPrice,
        }
      } else {
        // Ajouter un nouvel élément
        const variant = variantId ? product.variants.find(v => v.id === variantId) : undefined
        const unitPrice = variant?.price || product.price
        
        const newItem: CartItem = {
          id: `${product.id}_${variantId || 'default'}_${Date.now()}`,
          productId: product.id,
          variantId,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0]?.url || '',
            sku: product.sku,
          },
          variant: variant ? {
            id: variant.id,
            name: variant.name,
            attributes: variant.attributes,
          } : undefined,
        }

        updatedItems = [...currentCart.items, newItem]
      }

      const totals = calculateTotals(updatedItems)
      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        ...totals,
      }

      saveCart(updatedCart)
      return updatedCart
    })
  }, [calculateTotals, saveCart])

  // ===========================================
  // REMOVE ITEM FROM CART
  // ===========================================

  const removeItem = React.useCallback((itemId: string) => {
    setCart(currentCart => {
      const updatedItems = currentCart.items.filter(item => item.id !== itemId)
      const totals = calculateTotals(updatedItems)
      
      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        ...totals,
      }

      saveCart(updatedCart)
      return updatedCart
    })
  }, [calculateTotals, saveCart])

  // ===========================================
  // UPDATE ITEM QUANTITY
  // ===========================================

  const updateQuantity = React.useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setCart(currentCart => {
      const updatedItems = currentCart.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          }
        }
        return item
      })

      const totals = calculateTotals(updatedItems)
      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        ...totals,
      }

      saveCart(updatedCart)
      return updatedCart
    })
  }, [calculateTotals, saveCart, removeItem])

  // ===========================================
  // CLEAR CART
  // ===========================================

  const clearCart = React.useCallback(() => {
    const emptyCart: Cart = {
      id: `cart_${Date.now()}`,
      items: [],
      itemsCount: 0,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: 0,
      total: 0,
      currency: 'EUR',
    }

    saveCart(emptyCart)
  }, [saveCart])

  // ===========================================
  // GET ITEM QUANTITY
  // ===========================================

  const getItemQuantity = React.useCallback((productId: string, variantId?: string): number => {
    const item = cart.items.find(
      item => item.productId === productId && item.variant?.id === variantId
    )
    return item?.quantity || 0
  }, [cart.items])

  // ===========================================
  // IS IN CART
  // ===========================================

  const isInCart = React.useCallback((productId: string, variantId?: string): boolean => {
    return cart.items.some(
      item => item.productId === productId && item.variant?.id === variantId
    )
  }, [cart.items])

  // ===========================================
  // GET TOTAL ITEMS
  // ===========================================

  const getTotalItems = React.useCallback((): number => {
    return cart.itemsCount
  }, [cart.itemsCount])

  // ===========================================
  // GET TOTAL PRICE
  // ===========================================

  const getTotalPrice = React.useCallback((): number => {
    return cart.total
  }, [cart.total])

  // ===========================================
  // APPLY COUPON
  // ===========================================

  const applyCoupon = React.useCallback(async (code: string) => {
    try {
      const response = await fetch('/api/symfony/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          cartTotal: cart.subtotal,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Code promo invalide')
      }

      const data = await response.json()
      const { discount } = data.data

      setCart(currentCart => {
        const updatedCart = {
          ...currentCart,
          couponCode: code,
          discountAmount: discount,
          total: currentCart.subtotal + currentCart.taxAmount + currentCart.shippingAmount - discount,
        }

        saveCart(updatedCart)
        return updatedCart
      })
    } catch (error) {
      throw error
    }
  }, [cart.subtotal, saveCart])

  // ===========================================
  // REMOVE COUPON
  // ===========================================

  const removeCoupon = React.useCallback(() => {
    setCart(currentCart => {
      const updatedCart = {
        ...currentCart,
        couponCode: undefined,
        discountAmount: 0,
        total: currentCart.subtotal + currentCart.taxAmount + currentCart.shippingAmount,
      }

      saveCart(updatedCart)
      return updatedCart
    })
  }, [saveCart])

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const contextValue: CartContextType = {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    getTotalItems,
    getTotalPrice,
    applyCoupon,
    removeCoupon,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// ===========================================
// useCart HOOK
// ===========================================

export function useCart(): CartContextType {
  const context = React.useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// ===========================================
// CART ITEM COUNT HOOK (pour badge)
// ===========================================

export function useCartCount(): number {
  const { getTotalItems } = useCart()
  return getTotalItems()
}

// ===========================================
// CART TOTAL HOOK (pour affichage)
// ===========================================

export function useCartTotal(): number {
  const { getTotalPrice } = useCart()
  return getTotalPrice()
}

// ===========================================
// CART ITEM HOOK (pour vérifications produit)
// ===========================================

export function useCartItem(productId: string, variantId?: string) {
  const { getItemQuantity, isInCart, addItem, updateQuantity, removeItem } = useCart()
  
  return {
    quantity: getItemQuantity(productId, variantId),
    isInCart: isInCart(productId, variantId),
    addToCart: (product: Product, quantity?: number) => addItem(product, quantity, variantId),
    updateQuantity: (quantity: number) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const item = useCart().cart.items.find(
        item => item.productId === productId && item.variant?.id === variantId
      )
      if (item) {
        updateQuantity(item.id, quantity)
      }
    },
    removeFromCart: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const item = useCart().cart.items.find(
        item => item.productId === productId && item.variant?.id === variantId
      )
      if (item) {
        removeItem(item.id)
      }
    },
  }
}

// ===========================================
// CART PERSISTENCE HOOK (sync avec serveur)
// ===========================================

export function useCartPersistence() {
  const { cart } = useCart()
  const [lastSynced, setLastSynced] = React.useState<Date | null>(null)
  const [isSyncing, setIsSyncing] = React.useState(false)

  // Synchroniser avec le serveur toutes les 30 secondes si des changements
  React.useEffect(() => {
    if (cart.items.length === 0) return

    const syncToServer = async () => {
      setIsSyncing(true)
      try {
        await fetch('/api/symfony/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cart),
        })
        setLastSynced(new Date())
      } catch (error) {
        console.error('Erreur lors de la synchronisation du panier:', error)
      } finally {
        setIsSyncing(false)
      }
    }

    const interval = setInterval(syncToServer, 30000) // 30 secondes
    return () => clearInterval(interval)
  }, [cart])

  return {
    lastSynced,
    isSyncing,
  }
}