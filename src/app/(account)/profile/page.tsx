'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { ConnectedProfileCard } from '@/components/features/user/ConnectedProfileCard'
import { ConnectedProfileForm } from '@/components/features/user/ConnectedProfileForm'
import { ConnectedAddressCard } from '@/components/features/user/ConnectedAddressCard'
import { ConnectedAddressForm } from '@/components/features/user/ConnectedAddressForm'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import type { Address } from '@/types'

export default function ProfilePage() {
  const { profile, addresses, isProfileLoading, isAddressesLoading, fetchProfile, fetchAddresses } = useUserStore()
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null)

  useEffect(() => {
    fetchProfile()
    fetchAddresses()
  }, [fetchProfile, fetchAddresses])

  if (isProfileLoading || !profile) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mon profil</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et vos adresses
        </p>
      </div>

      {/* Profil */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="btn-outline"
            >
              Modifier
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <ConnectedProfileForm
            onSuccess={() => setIsEditingProfile(false)}
            onCancel={() => setIsEditingProfile(false)}
          />
        ) : (
          <ConnectedProfileCard editable />
        )}
      </section>

      {/* Adresses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Mes adresses</h2>
          <button
            onClick={() => setIsAddingAddress(true)}
            className="btn-primary"
          >
            Ajouter une adresse
          </button>
        </div>

        {isAddressesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse h-full">
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune adresse</h3>
            <p className="text-gray-600 mb-6">
              Ajoutez votre première adresse de livraison
            </p>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="btn-primary"
            >
              Ajouter une adresse
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <ConnectedAddressCard
                key={address.id}
                address={address}
                onEdit={setEditingAddress}
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
        showClose
      >
        <ConnectedAddressForm
          onSuccess={() => setIsAddingAddress(false)}
          onCancel={() => setIsAddingAddress(false)}
        />
      </Modal>

      {/* Modal Modifier adresse */}
      <Modal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        title="Modifier l'adresse"
        size="lg"
        showClose
      >
        {editingAddress && (
          <ConnectedAddressForm
            address={editingAddress}
            onSuccess={() => setEditingAddress(null)}
            onCancel={() => setEditingAddress(null)}
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
        onConfirm={() => {
          // La logique est gérée par ConnectedAddressCard
          setDeletingAddressId(null)
        }}
      >
        <p className="text-gray-600">
          Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est irréversible.
        </p>
      </Modal>
    </div>
  )
}