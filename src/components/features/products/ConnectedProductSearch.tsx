'use client'

import { ProductSearch } from '@/components/products/ProductSearch'
import { useProductStore } from '@/store/productStore'

interface ConnectedProductSearchProps {
  placeholder?: string
  className?: string
  showResults?: boolean
  onResultClick?: () => void
}

export function ConnectedProductSearch({ 
  placeholder,
  className,
  showResults = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResultClick
}: ConnectedProductSearchProps) {
  const { 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchResults,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSearchLoading,
    searchProducts
  } = useProductStore()

  const handleSearch = async (query: string) => {
    if (query.trim().length >= 2) {
      await searchProducts(query)
    }
  }

  const handleSearchResults = (results: typeof searchResults) => {
    // Les résultats sont déjà gérés par le store
    console.log('Search results:', results.length)
  }

  return (
    <ProductSearch
      onSearch={handleSearch}
      onSearchResults={handleSearchResults}
      placeholder={placeholder}
      className={className}
      showResults={showResults}
    />
  )
}