'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { useAuth } from '@/components/providers/AuthProvider'

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
  const { isAuthenticated, isLoading, user } = useAuth()

  return (
    <AuthGuard
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      user={user}
      requiredRole={requiredRole}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  )
}