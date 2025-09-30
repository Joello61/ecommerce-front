'use client'

import { useUserStore } from '@/store/userStore'
import { showToast } from '@/store/uiStore'
import type { Address } from '@/types'
import { AddressCard } from '@/components/users/AddresseCard'

interface ConnectedAddressCardProps {
  address: Address
  onEdit?: (address: Address) => void
  className?: string
}

export function ConnectedAddressCard({ 
  address, 
  onEdit,
  className 
}: ConnectedAddressCardProps) {
  const { 
    deleteAddress, 
    setDefaultAddress,
    isUpdating
  } = useUserStore()

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
    <AddressCard
      address={address}
      onEdit={onEdit}
      onDelete={handleDelete}
      onSetDefault={handleSetDefault}
      isLoading={isUpdating}
      className={className}
    />
  )
}