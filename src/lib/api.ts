// src/lib/api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG } from './constants'
import { ApiResponse, ApiError } from '@/types'

// Types pour la configuration
interface ApiClientConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
}

// Configuration par défaut
const DEFAULT_CONFIG: ApiClientConfig = {
  timeout: 10000, // 10 secondes
  retries: 3,
  retryDelay: 1000, // 1 seconde
}

/**
 * Client HTTP configuré pour l'API backend Symfony
 */
class ApiClient {
  private axiosInstance: AxiosInstance
  private config: ApiClientConfig

  constructor(config: ApiClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    // Création de l'instance Axios
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: this.config.timeout,
      withCredentials: true, // Important pour les cookies HttpOnly
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Configuration des intercepteurs Axios
   */
  private setupInterceptors(): void {
    // Intercepteur de requête
    this.axiosInstance.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    )

    // Intercepteur de réponse
    this.axiosInstance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    )
  }

  /**
   * Gestion des requêtes sortantes
   */
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // Log des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      if (config.data) {
        console.log('📤 Request Data:', config.data)
      }
    }

    return config
  }

  /**
   * Gestion des erreurs de requête
   */
  private handleRequestError(error: AxiosError): Promise<never> {
    console.error('❌ Request Error:', error.message)
    return Promise.reject(error)
  }

  /**
   * Gestion des réponses
   */
  private handleResponse(response: AxiosResponse): AxiosResponse {
    // Log des réponses en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
      console.log('📥 Response Data:', response.data)
    }

    return response
  }

  /**
   * Gestion des erreurs de réponse avec retry automatique
   */
  private async handleResponseError(error: AxiosError): Promise<never> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number }

    // Log de l'erreur
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`)
    
    if (error.response?.status === 401) {
      // Erreur d'authentification - rediriger vers login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(this.createApiError(error))
    }

    // Retry automatique pour les erreurs temporaires (5xx)
    if (
      error.response?.status && 
      error.response.status >= 500 && 
      !originalRequest._retry &&
      this.config.retries! > 0
    ) {
      originalRequest._retry = true
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1

      if (originalRequest._retryCount <= this.config.retries!) {
        console.log(`🔄 Retrying request (${originalRequest._retryCount}/${this.config.retries})`)
        
        // Attendre avant de réessayer
        await this.delay(this.config.retryDelay! * originalRequest._retryCount)
        
        return this.axiosInstance(originalRequest)
      }
    }

    return Promise.reject(this.createApiError(error))
  }

  /**
   * Création d'une erreur API standardisée
   */
  private createApiError(error: AxiosError): ApiError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = error.response?.data as any

    return {
      success: false,
      message: response?.message || error.message || 'Une erreur est survenue',
      errors: response?.errors || []
    }
  }

  /**
   * Utilitaire pour les délais
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Méthodes HTTP publiques
   */
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(url: string, config?: object): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, config)
    return response.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T = any>(url: string, data?: any, config?: object): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config)
    return response.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T = any>(url: string, data?: any, config?: object): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config)
    return response.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async patch<T = any>(url: string, data?: any, config?: object): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config)
    return response.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete<T = any>(url: string, config?: object): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config)
    return response.data
  }

  /**
   * Upload de fichiers avec support du progress
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFile<T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  }

  /**
   * Téléchargement de fichiers
   */
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    })

    // Création du lien de téléchargement
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(downloadUrl)
  }

  /**
   * Vérification de la santé de l'API
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.axiosInstance.get('/health', { timeout: 5000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Accès direct à l'instance Axios si nécessaire
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// Instance globale
export const apiClient = new ApiClient()

// Export des méthodes pour utilisation directe
export const { get, post, put, patch, delete: del, uploadFile, downloadFile, healthCheck } = apiClient

// Types helper pour les erreurs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error === 'object' && error.success === false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Une erreur inconnue est survenue'
}

// Export par défaut
export default apiClient