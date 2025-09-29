'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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

export function Navigation({ mobile, onLinkClick }: NavigationProps) {
  const pathname = usePathname()

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
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
          <Link key={link.href} href={link.href} className="relative px-4 py-2">
            <span
              className={cn(
                'relative z-10 font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute inset-0 bg-primary/10 rounded-lg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}