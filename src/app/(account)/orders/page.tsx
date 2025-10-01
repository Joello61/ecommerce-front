'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { orderService } from '@/services/orderService'
import Loading from '@/components/ui/Loading'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'
import { OrderCard } from '@/components/orders/OrderCard'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderService.getOrders({
          sortBy: 'created_at',
          sortOrder: 'desc',
          limit: 50
        })
        setOrders(response.orders)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Filtrer les commandes
  useEffect(() => {
    let filtered = orders

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === selectedStatus)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(query)
      )
    }

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, searchQuery])

  const statusFilters: Array<{
    value: OrderStatus | 'all'
    label: string
    count: number
  }> = [
    { value: 'all', label: 'Toutes', count: orders.length },
    { value: 'pending', label: 'En attente', count: orders.filter((o) => o.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmées', count: orders.filter((o) => o.status === 'confirmed').length },
    { value: 'processing', label: 'En préparation', count: orders.filter((o) => o.status === 'processing').length },
    { value: 'shipped', label: 'Expédiées', count: orders.filter((o) => o.status === 'shipped').length },
    { value: 'delivered', label: 'Livrées', count: orders.filter((o) => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Annulées', count: orders.filter((o) => o.status === 'cancelled').length }
  ]

  if (isLoading) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mes commandes</h1>
        <p className="text-gray-600">
          {orders.length} commande{orders.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filtres */}
      <div className="card p-4 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par numéro..."
            className="input pl-10"
          />
        </div>

        {/* Filtres de statut */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                selectedStatus === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {orders.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
          </h3>
          <p className="text-gray-600 mb-6">
            {orders.length === 0
              ? "Vous n'avez pas encore passé de commande"
              : 'Aucune commande ne correspond à vos critères'}
          </p>
          {orders.length === 0 && (
            <button
              onClick={() => router.push('/products')}
              className="btn-primary"
            >
              Découvrir nos produits
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}