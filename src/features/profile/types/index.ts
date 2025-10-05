/**
 * @module ProfileTypes
 * @description Extended type definitions for the user profile feature
 * Extending existing types from the codebase to maximize reusability
 */

// Import existing types to extend them instead of recreating
import { User as BaseUser, UserAddress } from '@/types/user';
import type { CartItem } from '@/types/product';

// ====================================
// Extended Domain Types (reusing existing)
// ====================================

// Extend existing User type instead of creating new one
export interface ProfileUser extends BaseUser {
  avatar?: string;
  loyaltyPoints?: number;
  memberSince?: Date;
  // Computed property for full name
  fullName?: string;
}

// Extend existing UserAddress type
export interface ProfileAddress extends Omit<UserAddress, 'createdAt' | 'updatedAt'> {
  alias: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reuse existing types where possible
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account';
  isDefault: boolean;
  alias: string;
  last4Digits: string;
  expirationDate?: string;
  brand?: string;
  isActive: boolean;
}

// ====================================
// Order Types (extending existing Product/Cart types)
// ====================================

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Extend existing CartItem instead of creating OrderItem
export interface OrderItem extends Omit<CartItem, 'product'> {
  unitPrice: number;
  totalPrice: number;
  product: Record<string, unknown>; // Simplified product for orders
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  createdAt: Date;
  estimatedDelivery?: Date;
  shippingAddress: ProfileAddress;
}

// ====================================
// Benefits Types (simplified)
// ====================================

export interface Credits {
  balance: number;
  currency: string;
  lastUpdate: Date;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  expirationDate: Date;
  isUsed: boolean;
}

export interface LoyaltyProgram {
  level: string;
  points: number;
  nextLevelPoints: number;
  benefits: string[];
}

// ====================================
// Profile State Types (using simplified preferences)
// ====================================

// Define a simplified preferences interface that matches the existing UserPreferencesContext
export interface ProfilePreferences {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  themes: string[];
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  shopping: {
    preferredPayment: string;
    preferredShipping: string;
    wishlist: string[];
  };
}

export interface ProfileState {
  user: ProfileUser | null;
  addresses: ProfileAddress[];
  paymentMethods: PaymentMethod[];
  activeOrders: Order[];
  recentOrders: Order[];
  credits: Credits;
  coupons: Coupon[];
  loyaltyProgram: LoyaltyProgram | null;
  preferences: ProfilePreferences;
  loading: {
    profile: boolean;
    orders: boolean;
    addresses: boolean;
    paymentMethods: boolean;
  };
  error: string | null;
}