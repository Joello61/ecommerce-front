'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavigationProps {
  mobile?: boolean
  onLinkClick?: () => void
}

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/products', label: 'Produits' },
  { href: '/categories', label: 'Catégories' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation({ mobile = false, onLinkClick }: NavigationProps) {
  const pathname = usePathname()

  if (mobile) {
    return (
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                'px-4 py-2.5 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'relative px-4 py-2 font-medium rounded-lg transition-colors',
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}