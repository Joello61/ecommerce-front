'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthStore, useUser } from '@/store/authStore'
import { showToast } from '@/store/uiStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/login',
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const user = useUser()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  const isInitializing = useAuthStore(state => state.isInitializing)

  useEffect(() => {
    const loading = isLoading || isInitializing

    if (!loading && !isAuthenticated) {
      const redirect = pathname ? `${redirectTo}?redirect=${pathname}` : redirectTo
      router.push(redirect)
    }

    if (!loading && isAuthenticated && requiredRole && user) {
      const hasRole = user.roles.includes(requiredRole)
      
      if (!hasRole) {
        showToast.error('Accès refusé', 'Permissions insuffisantes')
        router.push('/')
      }
    }
  }, [isAuthenticated, isLoading, isInitializing, requiredRole, user, redirectTo, pathname, router])

  // Chargement
  if (isLoading || isInitializing) {
    return fallback || (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Non authentifié
  if (!isAuthenticated) {
    return null
  }

  // Vérification du rôle
  if (requiredRole && user) {
    const hasRole = user.roles.includes(requiredRole)
    
    if (!hasRole) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
            <p className="text-gray-600">Permissions insuffisantes</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}