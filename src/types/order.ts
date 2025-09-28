import { Product } from "./product";
import { User } from "./user";

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: string;
  createdAt: string;
  updatedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
  user: User;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  productName: string;
  createdAt: string;
  product: Product;
}

export interface CreateOrderRequest {
  shippingAddress: string; // IRI
  billingAddress: string; // IRI
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  user?: number;
}

export interface OrderSummary {
  totalItems: number;
  totalQuantity: number;
  totalPrice: string;
  isCompleted: boolean;
  canBeCancelled: boolean;
}

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
  createdAt: string;
  updatedAt?: string;
  user?: User;
}

export interface CreateAddressRequest {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}