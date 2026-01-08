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
 * Limpia el cache del userId (Mantenido por compatibilidad pero ya no hace nada)
 * @deprecated El caché ha sido eliminado
 */
export function clearUserIdCache(): void {
  // No-op: Cache eliminado por solicitud
  console.log('🧹 [clearUserIdCache] Cache eliminado (no-op)');
}

/**
 * Guarda el userId de forma consistente en todas las fuentes necesarias
 * Esto asegura que el userId esté disponible en todos los steps
 * 
 * @param userId - El ID del usuario a guardar
 * @param userEmail - Email opcional del usuario
 * @param clearPrevious - Si debe limpiar datos anteriores (default: true)
 */
export function saveUserId(userId: string, userEmail?: string, clearPrevious: boolean = true): void {
  if (typeof window === 'undefined') return;

  try {
    // PASO 1: Limpiar datos anteriores si se solicita
    if (clearPrevious) {
      clearPreviousUserData();
    }

    console.log('💾 [saveUserId] Guardando nuevo userId:', userId);

    // PASO 2: Crear/Actualizar imagiq_user SIEMPRE
    const userStr = localStorage.getItem('imagiq_user');
    let user: Record<string, unknown> = {};

    // Si existe imagiq_user, mantener datos existentes
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      try {
        user = JSON.parse(userStr) as Record<string, unknown>;
      } catch (e) {
        console.warn('⚠️ [saveUserId] Error parsing imagiq_user existente, creando nuevo:', e);
        user = {};
      }
    }

    user.id = userId;
    if (userEmail) user.email = userEmail;

    localStorage.setItem('imagiq_user', JSON.stringify(user));
    console.log('✅ [saveUserId] UserId guardado en imagiq_user:', userId);

    // PASO 3: Actualizar checkout-address si existe
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

/**
 * Limpia todos los datos de usuario anterior antes de guardar nuevo usuario
 * CRÍTICO: Debe llamarse ANTES de login/registro para evitar mezclar datos
 * 
 * @param preserveAddress - Si debe preservar checkout-address (default: false)
 */
export function clearPreviousUserData(preserveAddress: boolean = false): void {
  if (typeof window === 'undefined') return;

  console.log('🧹 [clearPreviousUserData] Limpiando datos de usuario anterior...', { preserveAddress });

  try {
    // Limpiar datos de usuario
    localStorage.removeItem('imagiq_user');
    console.log('🗑️ [clearPreviousUserData] imagiq_user limpiado');

    // Limpiar dirección de checkout SOLO si no se debe preservar
    if (!preserveAddress) {
      localStorage.removeItem('checkout-address');
      console.log('🗑️ [clearPreviousUserData] checkout-address limpiado');
    } else {
      console.log('⚠️ [clearPreviousUserData] checkout-address preservado');
    }

    // Limpiar dirección predeterminada
    localStorage.removeItem('imagiq_default_address');
    console.log('🗑️ [clearPreviousUserData] imagiq_default_address limpiado');

    // Limpiar caché de candidateStores (asociado a userId anterior)
    const cacheKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('global_can_pick_up_')) {
        cacheKeys.push(key);
      }
    }

    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ [clearPreviousUserData] Caché limpiado:', key);
    });

    console.log('✅ [clearPreviousUserData] Datos anteriores limpiados exitosamente');
  } catch (error) {
    console.error('❌ [clearPreviousUserData] Error limpiando datos:', error);
  }
}

/**
 * Limpia TODOS los datos de usuario para logout completo
 * CRÍTICO: Se usa SOLO en logout - limpia TODO sin preservar nada
 */
export function clearAllUserData(): void {
  if (typeof window === 'undefined') return;

  console.log('🚪 [clearAllUserData] Logout completo - limpiando TODOS los datos de usuario...');

  try {
    // Limpiar usuario
    localStorage.removeItem('imagiq_user');
    localStorage.removeItem('imagiq_token');
    console.log('🗑️ [clearAllUserData] Usuario y token limpiados');

    // Limpiar TODAS las direcciones (CRÍTICO para logout)
    localStorage.removeItem('checkout-address');
    localStorage.removeItem('imagiq_default_address');
    console.log('🗑️ [clearAllUserData] Todas las direcciones limpiadas');

    // Limpiar TODO el caché de candidateStores
    const cacheKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('global_can_pick_up_') ||
        key.includes('candidate_stores') ||
        key.includes('canPickUp_')
      )) {
        cacheKeys.push(key);
      }
    }

    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ [clearAllUserData] Caché limpiado:', key);
    });

    // Limpiar otros datos específicos del usuario
    localStorage.removeItem('checkout-delivery-method');
    localStorage.removeItem('checkout-document');
    console.log('🗑️ [clearAllUserData] Datos de checkout limpiados');

    console.log('✅ [clearAllUserData] Logout completo - TODOS los datos limpiados');
  } catch (error) {
    console.error('❌ [clearAllUserData] Error en logout:', error);
  }
}
