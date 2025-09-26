'use client'

import * as React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ===========================================
// FOOTER COMPONENT
// ===========================================

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = React.useState('')
  const [isSubscribing, setIsSubscribing] = React.useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return

    setIsSubscribing(true)
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNewsletterEmail('')
      // Ici vous ajouteriez la logique d'inscription à la newsletter
    } catch (error) {
      console.error('Erreur newsletter:', error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-primary-600 dark:bg-primary-700">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Restez informé de nos dernières offres
            </h2>
            <p className="text-primary-100 mb-6">
              Recevez nos promotions exclusives et nouveautés directement dans votre boîte mail
            </p>
            
            <form 
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 bg-white dark:bg-gray-800"
              />
              <Button
                type="submit"
                variant="secondary"
                loading={isSubscribing}
                loadingText="Inscription..."
                className="whitespace-nowrap"
              >
                S&apos;abonner
              </Button>
            </form>

            <p className="text-xs text-primary-100 mt-3">
              En vous inscrivant, vous acceptez de recevoir nos emails marketing. 
              Vous pouvez vous désabonner à tout moment.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                E-commerce
              </span>
            </Link>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Votre boutique en ligne de confiance depuis 2020. 
              Nous proposons une sélection de produits de qualité 
              avec une livraison rapide et un service client exceptionnel.
            </p>
            
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                Livraison gratuite
              </Badge>
              <Badge variant="info" size="sm">
                Retours 30j
              </Badge>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Boutique
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Catégories
                </Link>
              </li>
              <li>
                <Link 
                  href="/promotions" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Promotions
                </Link>
              </li>
              <li>
                <Link 
                  href="/nouveautes" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link 
                  href="/meilleures-ventes" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Meilleures ventes
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Mon Compte
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/account" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Mon profil
                </Link>
              </li>
              <li>
                <Link 
                  href="/account/orders" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link 
                  href="/account/wishlist" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Liste de souhaits
                </Link>
              </li>
              <li>
                <Link 
                  href="/account/addresses" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Mes adresses
                </Link>
              </li>
              <li>
                <Link 
                  href="/account/returns" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/aide" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link 
                  href="/livraison" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link 
                  href="/retours" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Retours & échanges
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Security Icons */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Moyens de paiement acceptés
              </h4>
              <div className="flex items-center gap-3">
                {/* Icons de paiement simulés avec des badges */}
                <Badge variant="outline" size="sm">Visa</Badge>
                <Badge variant="outline" size="sm">MasterCard</Badge>
                <Badge variant="outline" size="sm">PayPal</Badge>
                <Badge variant="outline" size="sm">Apple Pay</Badge>
                <Badge variant="outline" size="sm">Google Pay</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Sécurité & Certifications
              </h4>
              <div className="flex items-center gap-3">
                <Badge variant="success" size="sm">SSL Sécurisé</Badge>
                <Badge variant="success" size="sm">GDPR</Badge>
                <Badge variant="success" size="sm">3D Secure</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>© {currentYear} E-commerce. Tous droits réservés.</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link 
                href="/mentions-legales" 
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Mentions légales
              </Link>
              <Link 
                href="/politique-confidentialite" 
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link 
                href="/conditions-generales" 
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                CGV
              </Link>
              <Link 
                href="/cookies" 
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-end gap-4 mt-6 md:mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Suivez-nous :</span>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987 6.62 0 11.987-5.367 11.987-11.987C24.003 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324C5.901 8.246 7.052 7.756 8.349 7.756s2.448.49 3.324 1.297c.896.896 1.386 2.047 1.386 3.344s-.49 2.448-1.386 3.344c-.876.807-2.027 1.297-3.324 1.297z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}