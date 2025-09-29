'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login',
  fallback 
}: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  // Chargement
  if (isLoading) {
    return fallback || (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Non authentifié
  if (!isAuthenticated) {
    return null
  }

  // Vérification du rôle si requis
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-muted-foreground">
            Vous n&apos;avez pas les permissions nécessaires
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook pour protéger facilement une page
export function useAuthGuard(requiredRole?: string) {
  const router = useRouter()
  const { isAuthenticated, isLoading, hasRole } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (requiredRole && !hasRole(requiredRole)) {
        router.push('/')
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, hasRole, router])

  return { isAuthenticated, isLoading, isAuthorized: !requiredRole || hasRole(requiredRole) }
}