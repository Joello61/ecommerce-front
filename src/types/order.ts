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
  totalItems: number;
  createdAt: string;
  updatedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface OrderDetails {
  order: {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    totalPrice: string;
    createdAt: string;
    shippedAt?: string;
    deliveredAt?: string;
    totalItems: number;
    notes?: string;
  };
  items: OrderItem[];
  addresses: {
    shipping: {
      formatted: string;
    };
    billing: {
      formatted: string;
    };
  };
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: string;
  totalPrice: string;
}

export interface CreateOrderRequest {
  shippingAddressId: number;
  billingAddressId: number;
  notes?: string;
  paymentMethod?: 'card' | 'paypal' | 'bank_transfer';
  acceptTerms?: boolean;
  saveAddresses?: boolean;
}

export interface OrderFilterRequest {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at' | 'total_price' | 'order_number';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export interface OrderTracking {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  timeline: Array<{
    status: string;
    label: string;
    date: string;
    completed: boolean;
  }>;
  canBeCancelled: boolean;
  isCompleted: boolean;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: string;
  averageOrderValue: string;
}

export interface CancelOrderRequest {
  reason: 'customer_request' | 'payment_failed' | 'stock_unavailable' | 'shipping_issue' | 'other';
  comment?: string;
  refundPayment?: boolean;
  restoreStock?: boolean;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  comment?: string;
  notifyCustomer?: boolean;
}