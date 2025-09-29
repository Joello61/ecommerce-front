'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { useProductStore } from '@/store/productStore'
import { cn } from '@/lib/utils'

interface ProductSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  showResults?: boolean
}

export function ProductSearch({ 
  onSearch, 
  placeholder = 'Rechercher des produits...', 
  className,
  showResults = true 
}: ProductSearchProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  const { searchProducts, searchResults, isSearchLoading } = useProductStore()

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      await searchProducts(query)
      setIsSearching(false)
    }, 500)

    return () => {
      clearTimeout(timer)
      setIsSearching(false)
    }
  }, [query, searchProducts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/products?search=${encodeURIComponent(query)}`)
      }
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleResultClick = (slug: string) => {
    router.push(`/products/${slug}`)
    setQuery('')
    setIsFocused(false)
  }

  const showDropdown = isFocused && query.trim().length >= 2 && showResults

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {(isSearching || isSearchLoading) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </form>

      {/* Résultats de recherche */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full px-4 py-2 hover:bg-muted text-left transition-colors flex items-center gap-3"
                  >
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
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
                    className="w-full px-4 py-2 text-sm text-primary hover:bg-muted transition-colors text-center"
                  >
                    Voir tous les résultats ({searchResults.length})
                  </button>
                )}
              </div>
            ) : query.trim().length >= 2 && !isSearching && !isSearchLoading ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <p>Aucun résultat pour &quot;{query}&quot;</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}