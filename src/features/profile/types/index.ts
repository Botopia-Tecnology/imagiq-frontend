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
// Matches Usuario interface from backend auth-ms
export interface ProfileUser extends BaseUser {
  avatar?: string;
  loyaltyPoints?: number;
  memberSince?: Date;
  // Computed property for full name
  fullName?: string;
  // Backend specific fields
  email_verificado?: boolean;
  activo?: boolean;
  bloqueado?: boolean;
  fecha_creacion?: Date;
  ultimo_login?: Date | null;
  tipo_documento?: string;
  codigo_pais?: string;
  fecha_nacimiento?: Date;
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

// Simplified product for order items (to avoid complex Product type requirements)
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface SimplifiedProduct {
  id: string;
  name: string;
  images: ProductImage[];
  price?: number;
  category?: string;
  brand?: string;
}

// Extend existing CartItem instead of creating OrderItem
export interface OrderItem extends Omit<CartItem, 'product'> {
  unitPrice: number;
  totalPrice: number;
  product: SimplifiedProduct; // Simplified product for orders
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
// Invoice/Billing Types
// ====================================

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  items: OrderItem[];
  billingAddress: ProfileAddress;
  paymentMethod?: PaymentMethod;
  downloadUrl?: string;
  notes?: string;
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
  invoices: Invoice[];
  credits: Credits;
  coupons: Coupon[];
  loyaltyProgram: LoyaltyProgram | null;
  preferences: ProfilePreferences;
  loading: {
    profile: boolean;
    orders: boolean;
    addresses: boolean;
    paymentMethods: boolean;
    invoices: boolean;
  };
  error: string | null;
}