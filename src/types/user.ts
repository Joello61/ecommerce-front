import { Cart } from "./cart";
import { Address, Order } from "./order";

export interface User {
  id: number;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt?: string;
  isVerified: boolean;
  avatarName?: string;
  addresses?: Address[];
  cart?: Cart;
  orders?: Order[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  avatarFile?: File;
}

export interface UserProfile extends Omit<User, 'cart' | 'orders'> {
  fullName: string;
  avatarUrl?: string;
}

