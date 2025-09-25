import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ===========================================
// UTILITAIRES TAILWIND CSS
// ===========================================

/**
 * Combine et merge les classes Tailwind CSS
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour éviter les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================================
// FORMATAGE PRIX & DEVISES
// ===========================================

/**
 * Formate un prix avec devise et localisation
 */
export function formatPrice(
  price: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price)
}

/**
 * Formate un prix avec réduction
 */
export function formatPriceWithDiscount(
  originalPrice: number,
  salePrice: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): {
  original: string
  sale: string
  discount: string
  discountPercent: number
} {
  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  
  return {
    original: formatPrice(originalPrice, currency, locale),
    sale: formatPrice(salePrice, currency, locale),
    discount: formatPrice(originalPrice - salePrice, currency, locale),
    discountPercent,
  }
}

/**
 * Convertit les centimes en euros (pour Stripe)
 */
export function centsToEuros(cents: number): number {
  return cents / 100
}

/**
 * Convertit les euros en centimes (pour Stripe)
 */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100)
}

// ===========================================
// FORMATAGE DATES & TEMPS
// ===========================================

/**
 * Formate une date de manière lisible
 */
export function formatDate(
  date: string | Date,
  locale: string = 'fr-FR',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(dateObject)
}

/**
 * Formate une date relative (il y a 2 jours, etc.)
 */
export function formatRelativeDate(date: string | Date, locale: string = 'fr'): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

/**
 * Formate une durée en format lisible
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h${remainingMinutes}min`
}

// ===========================================
// VALIDATION & FORMATAGE DONNÉES
// ===========================================

/**
 * Valide une adresse email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone)
}

/**
 * Formate un numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('33')) {
    return `+33 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }
  
  return phone
}

/**
 * Valide un code postal français
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode)
}

/**
 * Nettoie et formate une chaîne pour URL (slug)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9 -]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace espaces par tirets
    .replace(/-+/g, '-') // Supprime tirets multiples
    .replace(/^-+|-+$/g, '') // Supprime tirets en début/fin
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalise la première lettre
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// ===========================================
// UTILITAIRES TABLEAU & OBJETS
// ===========================================

/**
 * Supprime les doublons d'un tableau
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Groupe les éléments d'un tableau par clé
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = key(item)
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

/**
 * Trie un tableau par propriété
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Supprime les propriétés undefined d'un objet
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function omitUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>
}

// ===========================================
// UTILITAIRES NOMBRES & CALCULS
// ===========================================

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(number: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(number)
}

/**
 * Arrondit un nombre à n décimales
 */
export function round(number: number, decimals: number = 2): number {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Clamp un nombre entre min et max
 */
export function clamp(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max)
}

/**
 * Génère un nombre aléatoire entre min et max
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ===========================================
// UTILITAIRES COULEURS
// ===========================================

/**
 * Génère une couleur hexadécimale aléatoire
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * Convertit hex en RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// ===========================================
// UTILITAIRES STOCKAGE LOCAL
// ===========================================

/**
 * Stocke une valeur dans localStorage avec gestion d'erreur
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Impossible de sauvegarder dans localStorage:', error)
  }
}

/**
 * Récupère une valeur du localStorage avec fallback
 */
export function getLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (error) {
    console.warn('Impossible de lire depuis localStorage:', error)
    return fallback
  }
}

/**
 * Supprime une clé du localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Impossible de supprimer de localStorage:', error)
  }
}

// ===========================================
// UTILITAIRES PERFORMANCE
// ===========================================

/**
 * Debounce une fonction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle une fonction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// ===========================================
// UTILITAIRES URL & NAVIGATION
// ===========================================

/**
 * Extrait les paramètres d'URL
 */
export function getUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const urlObj = new URL(url)
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

/**
 * Construit une URL avec paramètres
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })
  
  return url.toString()
}

// ===========================================
// UTILITAIRES IMAGES
// ===========================================

/**
 * Génère une URL d'image placeholder
 */
export function getPlaceholderImage(
  width: number = 400,
  height: number = 300,
  text?: string
): string {
  const displayText = text ? encodeURIComponent(text) : `${width}x${height}`
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${displayText}`
}

/**
 * Vérifie si une URL est une image
 */
export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url)
}

// ===========================================
// UTILITAIRES ERREURS
// ===========================================

/**
 * Extrait un message d'erreur lisible
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return 'Une erreur inconnue est survenue'
}