/**
 * @module Profile Feature
 * @description Main exports for the profile feature
 * Following Open/Closed Principle - easy to extend without modification
 */

// Main components
export { default as ProfilePage } from './components/ProfilePage';

// Section components
export { default as ProfileHeader } from './components/sections/ProfileHeader';
export { default as QuickActions } from './components/sections/QuickActions';
export { default as OrderCard } from './components/sections/OrderCard';
export { default as MenuItem } from './components/sections/MenuItem';

// Hooks
export { useProfile } from './hooks/useProfile';

// Types
export type {
  ProfileUser,
  ProfileAddress,
  PaymentMethod,
  Order,
  OrderItem,
  OrderStatus,
  Credits,
  Coupon,
  LoyaltyProgram,
  ProfileState
} from './types';

// Component prop types
export type {
  ProfileHeaderProps,
  QuickActionsProps,
  OrderCardProps,
  MenuItemProps
} from './types/components';

// Mock data utilities (for development)
export {
  createMockProfileState,
  createMockUser,
  createMockAddresses,
  createMockActiveOrders,
  createMockRecentOrders
} from './utils/mockData';