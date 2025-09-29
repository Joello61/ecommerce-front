'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, Shield, Truck } from 'lucide-react'
import { useProductStore } from '@/store/productStore'
import { getImageUrl, formatPrice } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const { 
    featuredProducts, 
    bestSellers, 
    fetchFeaturedProducts, 
    fetchBestSellers,
    isFeaturedLoading,
    isBestSellersLoading 
  } = useProductStore()

  // Parallax effects
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, 100])
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scaleHero = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  // Smooth spring animations
  const yHeroSpring = useSpring(yHero, { stiffness: 300, damping: 30 })

  useEffect(() => {
    fetchFeaturedProducts(8)
    fetchBestSellers(6)
  }, [fetchFeaturedProducts, fetchBestSellers])

  return (
    <div className="min-h-screen">
      {/* Hero Section avec Parallax */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div
          style={{ y: yHeroSpring, opacity: opacityHero, scale: scaleHero }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/50 to-background" />
        </motion.div>

        <div className="container relative h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Nouvelle collection disponible</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Découvrez l&apos;excellence
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                à portée de clic
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Une sélection soigneusement choisie de produits de qualité pour sublimer votre quotidien
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Explorer la boutique
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <Link href="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline"
                >
                  Voir les catégories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-muted-foreground rounded-full mx-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Truck, title: 'Livraison rapide', desc: 'Expédition sous 24h' },
              { icon: Shield, title: 'Paiement sécurisé', desc: '100% sécurisé' },
              { icon: TrendingUp, title: 'Meilleurs prix', desc: 'Prix compétitifs' },
            ].map((feature, i) => (
              <motion.div key={i} variants={item} className="card-feature text-center group">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Produits en vedette
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection exclusive de produits coup de cœur
            </p>
          </motion.div>

          {isFeaturedLoading ? (
            <div className="product-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="product-grid"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="card-product group"
                    >
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                        {product.imageName ? (
                          <Image
                            src={getImageUrl(product.imageName)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <span className="text-4xl font-bold text-muted-foreground">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                            Vedette
                          </div>
                        )}
                      </div>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          {product.category.name}
                        </p>
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="price-large">{formatPrice(product.price)}</p>
                          {product.isInStock ? (
                            <span className="text-xs text-success">En stock</span>
                          ) : (
                            <span className="text-xs text-danger">Rupture</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2"
              >
                Voir tous les produits
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meilleures ventes */}
      <section className="section bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Meilleures ventes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les produits préférés de nos clients
            </p>
          </motion.div>

          {isBestSellersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {bestSellers.slice(0, 6).map((product, index) => (
                <motion.div key={product.id} variants={item}>
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="card-product group relative"
                    >
                      <div className="absolute -top-3 -left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold shadow-lg">
                        #{index + 1}
                      </div>
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                        {product.imageName ? (
                          <Image
                            src={getImageUrl(product.imageName)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <span className="text-4xl font-bold text-muted-foreground">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          {product.category.name}
                        </p>
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="price-large">{formatPrice(product.price)}</p>
                          <span className="text-xs text-muted-foreground">
                            {product.totalSold} vendus
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-12 text-white"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Prêt à commencer vos achats ?
              </h2>
              <p className="text-lg mb-8 text-white/90">
                Inscrivez-vous maintenant et profitez de 10% de réduction sur votre première commande
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Créer un compte
                  </motion.button>
                </Link>
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Parcourir les produits
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}