/**
 * @module MockData
 * @description Mock data for development and testing using existing types
 * Following Single Responsibility Principle - only handles mock data generation
 */

import {
  ProfileUser,
  ProfileAddress,
  PaymentMethod,
  Order,
  OrderItem,
  Credits,
  Coupon,
  LoyaltyProgram,
  ProfileState,
  ProfilePreferences,
} from "../types";

// ====================================
// Mock Data Generators
// ====================================

export const createMockUser = (): ProfileUser => ({
  id: "user-123",
  email: "juan.perez@example.com",
  nombre: "Juan",
  apellido: "Pérez",
  telefono: "+57 300 123 4567",
  numero_documento: "1012345678",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  loyaltyPoints: 8,
  memberSince: new Date("2023-01-15"),
});

export const createMockAddresses = (): ProfileAddress[] => [
  {
    id: "addr-1",
    userId: "user-123",
    type: "home",
    name: "Casa",
    addressLine1: "Calle 80 # 15-25",
    addressLine2: "Apartamento 501",
    city: "Bogotá",
    state: "Cundinamarca",
    zipCode: "110221",
    country: "Colombia",
    alias: "Casa",
    instructions: "Portería principal, segundo piso",
    isDefault: true,
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2024-10-01"),
  },
  {
    id: "addr-2",
    userId: "user-123",
    type: "work",
    name: "Oficina",
    addressLine1: "Carrera 13 # 93-40",
    addressLine2: "Oficina 302",
    city: "Bogotá",
    state: "Cundinamarca",
    zipCode: "110221",
    country: "Colombia",
    alias: "Oficina",
    isDefault: false,
    createdAt: new Date("2023-08-20"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    id: "addr-3",
    userId: "user-123",
    type: "other",
    name: "Casa de Mamá",
    addressLine1: "Calle 45 # 67-89",
    city: "Medellín",
    state: "Antioquia",
    zipCode: "050001",
    country: "Colombia",
    alias: "Casa de Mamá",
    isDefault: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
];

export const createMockPaymentMethods = (): PaymentMethod[] => [
  {
    id: "pm-1",
    type: "credit_card",
    isDefault: true,
    alias: "Visa Principal",
    last4Digits: "4567",
    expirationDate: "12/26",
    brand: "Visa",
    isActive: true,
  },
  {
    id: "pm-2",
    type: "debit_card",
    isDefault: false,
    alias: "Débito Bancolombia",
    last4Digits: "8901",
    expirationDate: "08/25",
    brand: "Mastercard",
    isActive: true,
  },
  {
    id: "pm-3",
    type: "credit_card",
    isDefault: false,
    alias: "American Express",
    last4Digits: "1234",
    expirationDate: "03/27",
    brand: "American Express",
    isActive: true,
  },
];

export const createMockOrderItems = (): OrderItem[] => [
  {
    id: "item-1",
    productId: "prod-1",
    product: {
      id: "prod-1",
      name: "Camiseta Básica Blanca",
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop",
          alt: "Camiseta Básica Blanca",
        },
      ],
      price: 45000,
      category: "ropa",
      brand: "Básica",
    },
    quantity: 2,
    price: 45000,
    totalPrice: 90000,
    addedAt: new Date().toISOString(),
    unitPrice: 45000,
  },
  {
    id: "item-2",
    productId: "prod-2",
    product: {
      id: "prod-2",
      name: "Jeans Slim Fit",
      images: [
        {
          id: "img-2",
          url: "https://images.unsplash.com/photo-1542272454315-7ad66931c68b?w=80&h=80&fit=crop",
          alt: "Jeans Slim Fit",
        },
      ],
      price: 120000,
      category: "ropa",
      brand: "Denim",
    },
    quantity: 1,
    price: 120000,
    totalPrice: 120000,
    addedAt: new Date().toISOString(),
    unitPrice: 120000,
  },
];

