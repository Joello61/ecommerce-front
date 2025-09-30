'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'Tous les produits', href: '/products' },
    { label: 'Catégories', href: '/categories' },
    { label: 'Nouveautés', href: '/products?sort=new' },
    { label: 'Promotions', href: '/products?sale=true' },
  ],
  account: [
    { label: 'Mon compte', href: '/account/profile' },
    { label: 'Mes commandes', href: '/account/orders' },
    { label: 'Adresses', href: '/account/addresses' },
    { label: 'Connexion', href: '/login' },
  ],
  help: [
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Livraison', href: '/shipping' },
    { label: 'Retours', href: '/returns' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/legal' },
    { label: 'CGV', href: '/terms' },
    { label: 'Confidentialité', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

interface FooterProps {
  companyName?: string
  description?: string
  email?: string
  phone?: string
}

export function Footer({
  companyName = 'ShopName',
  description = 'Votre boutique en ligne de confiance pour des produits de qualité.',
  email = 'contact@shopname.com',
  phone = '+33 1 23 45 67 89'
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="container py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* À propos - 2 colonnes sur large */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-primary">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-4 max-w-sm">
              {description}
            </p>
            
            {/* Contact */}
            <div className="space-y-2 text-sm mb-4">
              <a 
                href={`mailto:${email}`} 
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{email}</span>
              </a>
              <a 
                href={`tel:${phone.replace(/\s/g, '')}`} 
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                {phone}
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens - 3 colonnes sur large */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Boutique</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Mon compte</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Aide</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} {companyName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}