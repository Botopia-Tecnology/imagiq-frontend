/**
 * Utilidad para obtener el userId de forma consistente en todos los steps del checkout
 * Busca en múltiples fuentes para asegurar que siempre se encuentre el userId
 */

/**
 * Obtiene el userId del usuario actual (invitado o registrado)
 * Busca en este orden de prioridad:
 * 1. imagiq_user (usuario autenticado o invitado registrado)
 * 2. checkout-address.usuario_id (dirección guardada)
 * 3. imagiq_default_address.usuario_id (dirección predeterminada)
 * 
 * @returns El userId encontrado o null si no hay ninguno
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  console.log('🔍 [getUserId] Buscando userId en localStorage...');

  try {
    // 1. Intentar obtener de imagiq_user (prioridad más alta)
    const userStr = localStorage.getItem('imagiq_user');
    console.log('  📦 imagiq_user raw:', userStr ? userStr.substring(0, 100) + '...' : 'null');
    
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      const user = JSON.parse(userStr);
      console.log('  📦 imagiq_user parsed:', { id: user?.id, user_id: user?.user_id, email: user?.email });
      
      if (user?.id) {
        console.log('✅ [getUserId] UserId encontrado en imagiq_user:', user.id);
        return user.id;
      }
      if (user?.user_id) {
        console.log('✅ [getUserId] UserId encontrado en imagiq_user (user_id):', user.user_id);
        return user.user_id;
      }
    }

    // 2. Intentar obtener de checkout-address
    const addressStr = localStorage.getItem('checkout-address');
    console.log('  📦 checkout-address raw:', addressStr ? addressStr.substring(0, 100) + '...' : 'null');
    
    if (addressStr && addressStr !== 'null' && addressStr !== 'undefined') {
      const address = JSON.parse(addressStr);
      console.log('  📦 checkout-address parsed:', { usuario_id: address?.usuario_id, ciudad: address?.ciudad });
      
      if (address?.usuario_id) {
        console.log('✅ [getUserId] UserId encontrado en checkout-address:', address.usuario_id);
        return address.usuario_id;
      }
    }

    // 3. Intentar obtener de imagiq_default_address
    const defaultAddressStr = localStorage.getItem('imagiq_default_address');
    console.log('  📦 imagiq_default_address raw:', defaultAddressStr ? defaultAddressStr.substring(0, 100) + '...' : 'null');
    
    if (defaultAddressStr && defaultAddressStr !== 'null' && defaultAddressStr !== 'undefined') {
      const defaultAddress = JSON.parse(defaultAddressStr);
      console.log('  📦 imagiq_default_address parsed:', { usuario_id: defaultAddress?.usuario_id });
      
      if (defaultAddress?.usuario_id) {
        console.log('✅ [getUserId] UserId encontrado en imagiq_default_address:', defaultAddress.usuario_id);
        return defaultAddress.usuario_id;
      }
    }

    console.warn('⚠️ [getUserId] No se encontró userId en ninguna fuente');
    return null;
  } catch (error) {
    console.error('❌ [getUserId] Error obteniendo userId:', error);
    return null;
  }
}

/**
 * Guarda el userId de forma consistente en todas las fuentes necesarias
 * Esto asegura que el userId esté disponible en todos los steps
 * 
 * @param userId - El ID del usuario a guardar
 * @param userEmail - Email opcional del usuario
 */
export function saveUserId(userId: string, userEmail?: string): void {
  if (typeof window === 'undefined') return;

  try {
    // Actualizar imagiq_user si existe
    const userStr = localStorage.getItem('imagiq_user');
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      const user = JSON.parse(userStr);
      user.id = userId;
      if (userEmail) user.email = userEmail;
      localStorage.setItem('imagiq_user', JSON.stringify(user));
      console.log('✅ [saveUserId] UserId guardado en imagiq_user:', userId);
    }

    // Actualizar checkout-address si existe
    const addressStr = localStorage.getItem('checkout-address');
    if (addressStr && addressStr !== 'null' && addressStr !== 'undefined') {
      const address = JSON.parse(addressStr);
      address.usuario_id = userId;
      if (userEmail) address.email = userEmail;
      localStorage.setItem('checkout-address', JSON.stringify(address));
      console.log('✅ [saveUserId] UserId guardado en checkout-address:', userId);
    }

    console.log('✅ [saveUserId] UserId guardado exitosamente:', userId);
  } catch (error) {
    console.error('❌ [saveUserId] Error guardando userId:', error);
  }
}
