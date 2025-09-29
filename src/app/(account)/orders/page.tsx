// src/app/(account)/orders/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Filter } from 'lucide-react'
import { orderService } from '@/services/orderService'
import { OrderCard } from '@/components/features/orders/OrderCard'
import type { Order, OrderStatus } from '@/types'
import Loading from '@/components/ui/Loading'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  // Charger les commandes
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
        console.error('Erreur chargement commandes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Filtrer les commandes
  useEffect(() => {
    let filtered = orders

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus)
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query)
      )
    }

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, searchQuery])

  const statusFilters: Array<{ value: OrderStatus | 'all'; label: string; count: number }> = [
    { value: 'all', label: 'Toutes', count: orders.length },
    { value: 'pending', label: 'En attente', count: orders.filter(o => o.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmées', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'processing', label: 'En préparation', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'Expédiées', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Livrées', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Annulées', count: orders.filter(o => o.status === 'cancelled').length },
  ]

  if (isLoading) {
    return <Loading size="lg" text="Chargement des commandes..." centered />
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
        <p className="text-muted-foreground">
          {orders.length} commande{orders.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filtres et recherche */}
      <div className="card p-4 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par numéro de commande..."
            className="input pl-10"
          />
        </div>

        {/* Filtres de statut */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                selectedStatus === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-muted hover:bg-muted/80'
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
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {orders.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {orders.length === 0
              ? 'Vous n\'avez pas encore passé de commande'
              : 'Aucune commande ne correspond à vos critères de recherche'}
          </p>
          {orders.length === 0 && (
            <button
              onClick={() => window.location.href = '/products'}
              className="btn-primary"
            >
              Découvrir nos produits
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}