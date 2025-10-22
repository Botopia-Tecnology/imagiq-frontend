/**
 * @module ProfilePage
 * @description Main profile page component leveraging existing UI components
 * Following Composition Pattern - combines smaller components into a cohesive page
 */

import React from "react";
import { PUBLIC_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProfile } from "../hooks/useProfile";
import { useProfileNavigation } from "../hooks/useProfileNavigation";
import ProfileHeader from "./sections/ProfileHeader";
import QuickActions from "./sections/QuickActions";
import BenefitsSection from "./sections/BenefitsSection";
import AccountSection from "./sections/AccountSection";
import SettingsSection from "./sections/SettingsSection";
import LegalSection from "./sections/LegalSection";
import LogoutSection from "./sections/LogoutSection";
import OrdersSection from "./sections/OrdersSection";
import ProfileViewRenderer from "./ProfileViewRenderer";

interface ProfilePageProps {
  className?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ className }) => {
  const { state, actions, isLoading } = useProfile();
  const { currentView, handlers } = useProfileNavigation();

  const handleLogout = async () => {
    await actions.logout();
  };

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Parece que no has iniciado sesión
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Inicia sesión para ver y gestionar tu perfil, pedidos y métodos de
            pago.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={PUBLIC_ROUTES.LOGIN}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Ingresar
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render different views based on currentView state
  if (currentView !== "main") {
    return (
      <ProfileViewRenderer
        currentView={currentView}
        onBack={handlers.handleBackToMain}
        className={className}
      />
    );
  }

  // Default main profile view - Samsung style
  return (
    <div className={cn("min-h-screen bg-white", className)}>
      {/* Profile Header */}
      <ProfileHeader
        user={state.user}
        onEditProfile={handlers.handleEditProfile}
        loading={state.loading.profile}
      />

      {/* Quick Actions */}
      <QuickActions
        onOrdersClick={handlers.handleOrdersClick}
        onHelpClick={handlers.handleHelpClick}
        onPaymentMethodsClick={handlers.handlePaymentMethodsClick}
      />

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Active Orders Section */}
        <OrdersSection
          title="Pedidos Activos"
          orders={state.activeOrders.slice(0, 2)}
          showViewAll={state.activeOrders.length > 2}
          onViewDetails={handlers.handleOrderDetails}
          onViewAllOrders={handlers.handleViewAllOrders}
        />

        {/* Recent Orders Section */}
        <OrdersSection
          title="Pedidos Recientes"
          orders={state.recentOrders.slice(0, 3)}
          showViewAll={true}
          onViewDetails={handlers.handleOrderDetails}
          onViewAllOrders={handlers.handleViewAllOrders}
        />

        {/* Benefits Section */}
        <BenefitsSection
          couponsCount={state.coupons.length}
          loyaltyProgram={state.loyaltyProgram ?? undefined}
          onCouponsClick={handlers.handleCouponsClick}
          onLoyaltyClick={handlers.handleLoyaltyClick}
        />

        {/* My Account Section */}
        <AccountSection
          addressesCount={state.addresses.length}
          paymentMethodsCount={state.paymentMethods.length}
          onAddressesClick={handlers.handleAddressesClick}
          onPaymentMethodsClick={handlers.handlePaymentMethodsClick}
          onBillingClick={handlers.handleBillingClick}
        />

        {/* Settings Section */}
        <SettingsSection
          onNotificationsClick={handlers.handleNotificationsClick}
          onHelpClick={handlers.handleHelpClick}
        />

        {/* More Information Section */}
        <LegalSection
          onTermsClick={handlers.handleTermsClick}
          onPrivacyClick={handlers.handlePrivacyClick}
          onRelevantInfoClick={handlers.handleRelevantInfoClick}
          onDataProcessingClick={handlers.handleDataProcessingClick}
        />

        {/* Logout Section */}
        <LogoutSection onLogout={handleLogout} />
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

ProfilePage.displayName = "ProfilePage";

export default ProfilePage;
