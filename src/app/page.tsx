import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// ===========================================
// HOMEPAGE COMPONENT
// ===========================================

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Indicators */}
      <TrustIndicators />
      
      {/* Featured Categories */}
      <FeaturedCategories />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Promotions Banner */}
      <PromotionsBanner />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Newsletter CTA */}
      <NewsletterCTA />
    </div>
  )
}

// ===========================================
// HERO SECTION
// ===========================================

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container-custom py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge variant="primary" size="lg" className="w-fit">
              Nouveau • Collection Automne 2025
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Découvrez notre
              <span className="text-primary-600 dark:text-primary-400 block">
                sélection premium
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Des produits de qualité exceptionnelle sélectionnés avec soin pour vous offrir 
              la meilleure expérience d&apos;achat. Livraison gratuite dès 50€.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Découvrir la collection
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/promotions">
                  Voir les offres
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  10k+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Clients satisfaits
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Produits uniques
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  4.8★
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Note moyenne
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Collection Premium"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Livraison express
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Commandez avant 14h
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    Gratuite
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ===========================================
// TRUST INDICATORS
// ===========================================

function TrustIndicators() {
  const indicators = [
    {
      icon: TruckIcon,
      title: 'Livraison gratuite',
      description: 'Dès 50€ d\'achat',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Paiement sécurisé',
      description: 'SSL & 3D Secure',
    },
    {
      icon: ArrowPathIcon,
      title: 'Retours gratuits',
      description: '30 jours pour changer d\'avis',
    },
    {
      icon: StarIcon,
      title: 'Service client',
      description: '7j/7 pour vous accompagner',
    },
  ]

  return (
    <section className="py-12 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {indicator.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {indicator.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ===========================================
// FEATURED CATEGORIES
// ===========================================

function FeaturedCategories() {
  const categories = [
    {
      name: 'Électronique',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      href: '/categories/electronique',
      count: '120+ produits',
    },
    {
      name: 'Mode',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      href: '/categories/mode',
      count: '250+ produits',
    },
    {
      name: 'Maison & Jardin',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      href: '/categories/maison-jardin',
      count: '180+ produits',
    },
    {
      name: 'Sport & Loisirs',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      href: '/categories/sport-loisirs',
      count: '90+ produits',
    },
  ]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Explorez nos catégories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez notre large sélection de produits organisés par catégorie 
            pour vous aider à trouver exactement ce que vous cherchez.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.href}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="text-white">
                      <h3 className="font-semibold text-lg mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/90">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===========================================
// FEATURED PRODUCTS
// ===========================================

function FeaturedProducts() {
  const products = [
    {
      id: '1',
      name: 'Casque Sans-fil Premium',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 124,
      badge: 'Bestseller',
      href: '/products/casque-sans-fil-premium',
    },
    {
      id: '2',
      name: 'Montre Connectée Sport',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 89,
      badge: 'Nouveau',
      href: '/products/montre-connectee-sport',
    },
    {
      id: '3',
      name: 'Sac à Dos Cuir Vintage',
      price: 89.99,
      originalPrice: 120.00,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 67,
      badge: 'Promo',
      href: '/products/sac-dos-cuir-vintage',
    },
    {
      id: '4',
      name: 'Lampe Design LED',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 45,
      href: '/products/lampe-design-led',
    },
  ]

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Produits populaires
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Les coups de cœur de nos clients
            </p>
          </div>
          
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/products">
              Voir tout
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/products">
              Voir tous les produits
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ===========================================
// PRODUCT CARD COMPONENT
// ===========================================

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  href: string
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={product.href} className="group">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {product.badge && (
            <Badge 
              variant={
                product.badge === 'Promo' ? 'error' : 
                product.badge === 'Nouveau' ? 'info' : 
                'primary'
              }
              className="absolute top-2 left-2"
            >
              {product.badge}
            </Badge>
          )}
          
          {discount > 0 && (
            <Badge variant="error" className="absolute top-2 right-2">
              -{discount}%
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {product.price}€
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice}€
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ===========================================
// PROMOTIONS BANNER
// ===========================================

function PromotionsBanner() {
  return (
    <section className="bg-primary-600 dark:bg-primary-700 py-16">
      <div className="container-custom">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Offre spéciale limitée
          </h2>
          <p className="text-primary-100 mb-6 text-lg">
            Jusqu&apos;à -50% sur une sélection de produits. Offre valable jusqu&apos;au 31 décembre.
          </p>
          <Button size="lg" variant="secondary">
            Profiter des offres
          </Button>
        </div>
      </div>
    </section>
  )
}

// ===========================================
// TESTIMONIALS
// ===========================================

function Testimonials() {
  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Cliente fidèle',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'Service client exceptionnel et produits de qualité. Je recommande vivement !',
    },
    {
      name: 'Thomas Martin',
      role: 'Acheteur vérifié',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'Livraison ultra rapide et emballage soigné. Exactement ce que j\'attendais.',
    },
    {
      name: 'Sophie Laurent',
      role: 'Cliente depuis 2 ans',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'Une boutique de confiance avec un large choix de produits. Parfait !',
    },
  ]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Plus de 10 000 clients nous font confiance pour leurs achats en ligne
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="rounded-full mx-auto mb-4"
                  />
                  <div className="flex justify-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-gray-600 dark:text-gray-400 mb-4">
                  &quot;{testimonial.comment}&quot;
                </blockquote>
                
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===========================================
// NEWSLETTER CTA
// ===========================================

function NewsletterCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Restez informé de nos nouveautés
        </h2>
        <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
          Soyez le premier à découvrir nos nouveaux produits, nos offres exclusives 
          et nos conseils d&apos;experts directement dans votre boîte mail.
        </p>
        
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-100"
            />
            <Button size="lg" variant="secondary" className="whitespace-nowrap">
              S&apos;abonner
            </Button>
          </div>
          
          <p className="text-xs text-primary-100 mt-3">
            Pas de spam, vous pouvez vous désabonner à tout moment.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-8 mt-8 text-primary-100">
          <div className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            <span className="text-sm">Livraison gratuite</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="text-sm">Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5" />
            <span className="text-sm">Retours gratuits</span>
          </div>
        </div>
      </div>
    </section>
  )
}