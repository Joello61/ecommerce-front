'use client'

import { useUserStore } from '@/store/userStore'
import { showToast } from '@/store/uiStore'
import type { Address, AddressRequest } from '@/types'
import { AddressForm } from '@/components/users/AddresseForm'

interface ConnectedAddressFormProps {
  address?: Address
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ConnectedAddressForm({ 
  address, 
  onSuccess,
  onCancel,
  className 
}: ConnectedAddressFormProps) {
  const { 
    createAddress, 
    updateAddress,
    isUpdating
  } = useUserStore()

  const handleSubmit = async (data: AddressRequest) => {
    try {
      if (address) {
        // Mise à jour
        await updateAddress(address.id, data)
        showToast.success('Adresse mise à jour avec succès')
      } else {
        // Création
        await createAddress(data)
        showToast.success('Adresse ajoutée avec succès')
      }
      
      onSuccess?.()
    } catch (error) {
      // L'erreur est déjà gérée par le store
      console.error('Error submitting address:', error)
      throw error
    }
  }

  return (
    <AddressForm
      address={address}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isUpdating}
      className={className}
    />
  )
}