'use client'

import { useEffect } from 'react'
import { ProductFilters } from '@/components/products/ProductFilters'
import { useProductStore } from '@/store/productStore'

interface ConnectedProductFiltersProps {
  className?: string
}

export function ConnectedProductFilters({ className }: ConnectedProductFiltersProps) {
  const { 
    categories,
    currentFilters,
    isCategoriesLoading,
    fetchCategories,
    setFilters,
    clearFilters
  } = useProductStore()

  // Charger les catégories au montage
  useEffect(() => {
    if (categories.length === 0 && !isCategoriesLoading) {
      fetchCategories()
    }
  }, [categories.length, isCategoriesLoading, fetchCategories])

  const handleFilterChange = (filters: typeof currentFilters) => {
    setFilters(filters)
  }

  const handleReset = () => {
    clearFilters()
  }

  return (
    <ProductFilters
      categories={categories}
      currentFilters={currentFilters}
      onFilterChange={handleFilterChange}
      onReset={handleReset}
      className={className}
    />
  )
}