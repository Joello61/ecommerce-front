'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Page introuvable
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Home className="h-5 w-5" />
                Retour à l&apos;accueil
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline inline-flex items-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Voir les produits
              </motion.button>
            </Link>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Vous cherchez quelque chose de précis ?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/categories" className="text-sm text-primary hover:underline">
                Catégories
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Contact
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/faq" className="text-sm text-primary hover:underline">
                FAQ
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}