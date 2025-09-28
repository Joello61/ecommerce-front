import { Product } from "./product";
import { User } from "./user";

export interface Cart {
  id: number;
  createdAt: string;
  updatedAt?: string;
  user: User;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  createdAt: string;
  updatedAt?: string;
  product: Product;
}

export interface AddToCartRequest {
  product: string; // IRI
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  totalPrice: string;
  isEmpty: boolean;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}