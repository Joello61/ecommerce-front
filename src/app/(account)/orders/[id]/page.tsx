// src/app/(account)/orders/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, X, Package, MapPin, CreditCard } from 'lucide-react'
import { orderService } from '@/services/orderService'
import { OrderStatus, OrderTimeline } from '@/components/features/orders/OrderStatus'
import { showToast } from '@/store/uiStore'
import type { OrderDetails } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'
import Loading from '@/components/ui/Loading'
import Modal from '@/components/ui/Modal'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.id as string
  
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Charger la commande
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await orderService.getOrder(orderNumber)
        setOrder(data)
      } catch (error) {
        console.error('Erreur chargement commande:', error)
        showToast.error('Commande introuvable')
        router.push('/orders')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [orderNumber, router])

  const handleCancelOrder = async () => {
    if (!order) return
    
    setIsCancelling(true)
    try {
      await orderService.cancelOrder(order.order.orderNumber)
      showToast.success('Commande annulée')
      // Recharger la commande
      const updatedOrder = await orderService.getOrder(orderNumber)
      setOrder(updatedOrder)
      setShowCancelModal(false)
    } catch (error) {
      console.error('Erreur annulation:', error)
      showToast.error('Impossible d\'annuler la commande')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleDownloadInvoice = async () => {
    if (!order) return
    
    try {
      await orderService.downloadInvoice(order.order.orderNumber)
      showToast.success('Facture téléchargée')
    } catch (error) {
      console.error('Erreur téléchargement:', error)
      showToast.error('Impossible de télécharger la facture')
    }
  }

  if (isLoading) {
    return <Loading size="lg" text="Chargement de la commande..." centered />
  }

  if (!order) {
    return null
  }

  const canCancel = ['pending', 'confirmed'].includes(order.order.status)

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/orders')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux commandes
      </motion.button>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Commande #{order.order.orderNumber}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatus status={order.order.status} />
            <span className="text-sm text-muted-foreground">
              Passée le {formatDate(order.order.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {canCancel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCancelModal(true)}
              className="btn-outline text-danger border-danger hover:bg-danger hover:text-white inline-flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadInvoice}
            className="btn-outline inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Facture
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Articles commandés</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Adresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adresse de livraison */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Adresse de livraison</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {order.addresses.shipping.formatted}
              </p>
            </div>

            {/* Adresse de facturation */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Adresse de facturation</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {order.addresses.billing.formatted}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.order.notes && (
            <div className="card p-6">
              <h3 className="font-semibold mb-2">Notes de commande</h3>
              <p className="text-sm text-muted-foreground">{order.order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar - Timeline */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="font-semibold mb-6">Suivi de commande</h3>
            <OrderTimeline
              currentStatus={order.order.status}
              createdAt={order.order.createdAt}
              shippedAt={order.order.shippedAt}
              deliveredAt={order.order.deliveredAt}
            />
          </div>
        </div>
      </div>

      {/* Modal Annulation */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annuler la commande"
        variant="danger"
        confirmText="Oui, annuler"
        onConfirm={handleCancelOrder}
        loading={isCancelling}
      >
        <p className="text-muted-foreground">
          Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
        </p>
        <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <p className="text-sm text-warning">
            Si vous avez déjà effectué le paiement, vous serez remboursé sous 5-7 jours ouvrés.
          </p>
        </div>
      </Modal>
    </div>
  )
}