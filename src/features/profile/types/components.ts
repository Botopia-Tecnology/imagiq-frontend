/**
 * @module ComponentTypes
 * @description Component-specific type definitions
 * Following Interface Segregation Principle - specific interfaces for each component
 */

import { LucideIcon } from 'lucide-react';
import { User, Order, Address, PaymentMethod, Credits, Coupon } from './index';

// ====================================
// Base Component Types
// ====================================

export interface BaseComponentProps {
  className?: string;
  testId?: string;
}

export interface InteractiveProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ====================================
// UI Component Props
// ====================================

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export interface BadgeProps extends BaseComponentProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps, InteractiveProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export interface IconButtonProps extends BaseComponentProps, InteractiveProps {
  icon: LucideIcon;
  label: string;
  showLabel?: boolean;
  variant?: 'default' | 'primary';
}

export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
}

// ====================================
// Section Component Props
// ====================================

export interface SectionTitleProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ProfileHeaderProps extends BaseComponentProps {
  user: User;
  onEditProfile: () => void;
  loading?: boolean;
}

export interface QuickActionsProps extends BaseComponentProps {
  onOrdersClick: () => void;
  onHelpClick: () => void;
  onPaymentMethodsClick: () => void;
}

export interface OrderCardProps extends BaseComponentProps {
  order: Order;
  variant?: 'active' | 'recent';
  onViewDetails: (orderId: string) => void;
}

export interface OrdersSectionProps extends BaseComponentProps {
  title: string;
  orders: Order[];
  loading?: boolean;
  emptyMessage: string;
  onViewAll?: () => void;
  onOrderClick: (orderId: string) => void;
}

export interface MenuItemProps extends BaseComponentProps, InteractiveProps {
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  hasChevron?: boolean;
}

export interface AccountSectionProps extends BaseComponentProps {
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  onAddressesClick: () => void;
  onPaymentMethodsClick: () => void;
  onBillingClick: () => void;
}

export interface BenefitsSectionProps extends BaseComponentProps {
  credits: Credits;
  coupons: Coupon[];
  loyaltyPoints?: number;
  onCreditsClick: () => void;
  onCouponsClick: () => void;
  onLoyaltyClick: () => void;
}

export interface SettingsSectionProps extends BaseComponentProps {
  currentLanguage: string;
  notificationsEnabled: boolean;
  onLanguageClick: () => void;
  onNotificationsClick: () => void;
  onHelpClick: () => void;
}

export interface MoreInfoSectionProps extends BaseComponentProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onDataProcessingClick: () => void;
  onRelevantInfoClick: () => void;
}

export interface FooterActionsProps extends BaseComponentProps {
  onLogout: () => void;
  onLogoutAllSessions: () => void;
  loading?: boolean;
}

// ====================================
// Layout Component Props
// ====================================

export interface ProfileLayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  loading?: boolean;
}

// ====================================
// State Component Props
// ====================================

export interface LoadingStateProps extends BaseComponentProps {
  message?: string;
  variant?: 'spinner' | 'skeleton';
}

export interface EmptyStateProps extends BaseComponentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ErrorStateProps extends BaseComponentProps {
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
}

// ====================================
// Form Component Props
// ====================================

export interface EditProfileFormProps extends BaseComponentProps {
  user: User;
  onSave: (userData: Partial<User>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// ====================================
// Hook Return Types
// ====================================

export interface UseProfileReturn {
  state: import('./index').ProfileState;
  actions: {
    loadProfile: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    loadOrders: () => Promise<void>;
    loadAddresses: () => Promise<void>;
    loadPaymentMethods: () => Promise<void>;
    logout: () => Promise<void>;
    logoutAllSessions: () => Promise<void>;
  };
}

// ====================================
// Navigation Types
// ====================================

export interface ProfileRoute {
  path: string;
  name: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
}

export type ProfileNavigationAction =
  | 'viewOrders'
  | 'editProfile'
  | 'manageAddresses'
  | 'managePaymentMethods'
  | 'viewCredits'
  | 'viewCoupons'
  | 'settings'
  | 'help'
  | 'logout';