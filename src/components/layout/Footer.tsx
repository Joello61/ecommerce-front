'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'
import { APP_CONFIG, CONTACT, SOCIAL_LINKS } from '@/lib/constants'

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

const socialIcons = [
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* À propos */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                {APP_CONFIG.name}
              </motion.span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {APP_CONFIG.description}
            </p>
            
            {/* Contact rapide */}
            <div className="space-y-2 text-sm">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                {CONTACT.phone}
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-2 mt-4">
              {socialIcons.map(({ icon: Icon, href, label }) => href && (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Liens */}
          <div>
            <h3 className="font-semibold mb-4">Boutique</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Mon compte</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Aide</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mt-6 mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {APP_CONFIG.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}