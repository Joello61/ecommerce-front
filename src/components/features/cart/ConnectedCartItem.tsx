'use client'

import { CartItem } from '@/components/cart/CartItem'
import { useCart } from '@/components/providers/CartProvider'
import type { CartItemDetails } from '@/types'

interface ConnectedCartItemProps {
  item: CartItemDetails
  compact?: boolean
  className?: string
}

export function ConnectedCartItem({ item, compact, className }: ConnectedCartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCart()

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    await updateQuantity(itemId, quantity)
  }

  const handleRemove = async (itemId: number) => {
    await removeItem(itemId)
  }

  return (
    <CartItem
      item={item}
      compact={compact}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemove}
      isLoading={isLoading}
      className={className}
    />
  )
}