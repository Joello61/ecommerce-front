// src/components/features/products/ProductFilters.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import type { Category, ProductFilterRequest } from '@/types'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
  categories: Category[]
  currentFilters: ProductFilterRequest
  onFilterChange: (filters: ProductFilterRequest) => void
  onReset: () => void
  className?: string
}

export function ProductFilters({
  categories,
  currentFilters,
  onFilterChange,
  onReset,
  className
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    stock: true,
    featured: true
  })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof ProductFilterRequest, value: any) => {
    onFilterChange({ ...currentFilters, [key]: value })
  }

  const hasActiveFilters = () => {
    return !!(
      currentFilters.categoryId ||
      currentFilters.minPrice ||
      currentFilters.maxPrice ||
      currentFilters.inStock !== undefined ||
      currentFilters.isFeatured !== undefined
    )
  }

  return (
    <>
      {/* Bouton mobile */}
      <div className="lg:hidden mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="btn-outline w-full inline-flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filtres
          {hasActiveFilters() && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
              {Object.values(currentFilters).filter(Boolean).length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Panel de filtres */}
      <motion.div
        initial={false}
        animate={{ height: isOpen || isDesktop ? 'auto' : 0 }}
        className={cn(
          'overflow-hidden lg:overflow-visible',
          className
        )}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filtres</h3>
            {hasActiveFilters() && (
              <button
                onClick={onReset}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Réinitialiser
              </button>
            )}
          </div>

          {/* Catégories */}
          <div className="border-b border-border pb-4">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium">Catégorie</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.category && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.category && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={!currentFilters.categoryId}
                    onChange={() => handleChange('categoryId', undefined)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Toutes</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={currentFilters.categoryId === category.id}
                      onChange={() => handleChange('categoryId', category.id)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Prix */}
          <div className="border-b border-border pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium">Prix</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.price && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.price && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Prix minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentFilters.minPrice || ''}
                    onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0 €"
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Prix maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentFilters.maxPrice || ''}
                    onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1000 €"
                    className="input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Disponibilité */}
          <div className="border-b border-border pb-4">
            <button
              onClick={() => toggleSection('stock')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium">Disponibilité</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.stock && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.stock && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFilters.inStock === true}
                    onChange={(e) => handleChange('inStock', e.target.checked ? true : undefined)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">En stock uniquement</span>
                </label>
              </div>
            )}
          </div>

          {/* Vedettes */}
          <div>
            <button
              onClick={() => toggleSection('featured')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium">Mise en avant</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.featured && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.featured && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFilters.isFeatured === true}
                    onChange={(e) => handleChange('isFeatured', e.target.checked ? true : undefined)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Produits vedettes uniquement</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}