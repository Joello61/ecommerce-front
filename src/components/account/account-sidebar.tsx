'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  UserIcon, 
  ShoppingBagIcon, 
  MapPinIcon,
  CreditCardIcon,
  HeartIcon,
  ArrowUturnLeftIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/providers'
import Image from 'next/image'

// ===========================================
// MENU ITEMS CONFIGURATION
// ===========================================

const accountMenuItems = [
  {
    label: 'Dashboard',
    href: '/account',
    icon: UserIcon,
    description: 'Vue d\'ensemble de votre compte',
    exact: true,
  },
  {
    label: 'Mon profil',
    href: '/account/profile',
    icon: UserIcon,
    description: 'Informations personnelles',
  },
  {
    label: 'Mes commandes',
    href: '/account/orders',
    icon: ShoppingBagIcon,
    description: 'Historique et suivi',
    badge: 'new',
  },
  {
    label: 'Mes adresses',
    href: '/account/addresses',
    icon: MapPinIcon,
    description: 'Adresses de livraison et facturation',
  },
  {
    label: 'Moyens de paiement',
    href: '/account/payment-methods',
    icon: CreditCardIcon,
    description: 'Cartes et méthodes de paiement',
  },
  {
    label: 'Liste de souhaits',
    href: '/account/wishlist',
    icon: HeartIcon,
    description: 'Vos produits favoris',
    badge: '3',
  },
  {
    label: 'Retours',
    href: '/account/returns',
    icon: ArrowUturnLeftIcon,
    description: 'Demandes de retour et remboursement',
  },
  {
    label: 'Paramètres',
    href: '/account/settings',
    icon: Cog6ToothIcon,
    description: 'Préférences et notifications',
  },
]

// ===========================================
// ACCOUNT SIDEBAR COMPONENT
// ===========================================

export function AccountSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fermer le menu mobile lors du changement de route
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
  }

  const isActiveRoute = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsMobileMenuOpen(true)}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Bars3Icon className="h-5 w-5" />
          <span>Menu compte</span>
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AccountSidebarContent 
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
          isActiveRoute={isActiveRoute}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-950 shadow-xl overflow-y-auto">
            <div className="p-4">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Mon Compte</h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Content */}
              <AccountSidebarContent 
                pathname={pathname}
                user={user}
                onLogout={handleLogout}
                isActiveRoute={isActiveRoute}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ===========================================
// SIDEBAR CONTENT COMPONENT
// ===========================================

interface AccountSidebarContentProps {
  pathname: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  onLogout: () => void
  isActiveRoute: (href: string, exact?: boolean) => boolean
  isMobile?: boolean
}

function AccountSidebarContent({ 
  pathname, 
  user, 
  onLogout, 
  isActiveRoute, 
  isMobile = false 
}: AccountSidebarContentProps) {
  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {accountMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveRoute(item.href, item.exact)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
                isMobile && 'py-4'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive 
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'
              )} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'new' ? 'primary' : 'default'}
                      size="sm"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {isMobile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            'w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20',
            isMobile && 'py-4'
          )}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Se déconnecter</span>
        </Button>
      </div>

      {/* Quick Actions (Mobile only) */}
      {isMobile && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Actions rapides
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">
                Continuer les achats
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/cart">
                Voir le panier
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Besoin d&apos;aide ?
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Notre équipe support est là pour vous aider
        </p>
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href="/contact">
            Nous contacter
          </Link>
        </Button>
      </div>
    </div>
  )
}