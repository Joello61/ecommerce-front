'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItemDetails } from '@/types'
import { formatPrice, getImageUrl, cn } from '@/lib/utils'

interface CartItemProps {
  item: CartItemDetails
  compact?: boolean
  onUpdateQuantity?: (itemId: number, quantity: number) => Promise<void>
  onRemove?: (itemId: number) => Promise<void>
  isLoading?: boolean,
  className?: string
}

export function CartItem({ item, compact = false, onUpdateQuantity, onRemove, isLoading = false, className }: CartItemProps) {
  const handleIncrement = async () => {
    if (onUpdateQuantity) {
      await onUpdateQuantity(item.id, item.quantity + 1)
    }
  }

  const handleDecrement = async () => {
    if (item.quantity > 1 && onUpdateQuantity) {
      await onUpdateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleRemove = async () => {
    if (onRemove) {
      await onRemove(item.id)
    }
  }

  return (
    <div className={cn("flex gap-4 p-4 card", className)}>
      {/* Image */}
      <Link 
        href={`/products/${item.product.id}`}
        className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100"
      >
        <Image
          src={getImageUrl(item.product.imageName)}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Détails */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/products/${item.product.id}`}
          className="font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors"
        >
          {item.product.name}
        </Link>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="price">{formatPrice(item.product.price)}</span>
          {item.quantity > 1 && (
            <span className="text-xs text-gray-600">
              × {item.quantity}
            </span>
          )}
        </div>

        {/* Stock warning */}
        {item.product.stock < 5 && item.product.stock > 0 && (
          <p className="text-xs text-warning mt-1">
            Plus que {item.product.stock} en stock
          </p>
        )}
        {item.product.stock === 0 && (
          <p className="text-xs text-danger mt-1">
            Rupture de stock
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {/* Quantité */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={handleDecrement}
              disabled={isLoading || item.quantity <= 1}
              className="p-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50 rounded-l-lg"
              aria-label="Diminuer la quantité"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={isLoading || item.quantity >= item.product.stock}
              className="p-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50 rounded-r-lg"
              aria-label="Augmenter la quantité"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Supprimer */}
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="p-1.5 text-danger hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Retirer du panier"
            aria-label="Retirer du panier"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total */}
      {!compact && (
        <div className="text-right flex-shrink-0">
          <p className="price text-lg">{formatPrice(item.totalPrice)}</p>
        </div>
      )}
    </div>
  )
}