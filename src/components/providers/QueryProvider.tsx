'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: React.ReactNode
}

// Configuration du QueryClient optimisée pour l'e-commerce
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache pendant 5 minutes par défaut
        staleTime: 1000 * 60 * 5,
        // Garde en cache pendant 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry intelligent
        retry: (failureCount, error) => {
          // Ne pas retry sur les erreurs 4xx (erreurs client)
          if (error instanceof Error && 'status' in error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const status = (error as any).status
            if (status >= 400 && status < 500) {
              return false
            }
          }
          // Retry max 3 fois pour les autres erreurs
          return failureCount < 3
        },
        // Délai de retry progressif
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch automatique
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        // Retry pour les mutations critiques
        retry: (failureCount, error) => {
          if (error instanceof Error && 'status' in error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const status = (error as any).status
            // Ne retry que sur les erreurs réseau/serveur
            if (status >= 500) {
              return failureCount < 2
            }
          }
          return false
        },
        // Délai de retry pour mutations
        retryDelay: 1000,
      },
    },
  })
}

// Instance unique du QueryClient
let queryClient: QueryClient | undefined

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Côté serveur : toujours créer un nouveau client
    return createQueryClient()
  }
  
  // Côté client : réutiliser le client existant
  if (!queryClient) {
    queryClient = createQueryClient()
  }
  return queryClient
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Ne pas recréer le client à chaque render
  const client = React.useMemo(() => getQueryClient(), [])

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* DevTools uniquement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

// Hook pour accéder au QueryClient si nécessaire
export const useQueryClient = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = React.useContext(QueryClient as any)
  if (!client) {
    throw new Error('useQueryClient must be used within QueryProvider')
  }
  return client
}

// Préfixes de clés pour l'organisation
export const QUERY_KEYS = {
  // Authentification
  auth: ['auth'] as const,
  currentUser: ['auth', 'currentUser'] as const,
  
  // Produits
  products: ['products'] as const,
  product: (id: number) => ['products', id] as const,
  productSearch: (query: string) => ['products', 'search', query] as const,
  
  // Catégories
  categories: ['categories'] as const,
  category: (slug: string) => ['categories', slug] as const,
  
  // Panier
  cart: ['cart'] as const,
  cartCount: ['cart', 'count'] as const,
  
  // Commandes
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  
  // Utilisateur
  user: ['user'] as const,
  userProfile: ['user', 'profile'] as const,
  userAddresses: ['user', 'addresses'] as const,
  userStats: ['user', 'stats'] as const,
} as const

// Utilitaires pour invalider le cache
export const invalidateQueries = {
  auth: (client: QueryClient) => client.invalidateQueries({ queryKey: QUERY_KEYS.auth }),
  cart: (client: QueryClient) => client.invalidateQueries({ queryKey: QUERY_KEYS.cart }),
  products: (client: QueryClient) => client.invalidateQueries({ queryKey: QUERY_KEYS.products }),
  orders: (client: QueryClient) => client.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  user: (client: QueryClient) => client.invalidateQueries({ queryKey: QUERY_KEYS.user }),
}