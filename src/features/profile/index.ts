/**
 * @module Profile Feature
 * @description Main exports for the profile feature
 */

// Main component - único export público necesario
export { default as ProfilePage } from './components/ProfilePage';

// Hook público
export { useProfile } from './hooks/useProfile';

// Types públicos para uso externo
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
