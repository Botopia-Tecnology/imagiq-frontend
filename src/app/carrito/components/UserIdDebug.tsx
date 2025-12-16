/**
 * Componente de debug para mostrar el userId actual en todos los steps del checkout
 * Solo se muestra cuando NEXT_PUBLIC_SHOW_PRODUCT_CODES=true
 */
"use client";
import { useEffect, useState } from 'react';
import { getUserId } from '../utils/getUserId';

export default function UserIdDebug() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sources, setSources] = useState<{
    imagiq_user: string | null;
    checkout_address: string | null;
    default_address: string | null;
  }>({
    imagiq_user: null,
    checkout_address: null,
    default_address: null,
  });

  useEffect(() => {
    const updateUserId = () => {
      const id = getUserId();
      setUserId(id);

      // Debug: Obtener de cada fuente individualmente
      const sources = {
        imagiq_user: null as string | null,
        checkout_address: null as string | null,
        default_address: null as string | null,
      };

      try {
        const userStr = localStorage.getItem('imagiq_user');
        if (userStr && userStr !== 'null') {
          const user = JSON.parse(userStr);
          sources.imagiq_user = user?.id || user?.user_id || null;
        }
      } catch (e) {
        // Ignore
      }

      try {
        const addressStr = localStorage.getItem('checkout-address');
        if (addressStr && addressStr !== 'null') {
          const address = JSON.parse(addressStr);
          sources.checkout_address = address?.usuario_id || null;
        }
      } catch (e) {
        // Ignore
      }

      try {
        const defaultStr = localStorage.getItem('imagiq_default_address');
        if (defaultStr && defaultStr !== 'null') {
          const address = JSON.parse(defaultStr);
          sources.default_address = address?.usuario_id || null;
        }
      } catch (e) {
        // Ignore
      }

      setSources(sources);
    };

    updateUserId();

    // Actualizar cada segundo para detectar cambios
    const interval = setInterval(updateUserId, 1000);

    return () => clearInterval(interval);
  }, []);

  // Solo mostrar si está habilitado el modo debug
  if (process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES !== 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-3 shadow-lg z-50 max-w-xs">
      <p className="text-xs font-bold text-blue-900 mb-2">
        🆔 DEBUG - User ID
      </p>
      <div className="text-[10px] text-blue-800 space-y-1">
        <div className="flex justify-between gap-2">
          <span className="font-semibold">Activo:</span>
          <span className={`font-mono ${userId ? 'text-green-600' : 'text-red-600'}`}>
            {userId || 'null'}
          </span>
        </div>
        <hr className="border-blue-200 my-1" />
        <div className="text-[9px] opacity-75">
          <div className="flex justify-between gap-2">
            <span>imagiq_user:</span>
            <span className={`font-mono ${sources.imagiq_user ? 'text-green-600' : 'text-gray-400'}`}>
              {sources.imagiq_user ? sources.imagiq_user.substring(0, 8) + '...' : 'null'}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>checkout-addr:</span>
            <span className={`font-mono ${sources.checkout_address ? 'text-green-600' : 'text-gray-400'}`}>
              {sources.checkout_address ? sources.checkout_address.substring(0, 8) + '...' : 'null'}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>default-addr:</span>
            <span className={`font-mono ${sources.default_address ? 'text-green-600' : 'text-gray-400'}`}>
              {sources.default_address ? sources.default_address.substring(0, 8) + '...' : 'null'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
