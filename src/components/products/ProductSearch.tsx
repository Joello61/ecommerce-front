'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductSearchProps {
  onSearch?: (query: string) => void
  onSearchResults?: (results: Product[]) => void
  placeholder?: string
  className?: string
  showResults?: boolean
}

export function ProductSearch({ 
  onSearch, 
  onSearchResults,
  placeholder = 'Rechercher des produits...', 
  className,
  showResults = true 
}: ProductSearchProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        // Simuler un appel API - À remplacer par votre vraie logique
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
          if (onSearchResults) {
            onSearchResults(results)
          }
        }
      } catch (error) {
        console.error('Erreur de recherche:', error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      setIsSearching(false)
    }
  }, [query, onSearchResults])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/products?search=${encodeURIComponent(query)}`)
      }
      inputRef.current?.blur()
      setIsFocused(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setSearchResults([])
    inputRef.current?.focus()
  }

  const handleResultClick = (slug: string) => {
    router.push(`/products/${slug}`)
    setQuery('')
    setSearchResults([])
    setIsFocused(false)
  }

  const showDropdown = isFocused && query.trim().length >= 2 && showResults

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="input pl-10 pr-10 w-full"
        />
        {query && !isSearching && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Effacer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </form>

      {/* Résultats de recherche */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 card shadow-lg max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product.slug)}
                  className="w-full px-4 py-2 hover:bg-gray-50 text-left transition-colors flex items-center gap-3"
                >
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {product.category.name}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {product.price} €
                  </span>
                </button>
              ))}
              {searchResults.length > 5 && (
                <button
                  onClick={() => router.push(`/products?search=${encodeURIComponent(query)}`)}
                  className="w-full px-4 py-2 text-sm text-primary hover:bg-gray-50 transition-colors text-center"
                >
                  Voir tous les résultats ({searchResults.length})
                </button>
              )}
            </div>
          ) : query.trim().length >= 2 && !isSearching ? (
            <div className="px-4 py-8 text-center text-gray-600">
              <p>Aucun résultat pour &quot;{query}&quot;</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}