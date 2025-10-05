/**
 * Página de Perfil de Usuario
 * - Información personal del usuario
 * - Historial de compras y órdenes activas
 * - Preferencias y configuraciones
 * - Gestión de direcciones de envío
 * - Métodos de pago
 * - Programa de lealtad y beneficios
 */

'use client';

import { ProfilePage as ProfilePageComponent } from '@/features/profile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfilePageComponent />
    </div>
  );
}
