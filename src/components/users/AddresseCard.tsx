'use client'

import { MapPin, Edit, Trash2, Check } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { showToast } from '@/store/uiStore'
import type { Address } from '@/types'
import { cn } from '@/lib/utils'

interface AddressCardProps {
  address: Address
  onEdit?: (address: Address) => void
  className?: string
}

export function AddressCard({ address, onEdit, className }: AddressCardProps) {
  const deleteAddress = useUserStore(state => state.deleteAddress)
  const setDefaultAddress = useUserStore(state => state.setDefaultAddress)
  const isUpdating = useUserStore(state => state.isUpdating)

  const handleDelete = async (addressId: number) => {
    try {
      await deleteAddress(addressId)
      showToast.success('Adresse supprimée avec succès')
    } catch (error) {
      showToast.error('Impossible de supprimer l\'adresse')
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefault = async (addressId: number) => {
    try {
      await setDefaultAddress(addressId)
      showToast.success('Adresse définie par défaut')
    } catch (error) {
      showToast.error('Impossible de définir l\'adresse par défaut')
      console.error('Error setting default address:', error)
    }
  }

  return (
    <div className={cn('card p-5 relative h-full flex flex-col', className)}>
      {address.isDefault && (
        <div className="absolute top-3 right-3">
          <span className="badge-success inline-flex items-center gap-1">
            <Check className="w-3 h-3" />
            Par défaut
          </span>
        </div>
      )}

      <div className="flex-1 pr-2">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {address.firstName} {address.lastName}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {address.street}<br />
              {address.zipCode} {address.city}<br />
              {address.country}
            </p>
            {address.phone && (
              <p className="text-sm text-gray-600 mt-2">
                Tél : {address.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
        {!address.isDefault && (
          <button
            onClick={() => handleSetDefault(address.id)}
            disabled={isUpdating}
            className="text-sm text-primary hover:underline disabled:opacity-50 transition-opacity"
          >
            Définir par défaut
          </button>
        )}

        <div className="ml-auto flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(address)}
              disabled={isUpdating}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Modifier"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {!address.isDefault && (
            <button
              onClick={() => handleDelete(address.id)}
              disabled={isUpdating}
              className="p-2 rounded-lg hover:bg-red-50 hover:text-danger transition-colors disabled:opacity-50"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}