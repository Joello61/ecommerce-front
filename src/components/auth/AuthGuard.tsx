'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface User {
  id: number
  email: string
  roles: string[]
}

interface AuthGuardProps {
  children: React.ReactNode
  isAuthenticated: boolean
  isLoading: boolean
  user?: User | null
  requiredRole?: string
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  isAuthenticated,
  isLoading,
  user,
  requiredRole, 
  redirectTo = '/login',
  fallback 
}: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  // Chargement
  if (isLoading) {
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

  // Vérification du rôle si requis
  if (requiredRole && user) {
    const hasRole = user.roles.includes(requiredRole)
    
    if (!hasRole) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
            <p className="text-gray-600">
              Vous n&apos;avez pas les permissions nécessaires
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

// Hook utilitaire pour protéger facilement une page
export function useAuthGuard(
  isAuthenticated: boolean,
  isLoading: boolean,
  user?: User | null,
  requiredRole?: string
) {
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (requiredRole && user) {
        const hasRole = user.roles.includes(requiredRole)
        if (!hasRole) {
          router.push('/')
        }
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, user, router])

  const hasRole = (role: string) => user?.roles.includes(role) ?? false

  return { 
    isAuthenticated, 
    isLoading, 
    isAuthorized: !requiredRole || hasRole(requiredRole) 
  }
}