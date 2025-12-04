/**
 * Utilidad para manejar usuarios guest (no autenticados)
 * Garantiza que todos los componentes usen el mismo guest ID
 */

/**
 * Obtiene o genera un guest ID único para usuarios no autenticados
 * El ID se guarda en localStorage para persistir entre sesiones
 *
 * @returns {string} Guest ID en formato "guest_{timestamp}_{random}"
 */
export function getOrCreateGuestId(): string {
  // Intentar obtener guest ID existente
  let guestId = localStorage.getItem("imagiq_guest_id");

  if (!guestId) {
    // Generar un nuevo guest ID único
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("imagiq_guest_id", guestId);
    console.log("🆕 Nuevo guest ID generado:", guestId);
  } else {
    console.log("✅ Guest ID existente:", guestId);
  }

  return guestId;
}

/**
 * Obtiene el guest ID si existe, sin crear uno nuevo
 *
 * @returns {string | null} Guest ID o null si no existe
 */
export function getGuestId(): string | null {
  return localStorage.getItem("imagiq_guest_id");
}

/**
 * Elimina el guest ID del localStorage
 * Usar cuando el usuario se registra o inicia sesión
 */
export function clearGuestId(): void {
  localStorage.removeItem("imagiq_guest_id");
  console.log("🗑️ Guest ID eliminado");
}
