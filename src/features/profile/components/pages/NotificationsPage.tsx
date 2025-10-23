/**
 * @module NotificationsPage
 * @description Samsung-style notifications settings page - optimized and modular
 */

import React from "react";
import { Bell, Megaphone, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import CategorySection from "../notifications/CategorySection";
import NotificationHelp from "../notifications/NotificationHelp";
import { createNotificationSettings } from "../notifications/notificationConfig";
import { useNotificationSettings } from "../notifications/useNotificationSettings";

interface NotificationsPageProps {
  onBack?: () => void;
  className?: string;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();

  // Initialize notification settings using the config
  const initialSettings = createNotificationSettings(
    state.preferences?.notifications?.email ?? true,
    state.preferences?.notifications?.push ?? true,
    state.preferences?.notifications?.marketing ?? false
  );

  // Use the custom hook for managing notification settings
  const {
    handleEmailChange,
    handlePushChange,
    getSettingsByCategory,
    getAllEmailEnabled,
    getAllPushEnabled,
    handleToggleAllEmail,
    handleToggleAllPush,
    handleSaveSettings,
  } = useNotificationSettings(initialSettings);

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Notificaciones"
        subtitle="Gestiona cómo y cuándo quieres recibir notificaciones"
        onBack={onBack}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveSettings}
            className="font-bold bg-black hover:bg-gray-800"
          >
            Guardar
          </Button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 pb-8 space-y-8 mt-10">
        {/* General Notifications */}
        <CategorySection
          title="Notificaciones Generales"
          description="Información importante sobre tus pedidos y cuenta"
          icon={Bell}
          settings={getSettingsByCategory("general")}
          onEmailChange={handleEmailChange}
          onPushChange={handlePushChange}
          allEmailEnabled={getAllEmailEnabled("general")}
          allPushEnabled={getAllPushEnabled("general")}
          onToggleAllEmail={() => handleToggleAllEmail("general")}
          onToggleAllPush={() => handleToggleAllPush("general")}
        />

        {/* Marketing Notifications */}
        <CategorySection
          title="Marketing y Promociones"
          description="Ofertas, descuentos y recomendaciones personalizadas"
          icon={Megaphone}
          settings={getSettingsByCategory("marketing")}
          onEmailChange={handleEmailChange}
          onPushChange={handlePushChange}
          allEmailEnabled={getAllEmailEnabled("marketing")}
          allPushEnabled={getAllPushEnabled("marketing")}
          onToggleAllEmail={() => handleToggleAllEmail("marketing")}
          onToggleAllPush={() => handleToggleAllPush("marketing")}
        />

        {/* Security Notifications */}
        <CategorySection
          title="Seguridad"
          description="Alertas importantes sobre la seguridad de tu cuenta"
          icon={Shield}
          settings={getSettingsByCategory("security")}
          onEmailChange={handleEmailChange}
          onPushChange={handlePushChange}
          allEmailEnabled={getAllEmailEnabled("security")}
          allPushEnabled={getAllPushEnabled("security")}
          onToggleAllEmail={() => handleToggleAllEmail("security")}
          onToggleAllPush={() => handleToggleAllPush("security")}
          isSecurityCategory={true}
        />

        {/* Help Notice */}
        <NotificationHelp />
      </div>
    </div>
  );
};

NotificationsPage.displayName = "NotificationsPage";

export default NotificationsPage;
