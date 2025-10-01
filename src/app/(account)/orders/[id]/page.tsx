'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { orderService } from '@/services/orderService'
import { showToast } from '@/store/uiStore'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import { formatPrice } from '@/lib/utils'
import type { OrderDetails } from '@/types'
import { OrderStatus, OrderTimeline } from '@/components/orders/OrderStatus'
import { useOrderStore } from '@/store/orderStore'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.id as string

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const { currentTracking, isTrackingLoading, trackOrder } = useOrderStore()

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await orderService.getOrder(orderNumber)
        setOrder(data)
      } catch (error) {
        console.error('Erreur:', error)
        showToast.error('Commande introuvable')
        router.push('/account/orders')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
    trackOrder(orderNumber)
  }, [orderNumber, router, trackOrder])

  const handleCancelOrder = async () => {
    if (!order) return

    setIsCancelling(true)
    try {
      await orderService.cancelOrder(order.order.orderNumber)
      showToast.success('Commande annulée')
      const updatedOrder = await orderService.getOrder(orderNumber)
      setOrder(updatedOrder)
      setShowCancelModal(false)
    } catch (error) {
      console.error('Erreur:', error)
      showToast.error("Impossible d'annuler la commande")
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
      console.error('Erreur:', error)
      showToast.error('Impossible de télécharger la facture')
    }
  }

  if (isLoading) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  if (!order) return null

  const canCancel = ['pending', 'confirmed'].includes(order.order.status)

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <button
        onClick={() => router.push('/account/orders')}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux commandes
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Commande #{order.order.orderNumber}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatus status={order.order.status} />
            <span className="text-sm text-gray-600">
              Passée le {formatDate(order.order.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn-outline text-danger border-danger hover:bg-danger hover:text-white"
            >
              Annuler
            </button>
          )}
          <button
            onClick={handleDownloadInvoice}
            className="btn-outline"
          >
            Facture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Articles commandés</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Adresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <h3 className="font-semibold text-gray-900">Livraison</h3>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {order.addresses.shipping.formatted}
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="font-semibold text-gray-900">Facturation</h3>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {order.addresses.billing.formatted}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.order.notes && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{order.order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar - Timeline */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-6">Suivi</h3>

            {isTrackingLoading ? (
              <div className="text-center text-gray-600">
                Chargement du suivi...
              </div>
            ) : !currentTracking ? (
              <div className="text-center text-gray-600">
                Impossible de charger le suivi de la commande
              </div>
            ) : (
              <OrderTimeline 
                currentStatus={currentTracking.status}
                createdAt={currentTracking.createdAt}
                shippedAt={currentTracking.shippedAt}
                deliveredAt={currentTracking.deliveredAt}
              />
            )}
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
        <p className="text-gray-600 mb-4">
          Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
        </p>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">
            Si vous avez déjà payé, vous serez remboursé sous 5-7 jours ouvrés.
          </p>
        </div>
      </Modal>
    </div>
  )
}