export const createMockActiveOrders = (): Order[] => [
  {
    id: "order-1",
    orderNumber: "ORD-2024-001",
    status: "shipped",
    totalAmount: 235000,
    currency: "COP",
    items: createMockOrderItems(),
    createdAt: new Date("2024-09-28"),
    estimatedDelivery: new Date("2024-10-03"),
    shippingAddress: createMockAddresses()[0],
  },
  {
    id: "order-2",
    orderNumber: "ORD-2024-002",
    status: "processing",
    totalAmount: 150000,
    currency: "COP",
    items: [createMockOrderItems()[0]],
    createdAt: new Date("2024-09-30"),
    estimatedDelivery: new Date("2024-10-05"),
    shippingAddress: createMockAddresses()[0],
  },
];

export const createMockRecentOrders = (): Order[] => [
  {
    id: "order-3",
    orderNumber: "ORD-2024-003",
    status: "delivered",
    totalAmount: 180000,
    currency: "COP",
    items: createMockOrderItems(),
    createdAt: new Date("2024-09-15"),
    shippingAddress: createMockAddresses()[0],
  },
  {
    id: "order-4",
    orderNumber: "ORD-2024-004",
    status: "delivered",
    totalAmount: 95000,
    currency: "COP",
    items: [createMockOrderItems()[1]],
    createdAt: new Date("2024-09-08"),
    shippingAddress: createMockAddresses()[2],
  },
  {
    id: "order-5",
    orderNumber: "ORD-2024-005",
    status: "cancelled",
    totalAmount: 65000,
    currency: "COP",
    items: [createMockOrderItems()[0]],
    createdAt: new Date("2024-08-28"),
    shippingAddress: createMockAddresses()[0],
  },
];

export const createMockCredits = (): Credits => ({
  balance: 0,
  currency: "COP",
  lastUpdate: new Date("2024-09-15"),
});

export const createMockCoupons = (): Coupon[] => [
  {
    id: "coupon-1",
    code: "WELCOME20",
    description: "20% de descuento en tu primera compra",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 100000,
    expirationDate: new Date("2024-12-31"),
    isUsed: false,
  },
  {
    id: "coupon-2",
    code: "ENVIOGRATIS",
    description: "Envío gratis en compras mayores a $150.000",
    discountType: "fixed",
    discountValue: 15000,
    minOrderValue: 150000,
    expirationDate: new Date("2024-11-30"),
    isUsed: false,
  },
];

export const createMockLoyaltyProgram = (): LoyaltyProgram => ({
  level: "Bronze",
  points: 8,
  nextLevelPoints: 8,
  benefits: [
    "Envío gratis en compras mayores a $200.000",
    "Acceso anticipado a ofertas",
    "5% de cashback en compras",
  ],
});

export const createMockUserPreferences = (): ProfilePreferences => ({
  categories: ["electronics", "smartphones", "computing"],
  brands: ["Samsung", "Apple", "Sony"],
  priceRange: { min: 100000, max: 2000000 },
  themes: ["technology", "premium"],
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  shopping: {
    preferredPayment: "credit_card",
    preferredShipping: "express",
    wishlist: ["prod-1", "prod-2"],
  },
});

// ====================================
// Complete Mock State
// ====================================

export const createMockProfileState = (): ProfileState => ({
  user: createMockUser(),
  addresses: createMockAddresses(),
  paymentMethods: createMockPaymentMethods(),
  activeOrders: createMockActiveOrders(),
  recentOrders: createMockRecentOrders(),
  credits: createMockCredits(),
  coupons: createMockCoupons(),
  loyaltyProgram: createMockLoyaltyProgram(),
  preferences: createMockUserPreferences(),
  loading: {
    profile: false,
    orders: false,
    addresses: false,
    paymentMethods: false,
    invoices: false,
  },
  error: null,
  invoices: [],
});

// ====================================
// Mock API Delays
// ====================================

export const mockApiDelay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ====================================
// Mock Error Responses
// ====================================

export const createMockError = (
  message: string = "Something went wrong"
): Error => new Error(message);

// ====================================
// Utility Functions for Testing
// ====================================

export const getOrdersByStatus = (orders: Order[], status: string) =>
  orders.filter((order) => order.status === status);

export const getDefaultAddress = (addresses: ProfileAddress[]) =>
  addresses.find((addr) => addr.isDefault);

export const getDefaultPaymentMethod = (paymentMethods: PaymentMethod[]) =>
  paymentMethods.find((pm) => pm.isDefault);

// Note: Use formatPrice from useCart hook for currency formatting
// Note: Create date formatting utility if needed, or use existing ones
