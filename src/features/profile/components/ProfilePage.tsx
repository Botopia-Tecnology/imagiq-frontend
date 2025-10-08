/**
 * @module ProfilePage
 * @description Main profile page component leveraging existing UI components
 * Following Composition Pattern - combines smaller components into a cohesive page
 */

import React, { useState } from 'react';
import { PUBLIC_ROUTES } from '@/constants/routes';
import Link from 'next/link';
import {
  MapPin,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
  Shield,
  Info,
  Database,
  LogOut,
  Gift,
  Star,
  
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfile } from '../hooks/useProfile';
import ProfileHeader from './sections/ProfileHeader';
import QuickActions from './sections/QuickActions';
import OrderCard from './sections/OrderCard';
import MenuItem from './sections/MenuItem';

// Import the new page components
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import CouponsPage from './pages/CouponsPage';
import NotificationsPage from './pages/NotificationsPage';
import HelpPage from './pages/HelpPage';
import LegalPage from './pages/LegalPage';

interface ProfilePageProps {
  className?: string;
}

type ProfileView =
  | 'main'
  | 'orders'
  | 'addresses'
  | 'payment-methods'
  | 'coupons'
  | 'notifications'
  | 'help'
  | 'terms'
  | 'privacy'
  | 'data-processing'
  | 'relevant-info';

export const ProfilePage: React.FC<ProfilePageProps> = ({ className }) => {
  const { state, actions, isLoading } = useProfile();
  const [currentView, setCurrentView] = useState<ProfileView>('main');

  // Navigation handlers
  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // note: profile editing modal to be implemented later
  };

  const handleOrdersClick = () => {
    setCurrentView('orders');
  };

  const handleAddressesClick = () => {
    setCurrentView('addresses');
  };

  const handlePaymentMethodsClick = () => {
    setCurrentView('payment-methods');
  };

  const handleCouponsClick = () => {
    setCurrentView('coupons');
  };

  const handleNotificationsClick = () => {
    setCurrentView('notifications');
  };

  const handleHelpClick = () => {
    setCurrentView('help');
  };

  const handleTermsClick = () => {
    setCurrentView('terms');
  };

  const handlePrivacyClick = () => {
    setCurrentView('privacy');
  };

  const handleRelevantInfoClick = () => {
    setCurrentView('relevant-info');
  };

  const handleDataProcessingClick = () => {
    setCurrentView('data-processing');
  };

  const handleOrderDetails = (orderId: string) => {
    console.log('Order details clicked:', orderId);
    // note: navigation to order details will be handled in the orders flow
  };

  const handleViewAllOrders = () => {
    setCurrentView('orders');
  };

  const handleLogout = async () => {
    await actions.logout();
  };

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Parece que no has iniciado sesión</h2>
          <p className="text-sm text-gray-600 mb-4">Inicia sesión para ver y gestionar tu perfil, pedidos y métodos de pago.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href={PUBLIC_ROUTES.LOGIN} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Ingresar
            </Link>
            <Link href="/" className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render different views based on currentView state
  if (currentView === 'orders') {
    return <OrdersPage onBack={handleBackToMain} className={className} />;
  }

  if (currentView === 'addresses') {
    return <AddressesPage onBack={handleBackToMain} className={className} />;
  }

  if (currentView === 'payment-methods') {
    return <PaymentMethodsPage onBack={handleBackToMain} className={className} />;
  }

  if (currentView === 'coupons') {
    return <CouponsPage onBack={handleBackToMain} className={className} />;
  }

  if (currentView === 'notifications') {
    return <NotificationsPage onBack={handleBackToMain} className={className} />;
  }

  if (currentView === 'help') {
    return <HelpPage onBack={handleBackToMain} className={className} />;
  }

  if (currentView === 'terms') {
    return <LegalPage onBack={handleBackToMain} className={className} documentType="terms" />;
  }

  if (currentView === 'privacy') {
    return <LegalPage onBack={handleBackToMain} className={className} documentType="privacy" />;
  }

  if (currentView === 'data-processing') {
    return <LegalPage onBack={handleBackToMain} className={className} documentType="data-processing" />;
  }

  if (currentView === 'relevant-info') {
    return <LegalPage onBack={handleBackToMain} className={className} documentType="relevant-info" />;
  }

  // Default main profile view
  return (
    <div className={cn('max-w-4xl mx-auto p-4 space-y-6', className)}>
      {/* Profile Header */}
      <ProfileHeader
        user={state.user}
        onEditProfile={handleEditProfile}
        loading={state.loading.profile}
      />

      {/* Quick Actions */}
      <QuickActions
        onOrdersClick={handleOrdersClick}
        onHelpClick={handleHelpClick}
        onPaymentMethodsClick={handlePaymentMethodsClick}
      />

      {/* Active Orders Section */}
      {state.activeOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pedidos Activos
            </h2>
            {state.activeOrders.length > 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAllOrders}
              >
                Ver todos
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {state.activeOrders.slice(0, 2).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                variant="active"
                onViewDetails={handleOrderDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      {state.recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pedidos Recientes
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAllOrders}
            >
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {state.recentOrders.slice(0, 3).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                variant="recent"
                onViewDetails={handleOrderDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Beneficios
        </h2>
        <div className="space-y-1">
          <MenuItem
            icon={Gift}
            label="Cupones"
            badge={state.coupons.length}
            onClick={handleCouponsClick}
          />
          {state.loyaltyProgram && (
            <MenuItem
              icon={Star}
              label="Programa de Lealtad"
              badge={`${state.loyaltyProgram.points} pts`}
              onClick={() => console.log('Loyalty clicked')}
            />
          )}
        </div>
      </div>

      {/* My Account Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Mi Cuenta
        </h2>
        <div className="space-y-1">
          <MenuItem
            icon={MapPin}
            label="Direcciones"
            badge={state.addresses.length}
            onClick={handleAddressesClick}
          />
          <MenuItem
            icon={CreditCard}
            label="Métodos de Pago"
            badge={state.paymentMethods.length}
            onClick={handlePaymentMethodsClick}
          />
          <MenuItem
            icon={FileText}
            label="Información de Facturación"
            onClick={() => console.log('Billing clicked')}
          />
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración
        </h2>
        <div className="space-y-1">
          <MenuItem
            icon={Bell}
            label="Notificaciones"
            onClick={handleNotificationsClick}
          />
          <MenuItem
            icon={HelpCircle}
            label="Ayuda"
            onClick={handleHelpClick}
          />
        </div>
      </div>

      {/* More Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Más Información
        </h2>
        <div className="space-y-1">
          <MenuItem
            icon={FileText}
            label="Términos y Condiciones"
            onClick={handleTermsClick}
          />
          <MenuItem
            icon={Shield}
            label="Política de Privacidad"
            onClick={handlePrivacyClick}
          />
          <MenuItem
            icon={Info}
            label="Información Relevante"
            onClick={handleRelevantInfoClick}
          />
          <MenuItem
            icon={Database}
            label="Autorización para Tratamiento de Datos"
            onClick={handleDataProcessingClick}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full text-red-600 border-red-300 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Logout all sessions')}
            className="w-full text-red-600 hover:bg-red-50"
          >
            Cerrar Sesión en Todos los Dispositivos
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <LoadingSpinner size="sm" />
            <span className="text-gray-700">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;