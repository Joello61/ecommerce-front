import { apiClient } from '@/lib/api'
import type {
  CartSummary,
  AddToCartRequest,
  UpdateCartItemRequest,
  MergeGuestCartRequest,
  CartValidationResponse,
  CartCountResponse,
  QuickAddResponse
} from '@/types'

class CartService {
  /**
   * Récupération du panier actuel
   */
  async getCart(): Promise<CartSummary> {
    const response = await apiClient.get<CartSummary>('/cart')
    return response.data
  }

  /**
   * Ajout d'un produit au panier
   */
  async addToCart(productId: number, quantity: number): Promise<CartSummary> {
    const request: AddToCartRequest = { productId, quantity }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await apiClient.post<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cartItem: any
      cartSummary: CartSummary['cart']
    }>('/cart/add', request)
    
    // Retourner le résumé complet du panier
    const fullCart = await this.getCart()
    return fullCart
  }

  /**
   * Mise à jour de la quantité d'un article
   */
  async updateCartItem(itemId: number, quantity: number): Promise<CartSummary> {
    const request: UpdateCartItemRequest = { quantity }
    await apiClient.put(`/cart/items/${itemId}`, request)
    
    // Retourner le panier mis à jour
    const cart = await this.getCart()
    return cart
  }

  /**
   * Suppression d'un article du panier
   */
  async removeFromCart(itemId: number): Promise<CartSummary> {
    await apiClient.delete(`/cart/items/${itemId}`)
    
    // Retourner le panier mis à jour
    const cart = await this.getCart()
    return cart
  }

  /**
   * Vidage complet du panier
   */
  async clearCart(): Promise<CartSummary> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await apiClient.delete<{ cartSummary: CartSummary['cart'] }>('/cart/clear')
    
    // Retourner le panier vide
    const cart = await this.getCart()
    return cart
  }

  /**
   * Fusion du panier invité avec le panier utilisateur
   */
  async mergeGuestCart(guestItems: Array<{ productId: number; quantity: number }>): Promise<CartSummary> {
    const request: MergeGuestCartRequest = { items: guestItems }
    await apiClient.post('/cart/merge', request)
    
    // Retourner le panier fusionné
    const cart = await this.getCart()
    return cart
  }

  /**
   * Validation du panier (vérification stock, prix, etc.)
   */
  async validateCart(): Promise<CartValidationResponse> {
    const response = await apiClient.post<CartValidationResponse>('/cart/validate')
    return response.data
  }

  /**
   * Récupération du nombre d'articles dans le panier
   */
  async getCartCount(): Promise<CartCountResponse> {
    const response = await apiClient.get<CartCountResponse>('/cart/count')
    return response.data
  }

  /**
   * Ajout rapide au panier (pour boutons d'achat rapide)
   */
  async quickAddToCart(productId: number, quantity: number = 1): Promise<QuickAddResponse> {
    const response = await apiClient.post<QuickAddResponse>(`/cart/quick-add/${productId}/${quantity}`)
    return response.data
  }

  /**
   * Vérification si un produit est dans le panier
   */
  async isProductInCart(productId: number): Promise<boolean> {
    try {
      const cart = await this.getCart()
      return cart.items.some(item => item.product.id === productId)
    } catch {
      return false
    }
  }

  /**
   * Récupération de la quantité d'un produit dans le panier
   */
  async getProductQuantityInCart(productId: number): Promise<number> {
    try {
      const cart = await this.getCart()
      const item = cart.items.find(item => item.product.id === productId)
      return item?.quantity || 0
    } catch {
      return 0
    }
  }

  /**
   * Duplication d'un article du panier
   */
  async duplicateCartItem(itemId: number): Promise<CartSummary> {
    const cart = await this.getCart()
    const item = cart.items.find(i => i.id === itemId)
    
    if (!item) {
      throw new Error('Article non trouvé dans le panier')
    }
    
    return this.addToCart(item.product.id, item.quantity)
  }

  /**
   * Sauvegarde du panier pour plus tard
   */
  async saveCartForLater(): Promise<void> {
    await apiClient.post('/cart/save-for-later')
  }

  /**
   * Restauration d'un panier sauvegardé
   */
  async restoreSavedCart(): Promise<CartSummary> {
    await apiClient.post('/cart/restore-saved')
    const cart = await this.getCart()
    return cart
  }

  /**
   * Application d'un code promo
   */
  async applyCoupon(couponCode: string): Promise<CartSummary> {
    await apiClient.post('/cart/apply-coupon', { code: couponCode })
    const cart = await this.getCart()
    return cart
  }

  /**
   * Suppression d'un code promo
   */
  async removeCoupon(): Promise<CartSummary> {
    await apiClient.delete('/cart/remove-coupon')
    const cart = await this.getCart()
    return cart
  }

  /**
   * Estimation des frais de livraison
   */
  async estimateShipping(postalCode: string, country: string): Promise<{
    options: Array<{
      id: string
      name: string
      price: string
      estimatedDays: number
    }>
  }> {
    const response = await apiClient.post<{
      options: Array<{
        id: string
        name: string
        price: string
        estimatedDays: number
      }>
    }>('/cart/estimate-shipping', { postalCode, country })
    return response.data
  }

  /**
   * Récupération des recommandations basées sur le panier
   */
  async getCartRecommendations(): Promise<Array<{
    id: number
    name: string
    price: string
    imageName?: string
  }>> {
    const response = await apiClient.get<{
      products: Array<{
        id: number
        name: string
        price: string
        imageName?: string
      }>
    }>('/cart/recommendations')
    return response.data.products
  }
}

// Instance singleton
export const cartService = new CartService()
export default cartService