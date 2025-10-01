'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, Lock, Menu, X, LogOut } from 'lucide-react'
import { useAuthStore, useUser } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useUser()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isInitializing = useAuthStore(state => state.isInitializing)
  const logout = useAuthStore(state => state.logout)
  const checkAuth = useAuthStore(state => state.checkAuth)
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Vérification auth au montage
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Redirection si non auth
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/login?redirect=' + pathname)
    }
  }, [isAuthenticated, isInitializing, router, pathname])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Afficher rien pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { href: '/profile', label: 'Mon profil', icon: User },
    { href: '/orders', label: 'Mes commandes', icon: Package },
    { href: '/change-password', label: 'Mot de passe', icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">Mon compte</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside
            className={cn(
              'lg:col-span-1',
              'fixed lg:sticky top-16 lg:top-8 left-0 right-0 z-20 lg:z-auto',
              'bg-white lg:bg-transparent p-4 lg:p-0',
              'transition-transform duration-300',
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
          >
            <div className="card p-6 space-y-6">
              {/* Info utilisateur */}
              <div className="pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user?.fullName}</p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Déconnexion */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-danger hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay mobile */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            />
          )}

          {/* Contenu principal */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}