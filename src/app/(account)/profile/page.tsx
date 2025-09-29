// src/app/(account)/profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Plus, MapPin } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { ProfileCard } from '@/components/features/users/ProfileCard'
import { ProfileForm } from '@/components/features/users/ProfileForm'
import { AddressCard } from '@/components/features/users/AddresseCard'
import { AddressForm } from '@/components/features/users/AddresseForm'
import { showToast } from '@/store/uiStore'
import type { Address, AddressRequest, UpdateProfileRequest } from '@/types'
import Loading from '@/components/ui/Loading'
import Modal from '@/components/ui/Modal'

export default function ProfilePage() {
  const {
    profile,
    addresses,
    isProfileLoading,
    isAddressesLoading,
    isUpdating,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useUserStore()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null)

  // Charger les données au montage
  useEffect(() => {
    fetchProfile()
    fetchAddresses()
  }, [fetchProfile, fetchAddresses])

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data)
      setIsEditingProfile(false)
      showToast.success('Profil mis à jour', 'Vos informations ont été enregistrées')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleUploadAvatar = async (file: File) => {
    try {
      await uploadAvatar(file)
      showToast.success('Photo de profil mise à jour')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleCreateAddress = async (data: AddressRequest) => {
    try {
      await createAddress(data)
      setIsAddingAddress(false)
      showToast.success('Adresse ajoutée')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleUpdateAddress = async (data: AddressRequest) => {
    if (!editingAddress) return
    
    try {
      await updateAddress(editingAddress.id, data)
      setEditingAddress(null)
      showToast.success('Adresse mise à jour')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDeleteAddress = async () => {
    if (!deletingAddressId) return
    
    try {
      await deleteAddress(deletingAddressId)
      setDeletingAddressId(null)
      showToast.success('Adresse supprimée')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleSetDefault = async (addressId: number) => {
    try {
      await setDefaultAddress(addressId)
      showToast.success('Adresse définie par défaut')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (isProfileLoading || !profile) {
    return <Loading size="lg" text="Chargement du profil..." centered />
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos adresses
          </p>
        </div>
      </div>

      {/* Profil */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Informations personnelles</h2>
          {!isEditingProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditingProfile(true)}
              className="btn-outline inline-flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </motion.button>
          )}
        </div>

        {isEditingProfile ? (
          <ProfileForm
            profile={profile}
            onSubmit={handleUpdateProfile}
            onCancel={() => setIsEditingProfile(false)}
            isLoading={isUpdating}
          />
        ) : (
          <ProfileCard
            profile={profile}
            onUpdateAvatar={handleUploadAvatar}
            editable
          />
        )}
      </section>

      {/* Adresses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mes adresses</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingAddress(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une adresse
          </motion.button>
        </div>

        {isAddressesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="card p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune adresse</h3>
            <p className="text-muted-foreground mb-6">
              Ajoutez votre première adresse de livraison
            </p>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une adresse
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={setEditingAddress}
                onDelete={setDeletingAddressId}
                onSetDefault={handleSetDefault}
                isLoading={isUpdating}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Nouvelle adresse */}
      <Modal
        isOpen={isAddingAddress}
        onClose={() => setIsAddingAddress(false)}
        title="Nouvelle adresse"
        size="lg"
      >
        <AddressForm
          onSubmit={handleCreateAddress}
          onCancel={() => setIsAddingAddress(false)}
          isLoading={isUpdating}
        />
      </Modal>

      {/* Modal Modifier adresse */}
      <Modal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        title="Modifier l'adresse"
        size="lg"
      >
        {editingAddress && (
          <AddressForm
            address={editingAddress}
            onSubmit={handleUpdateAddress}
            onCancel={() => setEditingAddress(null)}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* Modal Confirmer suppression */}
      <Modal
        isOpen={!!deletingAddressId}
        onClose={() => setDeletingAddressId(null)}
        title="Supprimer l'adresse"
        variant="danger"
        confirmText="Supprimer"
        onConfirm={handleDeleteAddress}
        loading={isUpdating}
      >
        <p className="text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est irréversible.
        </p>
      </Modal>
    </div>
  )
}