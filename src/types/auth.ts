import { User } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  acceptNewsletter?: boolean;
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
  };
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    fullName: string;
    isVerified: boolean;
    createdAt: string;
    avatarName: string;
  }
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  avatarName?: string;
  addresses: number; // count
  orders: number; // count
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Types pour les vérifications
export interface TokenVerificationResponse {
  email: string;
}

export interface AuthCheckResponse {
  authenticated: boolean;
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}