import { useCallback, useState, useEffect } from 'react'

// Exports des hooks spécialisés
export { default as useAuth, useAuthGuard, withAuth } from './useAuth'
export { default as useCart, useGuestCart } from './useCart'
export { default as useProducts, useProductSearch, useProductFiltersWithURL } from './useProducts'
export { default as useUser, useAddresses, useAvatar } from './useUser'

// Hook utilitaire pour les images et formatage
export const useUtil = () => {
  // Import dynamique pour éviter les erreurs SSR
  const getUtilsSync = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('@/lib/utils')
    } catch {
      // Fallback si utils n'est pas disponible
      return {
        getImageUrl: (src: string) => src,
        formatPrice: (price: number) => `${price}€`,
        getInitials: (name: string) => name.charAt(0).toUpperCase(),
        formatDate: (date: Date | string) => new Date(date).toLocaleDateString(),
      }
    }
  }
  
  const { getImageUrl, formatPrice, getInitials, formatDate } = getUtilsSync()
  
  return {
    getImageUrl,
    formatPrice,
    getInitials,
    formatDate,
  }
}

// Hook pour la gestion des erreurs globales
export const useErrorHandler = () => {
  // Import dynamique avec gestion d'erreur
  const getStore = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('@/store')
    } catch {
      return {
        showToast: {
          error: (title: string, message: string) => {
            console.error(`${title}: ${message}`)
          }
        }
      }
    }
  }
  
  const { showToast } = getStore()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = useCallback((error: any, customMessage?: string) => {
    console.error('Error caught:', error)
    
    const message = customMessage || 
      error?.message || 
      'Une erreur inattendue s\'est produite'
    
    showToast.error('Erreur', message)
  }, [showToast])

  const handleAsyncError = useCallback(<T>(promise: Promise<T>, customMessage?: string): Promise<T> => {
    return promise.catch((error) => {
      handleError(error, customMessage)
      throw error
    })
  }, [handleError])

  return {
    handleError,
    handleAsyncError,
  }
}

// Hook pour la gestion des états de chargement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsyncState = <T = any>(initialState: T | null = null) => {
  const [data, setData] = useState<T | null>(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(initialState)
    setError(null)
    setIsLoading(false)
  }, [initialState])

  const setDataSafe = useCallback((newData: T | null) => {
    setData(newData)
  }, [])

  const setErrorSafe = useCallback((newError: string | null) => {
    setError(newError)
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
    setData: setDataSafe,
    setError: setErrorSafe,
  }
}

// Hook pour le debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook pour détecter les clics à l'extérieur
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Hook pour les raccourcis clavier
export const useKeyboardShortcut = (
  keys: string[],
  callback: () => void,
  options: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrl = false, shift = false, alt = false } = options
      
      if (
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        keys.includes(event.key)
      ) {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [keys, callback, options])
}

// Hook pour la gestion des médias queries
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Support pour les anciens navigateurs
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // Fallback pour les anciens navigateurs
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])

  return matches
}

// Hook pour détecter si on est sur mobile
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)')
}

// Hook pour la gestion du scroll
export const useScrollPosition = (): number => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return

    const updatePosition = () => {
      setScrollPosition(window.pageYOffset || document.documentElement.scrollTop)
    }

    window.addEventListener('scroll', updatePosition, { passive: true })
    updatePosition() // Initialiser la position

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

// Hook pour détecter si on a scrollé
export const useIsScrolled = (threshold = 0): boolean => {
  const scrollPosition = useScrollPosition()
  return scrollPosition > threshold
}

// Hook pour la gestion de l'état local avec localStorage
export const useLocalStorage = <T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // État local
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Fonction pour mettre à jour la valeur
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permettre value d'être une fonction pour avoir la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Sauvegarder dans localStorage si on est côté client
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// Hook pour la gestion de la pagination
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }, [totalPages])
  
  const goToNext = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])
  
  const goToPrevious = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])
  
  const goToFirst = useCallback(() => {
    goToPage(1)
  }, [goToPage])
  
  const goToLast = useCallback(() => {
    goToPage(totalPages)
  }, [goToPage, totalPages])
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  }
}