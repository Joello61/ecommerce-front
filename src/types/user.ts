import { UserProfile } from "./auth";

export interface User {
  id: number;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  updatedAt?: string;
  isVerified: boolean;
  avatarName?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email?: string;
  avatarFile?: File;
  acceptNewsletter?: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
  isVerified?: boolean;
  avatarFile?: File;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  isVerified?: boolean;
  avatarFile?: File;
}

export interface UserStats {
  totalOrders: number;
  completedOrders: number;
  totalSpent: string;
  totalAddresses: number;
  memberSince: string;
  isVerified: boolean;
}

// Adresses (déplacées depuis order.ts)
export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  formattedAddress: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AddressRequest {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface AddressListResponse {
  addresses: Address[];
  total: number;
}

export interface NotificationPreferences {
  emailNewsletter: boolean
  emailOrderUpdates: boolean
  emailPromotions: boolean
  smsOrderUpdates: boolean
}

export interface PrivacyPreferences {
  allowDataCollection: boolean
  allowPersonalization: boolean
  allowThirdPartySharing: boolean
}

export interface UserState {
  profile: UserProfile | null
  addresses: Address[]
  stats: UserStats | null
  notificationPreferences: NotificationPreferences | null
  privacyPreferences: PrivacyPreferences | null
  isLoading: boolean
  isProfileLoading: boolean
  isAddressesLoading: boolean
  isStatsLoading: boolean
  isPreferencesLoading: boolean
  isUpdating: boolean
  error: string | null
  profileError: string | null
  addressError: string | null
}
