// src/app/(account)/layout.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Settings, Lock, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Loading from '@/components/ui/Loading'

interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=' + pathname)
    }
  }, [isAuthenticated, isLoading, router, pathname])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  const navItems = [
    {
      href: '/profile',
      label: 'Mon profil',
      icon: User,
      description: 'Informations personnelles'
    },
    {
      href: '/orders',
      label: 'Mes commandes',
      icon: Package,
      description: 'Historique des achats'
    },
    {
      href: '/addresses',
      label: 'Mes adresses',
      icon: MapPin,
      description: 'Adresses de livraison'
    },
    {
      href: '/change-password',
      label: 'Mot de passe',
      icon: Lock,
      description: 'Sécurité du compte'
    },
    {
      href: '/settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Préférences'
    },
  ]

  // Chargement
  if (isLoading) {
    return <Loading size="lg" text="Chargement..." centered />
  }

  // Non authentifié
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header mobile */}
      <div className="lg:hidden border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">Mon compte</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
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
              'fixed lg:sticky top-16 lg:top-4 left-0 right-0 z-30 lg:z-auto',
              'bg-background lg:bg-transparent',
              'transition-transform duration-300',
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
          >
            <div className="card p-6 space-y-6">
              {/* Info utilisateur */}
              <div className="pb-6 border-b border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user?.fullName}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
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
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                        isActive
                          ? 'bg-primary text-white'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-medium',
                          isActive && 'text-white'
                        )}>
                          {item.label}
                        </p>
                        <p className={cn(
                          'text-xs',
                          isActive ? 'text-white/80' : 'text-muted-foreground'
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* Déconnexion */}
              <div className="pt-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay mobile */}
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            />
          )}

          {/* Contenu principal */}
          <main className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}