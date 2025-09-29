export interface CartSummary {
  cart: {
    id: number;
    totalItems: number;
    totalQuantity: number;
    totalPrice: string;
    isEmpty: boolean;
  };
  items: CartItemDetails[];
}

export interface CartItemDetails {
  id: number;
  quantity: number;
  totalPrice: string;
  product: {
    id: number;
    name: string;
    price: string;
    stock: number;
  };
}

export interface CartItem {
  id: number;
  quantity: number;
  totalPrice: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface MergeGuestCartRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface CartValidationResponse {
  isValid: boolean;
  errors?: string[];
  cartSummary: CartSummary['cart'];
}

export interface CartCountResponse {
  totalItems: number;
  totalQuantity: number;
  isEmpty: boolean;
}

export interface CartState {
  cart: CartSummary | null;
  isLoading: boolean;
  error: string | null;
}

// Types pour l'ajout rapide
export interface QuickAddResponse {
  cartCount: number;
}