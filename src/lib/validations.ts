import { z } from 'zod'

// Schémas de validation pour l'authentification
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z.string(),
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

// Schémas pour le profil utilisateur
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  avatarFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      'La taille du fichier ne doit pas dépasser 2MB'
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      'Format de fichier non supporté. Utilisez JPEG, PNG ou GIF'
    ),
})

// Schémas pour les adresses
export const addressSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  street: z
    .string()
    .min(1, 'L\'adresse est requise')
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères'),
  city: z
    .string()
    .min(1, 'La ville est requise')
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),
  zipCode: z
    .string()
    .min(1, 'Le code postal est requis')
    .regex(/^[0-9]{5}$/, 'Le code postal doit contenir 5 chiffres'),
  country: z
    .string()
    .min(1, 'Le pays est requis')
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(100, 'Le pays ne peut pas dépasser 100 caractères'),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone),
      'Format de téléphone invalide'
    ),
  isDefault: z.boolean().optional(),
})

// Schémas pour le panier
export const addToCartSchema = z.object({
  productId: z.number().positive('ID de produit invalide'),
  quantity: z
    .number()
    .positive('La quantité doit être positive')
    .max(99, 'La quantité ne peut pas dépasser 99'),
})

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .positive('La quantité doit être positive')
    .max(99, 'La quantité ne peut pas dépasser 99'),
})

// Schémas pour les produits (admin)
export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du produit est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  description: z
    .string()
    .optional(),
  price: z
    .string()
    .min(1, 'Le prix est requis')
    .refine((price) => !isNaN(parseFloat(price)) && parseFloat(price) > 0, 'Prix invalide'),
  stock: z
    .number()
    .min(0, 'Le stock ne peut pas être négatif'),
  categoryId: z.number().positive('Catégorie requise'),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  imageFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'La taille du fichier ne doit pas dépasser 5MB'
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Format de fichier non supporté. Utilisez JPEG, PNG ou WebP'
    ),
})

// Schémas pour les catégories (admin)
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom de la catégorie est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Schémas pour les commandes
export const createOrderSchema = z.object({
  shippingAddressId: z.number().positive('Adresse de livraison requise'),
  billingAddressId: z.number().positive('Adresse de facturation requise'),
  notes: z.string().optional(),
})

// Schémas pour la recherche et les filtres
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.number().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

// Schémas pour les avis (si activés)
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'La note doit être entre 1 et 5')
    .max(5, 'La note doit être entre 1 et 5'),
  comment: z
    .string()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  productId: z.number().positive('ID de produit invalide'),
})

// Utilitaires de validation
export const validateEmail = (email: string): boolean => {
  try {
    z.string().email().parse(email)
    return true
  } catch {
    return false
  }
}

export const validatePassword = (password: string): boolean => {
  try {
    z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).parse(password)
    return true
  } catch {
    return false
  }
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone)
}

export const validatePostalCode = (postalCode: string): boolean => {
  return /^[0-9]{5}$/.test(postalCode)
}

// Types inférés des schémas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type AddToCartFormData = z.infer<typeof addToCartSchema>
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type ProductFiltersFormData = z.infer<typeof productFiltersSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>