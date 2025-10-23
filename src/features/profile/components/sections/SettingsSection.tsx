/**
 * @module SettingsSection
 * @description Settings section for profile page - Samsung style
 */

import React from "react";
import { Bell, HelpCircle } from "lucide-react";
import MenuItem from "./MenuItem";

interface SettingsSectionProps {
  onNotificationsClick: () => void;
  onHelpClick: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  onNotificationsClick,
  onHelpClick,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">
        Configuración
      </h2>
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
        <MenuItem
          icon={Bell}
          label="Notificaciones"
          onClick={onNotificationsClick}
        />
        <MenuItem icon={HelpCircle} label="Ayuda" onClick={onHelpClick} />
      </div>
    </div>
  );
};

SettingsSection.displayName = "SettingsSection";

export default SettingsSection;
