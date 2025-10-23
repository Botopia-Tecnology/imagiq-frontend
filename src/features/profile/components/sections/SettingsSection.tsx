import React from "react";
import { Bell, HelpCircle, ChevronRight } from "lucide-react";

interface SettingsSectionProps {
  onNotificationsClick: () => void;
  onHelpClick: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  onNotificationsClick,
  onHelpClick
}) => {
  return (
    <div className="py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración</h2>
      <div className="space-y-2">
        {/* Notificaciones */}
        <button
          onClick={onNotificationsClick}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-all"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">Notificaciones</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Ayuda */}
        <button
          onClick={onHelpClick}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-all"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold">Ayuda</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
