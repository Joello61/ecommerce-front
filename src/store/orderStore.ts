import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { getErrorMessage } from '@/lib/api'
import type { 
  Order, 
  OrderDetails, 
  OrderTracking,
  OrderStats,
  OrderFilterRequest 
} from '@/types'
import orderService from '@/services/orderService'

interface OrderState {
  orders: Order[]
  currentOrder: OrderDetails | null
  currentTracking: OrderTracking | null
  stats: OrderStats | null
  pagination: {
    page: number
    limit: number
    total: number
  }
  currentFilters: OrderFilterRequest
  isLoading: boolean
  isTrackingLoading: boolean
  error: string | null
  
  fetchOrders: (filters?: OrderFilterRequest) => Promise<void>
  fetchOrder: (orderNumber: string) => Promise<void>
  trackOrder: (orderNumber: string) => Promise<void>
  cancelOrder: (orderNumber: string, reason?: string) => Promise<void>
  fetchStats: () => Promise<void>
  setFilters: (filters: Partial<OrderFilterRequest>) => void
  clearFilters: () => void
  clearError: () => void
  reset: () => void
}

const initialFilters: OrderFilterRequest = {
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'desc'
}

const initialState = {
  orders: [],
  currentOrder: null,
  currentTracking: null,
  stats: null,
  pagination: { page: 1, limit: 20, total: 0 },
  currentFilters: initialFilters,
  isLoading: false,
  isTrackingLoading: false,
  error: null,
}

export const useOrderStore = create<OrderState>()(
  subscribeWithSelector(
    (set, get) => ({
      ...initialState,

      fetchOrders: async (filters?: OrderFilterRequest) => {
        const finalFilters = filters || get().currentFilters
        set({ isLoading: true, error: null, currentFilters: finalFilters })
        
        try {
          const response = await orderService.getOrders(finalFilters)
          set({
            orders: response.orders,
            pagination: {
              page: finalFilters.page || 1,
              limit: finalFilters.limit || 20,
              total: response.total
            },
            isLoading: false
          })
        } catch (error) {
          set({
            orders: [],
            isLoading: false,
            error: getErrorMessage(error)
          })
        }
      },

      fetchOrder: async (orderNumber: string) => {
        set({ isLoading: true, error: null, currentOrder: null })
        
        try {
          const order = await orderService.getOrder(orderNumber)
          set({ currentOrder: order, isLoading: false })
        } catch (error) {
          set({
            currentOrder: null,
            isLoading: false,
            error: getErrorMessage(error)
          })
        }
      },

      trackOrder: async (orderNumber: string) => {
        set({ isTrackingLoading: true, error: null })
        
        try {
          const tracking = await orderService.trackOrder(orderNumber)
          set({ currentTracking: tracking, isTrackingLoading: false })
        } catch (error) {
          set({
            currentTracking: null,
            isTrackingLoading: false,
            error: getErrorMessage(error)
          })
        }
      },

      cancelOrder: async (orderNumber: string, reason?: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await orderService.cancelOrder(orderNumber, reason)
          
          // Rafraîchir la commande
          await get().fetchOrder(orderNumber)
          await get().trackOrder(orderNumber)
          
          set({ isLoading: false })
        } catch (error) {
          set({
            isLoading: false,
            error: getErrorMessage(error)
          })
          throw error
        }
      },

      fetchStats: async () => {
        try {
          const stats = await orderService.getOrderStats()
          set({ stats })
        } catch (error) {
          console.error('Error fetching order stats:', error)
        }
      },

      setFilters: (filters: Partial<OrderFilterRequest>) => {
        const newFilters = { ...get().currentFilters, ...filters }
        get().fetchOrders(newFilters)
      },

      clearFilters: () => {
        get().fetchOrders(initialFilters)
      },

      clearError: () => {
        set({ error: null })
      },

      reset: () => {
        set(initialState)
      },
    })
  )
)

export const useOrders = () => useOrderStore((state) => state.orders)
export const useCurrentOrder = () => useOrderStore((state) => state.currentOrder)
export const useOrderTracking = () => useOrderStore((state) => state.currentTracking)
export const useOrderStats = () => useOrderStore((state) => state.stats)
export const useOrderLoading = () => useOrderStore((state) => state.isLoading)