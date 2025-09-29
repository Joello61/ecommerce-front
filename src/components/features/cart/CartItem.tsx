'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItemDetails } from '@/types'
import { useCart } from '@/components/providers/CartProvider'
import { getImageUrl, formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemDetails
  compact?: boolean
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCart()

  const handleIncrement = async () => {
    try {
      await updateQuantity(item.id, item.quantity + 1)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDecrement = async () => {
    if (item.quantity > 1) {
      try {
        await updateQuantity(item.id, item.quantity - 1)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
  }

  const handleRemove = async () => {
    try {
      await removeItem(item.id)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 bg-card rounded-lg border border-border"
    >
      {/* Image */}
      <Link 
        href={`/products/${item.product.id}`}
        className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-muted"
      >
        <Image
          src={getImageUrl()}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Détails */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/products/${item.product.id}`}
          className="font-medium line-clamp-2 hover:text-primary transition-colors"
        >
          {item.product.name}
        </Link>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="price">{formatPrice(item.product.price)}</span>
          {item.quantity > 1 && (
            <span className="text-xs text-muted-foreground">
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
          <div className="flex items-center border border-border rounded-lg">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDecrement}
              disabled={isLoading || item.quantity <= 1}
              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-50 rounded-l-lg"
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleIncrement}
              disabled={isLoading || item.quantity >= item.product.stock}
              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-50 rounded-r-lg"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Supprimer */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            disabled={isLoading}
            className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
            title="Retirer du panier"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Total */}
      {!compact && (
        <div className="text-right">
          <p className="price-large">{formatPrice(item.totalPrice)}</p>
        </div>
      )}
    </motion.div>
  )
}