/**
 * @module LogoutSection
 * @description Logout actions section for profile page - Samsung style
 */

import React from "react";
import { LogOut } from "lucide-react";
import Button from "@/components/Button";

interface LogoutSectionProps {
  onLogout: () => void;
}

export const LogoutSection: React.FC<LogoutSectionProps> = ({ onLogout }) => {
  return (
    <div className="mt-12 pt-8 border-t-2 border-gray-100">
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white font-bold py-4 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </Button>
        <Button
          variant="outline"
          onClick={() => console.log("Logout all sessions")}
          className="w-full text-gray-900 border-2 border-gray-300 hover:bg-gray-900 hover:text-white font-bold py-4 transition-colors"
        >
          Cerrar Sesión en Todos los Dispositivos
        </Button>
      </div>
    </div>
  );
};

LogoutSection.displayName = "LogoutSection";

export default LogoutSection;
