'use client'

import { useState, useEffect } from 'react'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category, ProductFilterRequest } from '@/types'

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
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      }
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleChange = (key: keyof ProductFilterRequest, value: number | boolean | undefined) => {
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

  const activeFiltersCount = Object.values(currentFilters).filter(v => v !== undefined).length

  return (
    <>
      {/* Bouton mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-outline w-full"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filtres
          {hasActiveFilters() && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtres */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 lg:overflow-visible',
          isOpen || isDesktop ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
          className
        )}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
            {hasActiveFilters() && (
              <button
                onClick={onReset}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>

          {/* Catégories */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Catégorie</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform text-gray-600',
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
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Toutes</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={currentFilters.categoryId === category.id}
                      onChange={() => handleChange('categoryId', category.id)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Prix */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Prix</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform text-gray-600',
                  expandedSections.price && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.price && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">
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
                  <label className="text-sm text-gray-600 mb-1.5 block">
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
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('stock')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Disponibilité</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform text-gray-600',
                  expandedSections.stock && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.stock && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.inStock === true}
                  onChange={(e) => handleChange('inStock', e.target.checked ? true : undefined)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">En stock uniquement</span>
              </label>
            )}
          </div>

          {/* Vedettes */}
          <div>
            <button
              onClick={() => toggleSection('featured')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Mise en avant</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform text-gray-600',
                  expandedSections.featured && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.featured && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.isFeatured === true}
                  onChange={(e) => handleChange('isFeatured', e.target.checked ? true : undefined)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Produits vedettes uniquement</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  )
}