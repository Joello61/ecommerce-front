export * from './api';
export * from './auth';
export * from './cart';
export * from './order';
export * from './product';
export * from './user';

export interface UIState {
  isSidebarOpen: boolean
  isCartDrawerOpen: boolean
  isMobileMenuOpen: boolean
  isSearchModalOpen: boolean
  isProfileMenuOpen: boolean
  theme: 'light' | 'dark' | 'system'
  language: 'fr' | 'en'
  toasts: ToastProps[]
  isPageLoading: boolean
  showPageLoader: boolean
  modals: Record<string, boolean>
}

// Utility types
export type ID = string | number;

export interface Timestamps {
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
}

export type BaseFilters = PaginationParams & SortParams & SearchParams;

// Form types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface FormFieldState {
  value: string | number | boolean;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface AsyncListState<T> extends LoadingState {
  items: T[];
  total: number;
  hasMore: boolean;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaProps extends Omit<InputProps, 'type'> {
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface SelectProps extends BaseComponentProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
}

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

// Store types (for Zustand)
export interface StoreState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
}

export interface StoreActions<T> {
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export interface AsyncStoreState<T> extends StoreState<T> {
  lastFetched?: number;
  isRefreshing: boolean;
}

export interface AsyncStoreActions<T> extends StoreActions<T> {
  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
  setRefreshing: (refreshing: boolean) => void;
}

// API specific types
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadState {
  file: File | null;
  progress: UploadProgress;
  isUploading: boolean;
  error: string | null;
  url?: string;
}

// Notification types
export interface NotificationState {
  notifications: ToastProps[];
  add: (notification: Omit<ToastProps, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

// Theme types
export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  roles?: string[];
  isActive?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// E-commerce specific types
export interface Price {
  amount: number;
  currency: string;
  formatted: string;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  code?: string;
  description?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  price: Price;
  estimatedDays: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'wallet';
  name: string;
  icon?: string;
  fees?: Price;
  isDefault?: boolean;
}