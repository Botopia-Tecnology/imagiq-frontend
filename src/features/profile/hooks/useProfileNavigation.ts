/**
 * @module useProfileNavigation
 * @description Hook for managing profile page navigation state and handlers
 */

import { useState, useCallback } from "react";

export type ProfileView =
  | "main"
  | "orders"
  | "addresses"
  | "payment-methods"
  | "coupons"
  | "loyalty"
  | "billing"
  | "notifications"
  | "help"
  | "terms"
  | "privacy"
  | "data-processing"
  | "relevant-info";

export const useProfileNavigation = () => {
  const [currentView, setCurrentView] = useState<ProfileView>("main");

  const handleBackToMain = useCallback(() => {
    setCurrentView("main");
  }, []);

  const handleEditProfile = useCallback(() => {
    console.log("Edit profile clicked");
    // note: profile editing modal to be implemented later
  }, []);

  const handleOrdersClick = useCallback(() => {
    setCurrentView("orders");
  }, []);

  const handleAddressesClick = useCallback(() => {
    setCurrentView("addresses");
  }, []);

  const handlePaymentMethodsClick = useCallback(() => {
    setCurrentView("payment-methods");
  }, []);

  const handleCouponsClick = useCallback(() => {
    setCurrentView("coupons");
  }, []);

  const handleLoyaltyClick = useCallback(() => {
    setCurrentView("loyalty");
  }, []);

  const handleBillingClick = useCallback(() => {
    setCurrentView("billing");
  }, []);

  const handleNotificationsClick = useCallback(() => {
    setCurrentView("notifications");
  }, []);

  const handleHelpClick = useCallback(() => {
    setCurrentView("help");
  }, []);

  const handleTermsClick = useCallback(() => {
    setCurrentView("terms");
  }, []);

  const handlePrivacyClick = useCallback(() => {
    setCurrentView("privacy");
  }, []);

  const handleRelevantInfoClick = useCallback(() => {
    setCurrentView("relevant-info");
  }, []);

  const handleDataProcessingClick = useCallback(() => {
    setCurrentView("data-processing");
  }, []);

  const handleOrderDetails = useCallback((orderId: string) => {
    console.log("Order details clicked:", orderId);
    // note: navigation to order details will be handled in the orders flow
  }, []);

  const handleViewAllOrders = useCallback(() => {
    setCurrentView("orders");
  }, []);

  return {
    currentView,
    handlers: {
      handleBackToMain,
      handleEditProfile,
      handleOrdersClick,
      handleAddressesClick,
      handlePaymentMethodsClick,
      handleCouponsClick,
      handleLoyaltyClick,
      handleBillingClick,
      handleNotificationsClick,
      handleHelpClick,
      handleTermsClick,
      handlePrivacyClick,
      handleRelevantInfoClick,
      handleDataProcessingClick,
      handleOrderDetails,
      handleViewAllOrders,
    },
  };
};
