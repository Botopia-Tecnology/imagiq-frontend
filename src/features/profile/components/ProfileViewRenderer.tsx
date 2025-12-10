/**
 * @module ProfileViewRenderer
 * @description Renders different profile views based on current navigation state
 */

import React from "react";
import { ProfileView } from "../hooks/useProfileNavigation";
import OrdersPage from "./pages/OrdersPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import CouponsPage from "./pages/CouponsPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import BillingPage from "./pages/BillingPage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpPage from "./pages/HelpPage";
import LegalPage from "./pages/LegalPage";

interface ProfileViewRendererProps {
  currentView: ProfileView;
  onBack: () => void;
  className?: string;
}

export const ProfileViewRenderer: React.FC<ProfileViewRendererProps> = ({
  currentView,
  onBack,
  className,
}) => {
  switch (currentView) {
    case "orders":
      return <OrdersPage onBack={onBack} className={className} userEmail=""/>;

    case "addresses":
      return <AddressesPage onBack={onBack} className={className} />;

    case "payment-methods":
      return <PaymentMethodsPage onBack={onBack} />;

    case "coupons":
      return <CouponsPage onBack={onBack} className={className} />;

    case "loyalty":
      return <LoyaltyPage onBack={onBack} className={className} />;

    case "billing":
      return <BillingPage onBack={onBack} className={className} />;

    case "notifications":
      return <NotificationsPage onBack={onBack} className={className} />;

    case "help":
      return <HelpPage onBack={onBack} className={className} />;

    case "terms":
      return (
        <LegalPage onBack={onBack} className={className} documentType="terms" />
      );

    case "privacy":
      return (
        <LegalPage
          onBack={onBack}
          className={className}
          documentType="privacy"
        />
      );

    case "data-processing":
      return (
        <LegalPage
          onBack={onBack}
          className={className}
          documentType="data-processing"
        />
      );

    case "relevant-info":
      return (
        <LegalPage
          onBack={onBack}
          className={className}
          documentType="relevant-info"
        />
      );

    default:
      return null;
  }
};

ProfileViewRenderer.displayName = "ProfileViewRenderer";

export default ProfileViewRenderer;
