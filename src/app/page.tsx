'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Truck, Shield, TrendingUp, Sparkles, GridIcon } from 'lucide-react'
import { useProductStore } from '@/store/productStore'
import { ProductCard } from '@/components/products/ProductCard'
import Image from 'next/image'

export default function HomePage() {
  const { 
    featuredProducts, 
    bestSellers, 
    fetchFeaturedProducts, 
    fetchBestSellers,
    isFeaturedLoading,
    isBestSellersLoading 
  } = useProductStore()

  useEffect(() => {
    fetchFeaturedProducts(8)
    fetchBestSellers(6)
  }, [fetchFeaturedProducts, fetchBestSellers])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        {/* Fond dégradé + motif */}
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        <div className="container relative py-10 lg:py-10 grid lg:grid-cols-2 items-center gap-12">
          {/* Texte */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Nouvelle collection disponible
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Découvrez <span className="text-primary">l&apos;excellence</span> à portée de clic
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Une sélection soigneusement choisie de produits de qualité pour sublimer votre quotidien.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="btn-primary font-bold">
                Explorer la boutique <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/categories" className="btn-outline flex items-center gap-2 font-bold">
                <GridIcon className="w-4 h-4" /> Voir les catégories
              </Link>
            </div>

            <p className="mt-6 text-sm font-semibold text-gray-500">+500 clients satisfaits • Livraison rapide offerte</p>
          </div>

          {/* Image illustrée */}
          <div className="hidden lg:block relative rounded-2xl overflow-hidden">
            <Image
              src="/images/hero/hero-product.jpg"
              alt="Produits phares"
              width={1500}
              height={1001}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
          </div>

        </div>
      </section>


      {/* Features */}
      <section className="py-12 sm:py-16 border-b border-gray-200">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Truck, title: 'Livraison rapide', desc: 'Expédition sous 24h' },
              { icon: Shield, title: 'Paiement sécurisé', desc: '100% sécurisé' },
              { icon: TrendingUp, title: 'Meilleurs prix', desc: 'Prix compétitifs' },
            ].map((feature, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Produits en vedette
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection exclusive de produits coup de cœur
            </p>
          </div>

          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card h-full animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-center">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="h-full"
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:mt-12">
            <Link href="/products" className="btn-primary">
              Voir tous les produits
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meilleures ventes */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Meilleures ventes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les produits préférés de nos clients
            </p>
          </div>

          {isBestSellersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-full animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {bestSellers.slice(0, 6).map((product, index) => (
                <div key={product.id} className="relative h-full">
                  <div className="absolute -top-3 -left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-sm shadow-lg">
                    #{index + 1}
                  </div>
                  <ProductCard
                    product={product}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="card p-8 sm:p-12 lg:p-16 bg-secondary text-center">
            <h2 className="text-white/90 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Prêt à commencer vos achats ?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Inscrivez-vous maintenant et profitez de 10% de réduction sur votre première commande
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-secondary font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Créer un compte
              </Link>
              <Link 
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Parcourir les produits
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}