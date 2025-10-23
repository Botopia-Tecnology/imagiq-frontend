/**
 * @module NotificationHelp
 * @description Samsung-style help notice for notifications
 */

import React from 'react';
import { Shield } from 'lucide-react';

export const NotificationHelp: React.FC = () => (
  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
        <Shield className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Sobre las notificaciones</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          Las notificaciones de seguridad no se pueden desactivar para proteger tu cuenta.
          Puedes personalizar todas las demás según tus preferencias.
        </p>
      </div>
    </div>
  </div>
);

export default NotificationHelp;
