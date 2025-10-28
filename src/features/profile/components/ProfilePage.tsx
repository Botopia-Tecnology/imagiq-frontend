/**
 * @module ProfilePage
 * @description Página de perfil simplificada
 */

import React, { useState } from "react";
import { PUBLIC_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProfile } from "../hooks/useProfile";
import ProfileHeader from "./sections/ProfileHeader";
import QuickActions from "./sections/QuickActions";
import AccountSection from "./sections/AccountSection";
import BenefitsSection from "./sections/BenefitsSection";
import SettingsSection from "./sections/SettingsSection";
import LegalSection from "./sections/LegalSection";
import LogoutSection from "./sections/LogoutSection";
import AddressesPage from "./pages/AddressesPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";

type CurrentView = "main" | "addresses" | "payment-methods";

interface ProfilePageProps {
  className?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ className }) => {
  const { state, actions, isLoading } = useProfile();
  const [currentView, setCurrentView] = useState<CurrentView>("main");
  const router = useRouter();

  const handleLogout = async () => {
    await actions.logout();
  };

  // Handlers de navegación
  const handleEditProfile = () => console.log("Editar perfil");
  const handleOrdersClick = () => console.log("Ver pedidos");
  const handleHelpClick = () => console.log("Ver ayuda");
  const handlePaymentMethodsClick = () => setCurrentView("payment-methods");
  const handleAddressesClick = () => setCurrentView("addresses");
  const handleBillingClick = () => console.log("Ver facturación");
  const handleCouponsClick = () => console.log("Ver cupones");
  const handleLoyaltyClick = () => console.log("Ver programa de lealtad");
  const handleNotificationsClick = () => console.log("Ver notificaciones");
  const handleTermsClick = () => router.push("/perfil/legal-terms");
  const handlePrivacyClick = () => router.push("/perfil/legal-privacy");

  const handleBackToMain = () => setCurrentView("main");

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

  // Renderizar vista de direcciones
  if (currentView === "addresses") {
    return <AddressesPage onBack={handleBackToMain} />;
  }

  // Renderizar vista de métodos de pago
  if (currentView === "payment-methods") {
    return <PaymentMethodsPage onBack={handleBackToMain} />;
  }

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      {/* Profile Header */}
      <ProfileHeader
        user={state.user}
        onEditProfile={handleEditProfile}
        loading={isLoading}
      />

      {/* Quick Actions */}
      <QuickActions
        onOrdersClick={handleOrdersClick}
        onHelpClick={handleHelpClick}
        onPaymentMethodsClick={handlePaymentMethodsClick}
      />

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Benefits Section */}
        <BenefitsSection
          couponsCount={0}
          loyaltyProgram={undefined}
          onCouponsClick={handleCouponsClick}
          onLoyaltyClick={handleLoyaltyClick}
        />

        {/* My Account Section */}
        <AccountSection
          addressesCount={state.user.direcciones?.length || 0}
          paymentMethodsCount={state.user.tarjetas?.length || 0}
          onAddressesClick={handleAddressesClick}
          onPaymentMethodsClick={handlePaymentMethodsClick}
          onBillingClick={handleBillingClick}
        />

        {/* Settings Section */}
        <SettingsSection
          onNotificationsClick={handleNotificationsClick}
          onHelpClick={handleHelpClick}
        />

        {/* Legal Documentation Section */}
        <LegalSection
          onTermsClick={handleTermsClick}
          onPrivacyClick={handlePrivacyClick}
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
