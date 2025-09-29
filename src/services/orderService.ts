// src/services/orderService.ts
import { apiClient } from '@/lib/api'
import type {
  Order,
  OrderDetails,
  CreateOrderRequest,
  OrderFilterRequest,
  OrderListResponse,
  OrderTracking,
  OrderStats,
  CancelOrderRequest,
} from '@/types'

class OrderService {
  /**
   * Récupération de la liste des commandes de l'utilisateur
   */
  async getOrders(filters?: Partial<OrderFilterRequest>): Promise<OrderListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString())
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    }

    const response = await apiClient.get<OrderListResponse>(`/orders?${params.toString()}`)
    return response.data
  }

  /**
   * Récupération des détails d'une commande
   */
  async getOrder(orderNumber: string): Promise<OrderDetails> {
    const response = await apiClient.get<OrderDetails>(`/orders/${orderNumber}`)
    return response.data
  }

  /**
   * Création d'une nouvelle commande à partir du panier
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<{ order: Order }>('/orders', request)
    return response.data.order
  }

  /**
   * Annulation d'une commande
   */
  async cancelOrder(orderNumber: string, reason?: string): Promise<Order> {
    const request: Partial<CancelOrderRequest> = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reason: (reason as any) || 'customer_request',
      comment: reason,
    }
    
    const response = await apiClient.post<{ order: Order }>(`/orders/${orderNumber}/cancel`, request)
    return response.data.order
  }

  /**
   * Suivi d'une commande
   */
  async trackOrder(orderNumber: string): Promise<OrderTracking> {
    const response = await apiClient.get<{ tracking: OrderTracking }>(`/orders/${orderNumber}/track`)
    return response.data.tracking
  }

  /**
   * Récupération des statistiques des commandes
   */
  async getOrderStats(): Promise<OrderStats> {
    const response = await apiClient.get<{ stats: OrderStats }>('/orders/stats')
    return response.data.stats
  }

  /**
   * Récupération de l'historique des commandes
   */
  async getOrderHistory(limit = 10): Promise<Order[]> {
    const response = await this.getOrders({ limit, sortBy: 'created_at', sortOrder: 'desc' })
    return response.orders
  }

  /**
   * Récupération des commandes récentes
   */
  async getRecentOrders(limit = 5): Promise<Order[]> {
    const response = await this.getOrders({ 
      limit, 
      sortBy: 'created_at', 
      sortOrder: 'desc' 
    })
    return response.orders
  }

  /**
   * Récupération des commandes par statut
   */
  async getOrdersByStatus(status: string, limit = 20): Promise<Order[]> {
    const response = await this.getOrders({ 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: status as any, 
      limit,
      sortBy: 'updated_at',
      sortOrder: 'desc'
    })
    return response.orders
  }

  /**
   * Recherche de commandes
   */
  async searchOrders(query: string): Promise<Order[]> {
    const response = await this.getOrders({ 
      search: query,
      limit: 50
    })
    return response.orders
  }

  /**
   * Récupération d'une commande par numéro
   */
  async findOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const orderDetails = await this.getOrder(orderNumber)
      return orderDetails.order
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null
    }
  }

  /**
   * Vérification si une commande peut être annulée
   */
  async canCancelOrder(orderNumber: string): Promise<boolean> {
    try {
      const tracking = await this.trackOrder(orderNumber)
      return tracking.canBeCancelled
    } catch {
      return false
    }
  }

  /**
   * Vérification si une commande est terminée
   */
  async isOrderCompleted(orderNumber: string): Promise<boolean> {
    try {
      const tracking = await this.trackOrder(orderNumber)
      return tracking.isCompleted
    } catch {
      return false
    }
  }

  /**
   * Téléchargement de la facture d'une commande
   */
  async downloadInvoice(orderNumber: string): Promise<void> {
    await apiClient.downloadFile(`/orders/${orderNumber}/invoice`, `invoice-${orderNumber}.pdf`)
  }

  /**
   * Téléchargement du bon de livraison
   */
  async downloadDeliveryNote(orderNumber: string): Promise<void> {
    await apiClient.downloadFile(`/orders/${orderNumber}/delivery-note`, `delivery-note-${orderNumber}.pdf`)
  }

  /**
   * Demande de retour/remboursement
   */
  async requestReturn(orderNumber: string, items: Array<{
    itemId: number
    quantity: number
    reason: string
  }>): Promise<void> {
    await apiClient.post(`/orders/${orderNumber}/return`, { items })
  }

  /**
   * Récupération du statut de livraison
   */
  async getDeliveryStatus(orderNumber: string): Promise<{
    status: string
    estimatedDelivery?: string
    trackingNumber?: string
    carrier?: string
  }> {
    const response = await apiClient.get<{
      status: string
      estimatedDelivery?: string
      trackingNumber?: string
      carrier?: string
    }>(`/orders/${orderNumber}/delivery-status`)
    return response.data
  }

  /**
   * Confirmation de réception de commande
   */
  async confirmDelivery(orderNumber: string): Promise<void> {
    await apiClient.post(`/orders/${orderNumber}/confirm-delivery`)
  }

  /**
   * Notation d'une commande
   */
  async rateOrder(orderNumber: string, rating: number, comment?: string): Promise<void> {
    await apiClient.post(`/orders/${orderNumber}/rate`, { rating, comment })
  }

  /**
   * Récupération des commandes favorites/fréquentes
   */
  async getFavoriteOrders(limit = 10): Promise<Order[]> {
    const response = await apiClient.get<{ orders: Order[] }>(`/orders/favorites?limit=${limit}`)
    return response.data.orders
  }

  /**
   * Ajout d'une commande aux favoris
   */
  async addToFavorites(orderNumber: string): Promise<void> {
    await apiClient.post(`/orders/${orderNumber}/add-to-favorites`)
  }

  /**
   * Suppression d'une commande des favoris
   */
  async removeFromFavorites(orderNumber: string): Promise<void> {
    await apiClient.delete(`/orders/${orderNumber}/remove-from-favorites`)
  }

  /**
   * Recommande une commande (racheter les mêmes produits)
   */
  async reorderItems(orderNumber: string): Promise<{ addedItems: number; unavailableItems: number }> {
    const response = await apiClient.post<{ addedItems: number; unavailableItems: number }>(`/orders/${orderNumber}/reorder`)
    return response.data
  }
}

// Instance singleton
export const orderService = new OrderService()
export default orderService