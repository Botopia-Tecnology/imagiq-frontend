/**
 * Página de Perfil de Usuario
 * - Información personal del usuario (nombre, correo) se carga automáticamente desde el backend
 * - Historial de compras y órdenes activas
 * - Preferencias y configuraciones
 * - Gestión de direcciones de envío (se cargan desde la vista v_usuario_perfil)
 * - Métodos de pago (se cargan desde la vista v_usuario_perfil)
 * - Programa de lealtad y beneficios
 */

"use client";

import { ProfilePage as ProfilePageComponent } from "@/features/profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("imagiq_token");
    const user = JSON.parse(localStorage.getItem("imagiq_user") || "{}");

    // Redirigir a login si no hay sesión activa
    if (!token || !user.id) {
      router.push("/login");
    }

    // Nota: Los datos del perfil (nombre, correo, direcciones, métodos de pago)
    // ahora se cargan automáticamente por el hook useProfile dentro del componente
    // ProfilePageComponent. No es necesario hacer el fetch aquí.
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfilePageComponent />
    </div>
  );
}
