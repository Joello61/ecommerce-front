'use client'

import { motion } from 'framer-motion'
import { MapPin, Edit, Trash2, Check } from 'lucide-react'
import type { Address } from '@/types'
import { cn } from '@/lib/utils'

interface AddressCardProps {
  address: Address
  onEdit?: (address: Address) => void
  onDelete?: (addressId: number) => void
  onSetDefault?: (addressId: number) => void
  isLoading?: boolean
  className?: string
}

export function AddressCard({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault,
  isLoading,
  className 
}: AddressCardProps) {
  
  return (
    <div className={cn('card p-4 relative', className)}>
      {/* Badge par défaut */}
      {address.isDefault && (
        <div className="absolute top-2 right-2">
          <span className="badge-success text-xs inline-flex items-center gap-1">
            <Check className="h-3 w-3" />
            Par défaut
          </span>
        </div>
      )}

      {/* Contenu */}
      <div className="pr-20">
        <div className="flex items-start gap-3 mb-3">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">
              {address.firstName} {address.lastName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {address.street}<br />
              {address.zipCode} {address.city}<br />
              {address.country}
            </p>
            {address.phone && (
              <p className="text-sm text-muted-foreground mt-1">
                Tél: {address.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        {!address.isDefault && onSetDefault && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSetDefault(address.id)}
            disabled={isLoading}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            Définir par défaut
          </motion.button>
        )}
        
        {onEdit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(address)}
            disabled={isLoading}
            className="ml-auto p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </motion.button>
        )}
        
        {onDelete && !address.isDefault && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(address.id)}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors disabled:opacity-50"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  )
}