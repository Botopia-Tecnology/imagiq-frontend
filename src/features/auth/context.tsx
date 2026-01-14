"use client";
/**
 * Context de Autenticación
 * - Provider para el estado global de auth
 * - Persistencia del token en localStorage/cookies
 * - Renovación automática de tokens
 * - Protección de rutas privadas
 * - Integración con PostHog para user identification
 */


import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import { User } from "@/types/user";
import { addressesService } from "@/services/addresses.service";
import { setPosthogUserId, posthogUtils } from "@/lib/posthogClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  hasRole: (role: number | number[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const loadSession = async () => {
      console.log('🔄 [AuthContext] loadSession iniciado...');
      const savedUser = localStorage.getItem("imagiq_user");
      const savedToken = localStorage.getItem("imagiq_token");

      console.log('🔍 [AuthContext] loadSession datos:', {
        hasUser: !!savedUser,
        hasToken: !!savedToken,
        tokenLength: savedToken?.length || 0
      });

      // Validar token: debe existir, no estar vacío, y tener formato JWT (3 partes separadas por punto)
      const isTokenValid =
        savedToken &&
        typeof savedToken === "string" &&
        savedToken.split(".").length === 3;

      console.log('🔐 [AuthContext] Token validation:', { isTokenValid });

      if (savedUser && isTokenValid) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          apiClient.setAuthToken(savedToken!);

          // ✅ NUEVO: Cargar dirección predeterminada si no está en localStorage
          const existingAddress = localStorage.getItem('checkout-address');
          if (!existingAddress || existingAddress === 'null' || existingAddress === 'undefined') {
            try {
              console.log('🔄 [AuthContext] Cargando dirección predeterminada al restaurar sesión...');
              const defaultAddress = await addressesService.getDefaultAddress("ENVIO");
              
              if (defaultAddress) {
                console.log('✅ [AuthContext] Dirección predeterminada encontrada:', defaultAddress.nombreDireccion);
                
                // Convertir Address a formato de checkout-address (Direccion con snake_case)
                const checkoutAddress = {
                  id: defaultAddress.id,
                  usuario_id: defaultAddress.usuarioId,
                  email: userData.email || '',
                  nombreDireccion: defaultAddress.nombreDireccion,
                  linea_uno: defaultAddress.lineaUno || defaultAddress.direccionFormateada,
                  codigo_dane: defaultAddress.codigo_dane,
                  ciudad: defaultAddress.ciudad,
                  departamento: defaultAddress.departamento || '',
                  pais: defaultAddress.pais || 'Colombia',
                  esPredeterminada: defaultAddress.esPredeterminada || false,
                  // Campos adicionales que pueden ser útiles
                  googlePlaceId: defaultAddress.googlePlaceId,
                  direccionFormateada: defaultAddress.direccionFormateada,
                  latitud: defaultAddress.latitud,
                  longitud: defaultAddress.longitud,
                };
                
                // Guardar en localStorage
                localStorage.setItem('checkout-address', JSON.stringify(checkoutAddress));
                localStorage.setItem('imagiq_default_address', JSON.stringify(checkoutAddress));
                
                console.log('✅ [AuthContext] Dirección guardada en localStorage');
                
                // Disparar evento para que los componentes se enteren
                window.dispatchEvent(new Event('address-changed'));
              } else {
                console.log('⚠️ [AuthContext] Usuario no tiene dirección predeterminada');
              }
            } catch (error) {
              console.error('❌ [AuthContext] Error cargando dirección predeterminada:', error);
            }
          }
        } catch (error) {
          console.error("Error parsing saved user data:", error);
          console.log('🗑️ [AuthContext] Limpiando token por error de parsing');
          localStorage.removeItem("imagiq_token");
          setUser(null);
        }
      } else {
        // Si el token no es válido, limpiar sesión
        console.log('🗑️ [AuthContext] Limpiando sesión - token inválido o usuario faltante');
        localStorage.removeItem("imagiq_token");
        setUser(null);
      }
      setIsLoading(false);
      console.log('✅ [AuthContext] loadSession completado');
    };

    loadSession();
  }, []);

  // Login function
  const login = async (userData: User) => {
    // CRÍTICO: Limpiar datos del usuario anterior ANTES de guardar el nuevo
    try {
      const { clearPreviousUserData } = await import('@/app/carrito/utils/getUserId');
      console.log('🧹 [AuthContext] Limpiando datos de usuario anterior...');
      clearPreviousUserData();
      console.log('✅ [AuthContext] Datos anteriores limpiados');
    } catch (error) {
      console.error('❌ [AuthContext] Error limpiando datos anteriores:', error);
    }

    setUser(userData);
    localStorage.setItem("imagiq_user", JSON.stringify(userData));

    // IMPORTANTE: Guardar userId de forma consistente
    try {
      const { saveUserId } = await import('@/app/carrito/utils/getUserId');
      saveUserId(userData.id, userData.email, false); // false = no limpiar de nuevo
      console.log('✅ [AuthContext] UserId guardado de forma consistente:', userData.id);
    } catch (error) {
      console.error('❌ [AuthContext] Error guardando userId:', error);
    }

    // Set token in API client if available
    const token = localStorage.getItem("imagiq_token");
    if (token) {
      apiClient.setAuthToken(token);
    }

    // Disparar evento para que los componentes recalculen con el nuevo userId
    const userRole = userData.role ?? (userData as User & { rol?: number }).rol;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('user-changed', {
        detail: { userId: userData.id, role: userRole, email: userData.email }
      }));
      console.log('📡 [AuthContext] Evento user-changed disparado:', { userId: userData.id, role: userRole });
    }

    // Identify user in PostHog
    setPosthogUserId(userData.id);

    // ✅ NUEVO: Cargar dirección predeterminada del usuario
    try {
      console.log('🔄 [AuthContext] Cargando dirección predeterminada del usuario...');
      const defaultAddress = await addressesService.getDefaultAddress("ENVIO");
      
      if (defaultAddress) {
        console.log('✅ [AuthContext] Dirección predeterminada encontrada:', defaultAddress.nombreDireccion);
        
        // Convertir Address a formato de checkout-address (Direccion con snake_case)
        const checkoutAddress = {
          id: defaultAddress.id,
          usuario_id: defaultAddress.usuarioId,
          email: userData.email || '',
          nombreDireccion: defaultAddress.nombreDireccion,
          linea_uno: defaultAddress.lineaUno || defaultAddress.direccionFormateada,
          codigo_dane: defaultAddress.codigo_dane,
          ciudad: defaultAddress.ciudad,
          departamento: defaultAddress.departamento || '',
          pais: defaultAddress.pais || 'Colombia',
          esPredeterminada: defaultAddress.esPredeterminada || false,
          // Campos adicionales que pueden ser útiles
          googlePlaceId: defaultAddress.googlePlaceId,
          direccionFormateada: defaultAddress.direccionFormateada,
          latitud: defaultAddress.latitud,
          longitud: defaultAddress.longitud,
        };
        
        // Guardar en localStorage
        localStorage.setItem('checkout-address', JSON.stringify(checkoutAddress));
        localStorage.setItem('imagiq_default_address', JSON.stringify(checkoutAddress));
        
        console.log('✅ [AuthContext] Dirección guardada en localStorage');
        
        // Disparar evento para que los componentes se enteren
        window.dispatchEvent(new Event('address-changed'));
      } else {
        console.log('⚠️ [AuthContext] Usuario no tiene dirección predeterminada');
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error cargando dirección predeterminada:', error);
      // No lanzar error, solo loguear. El usuario puede agregar dirección después
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 [AuthContext] Cerrando sesión...');
    
    // Reset PostHog user session
    posthogUtils.reset();
    
    setUser(null);

    // CRÍTICO: Usar función especializada para logout que limpia TODO
    try {
      import('@/app/carrito/utils/getUserId').then(({ clearAllUserData }) => {
        clearAllUserData();
      });
    } catch (error) {
      console.error('❌ [AuthContext] Error importando clearAllUserData:', error);
    }

    // IMPORTANTE: Preservar solo datos que NO son específicos del usuario
    const VERSION_KEY = "app_version";
    const CONSENT_KEY = "imagiq_consent";
    const LOCATION_PERMISSION_KEY = "imagiq_location_permission";
    const CART_KEY = "cart-items"; // ← Carrito debe persistir entre usuarios
    const FAVORITES_KEY = "imagiq_favorites"; // ← Favoritos deben persistir

    // Guardar datos que deben persistir
    const appVersion = localStorage.getItem(VERSION_KEY);
    const userConsent = localStorage.getItem(CONSENT_KEY);
    const locationPermission = localStorage.getItem(LOCATION_PERMISSION_KEY);
    const cartItems = localStorage.getItem(CART_KEY);
    const favorites = localStorage.getItem(FAVORITES_KEY);

    // Limpiar COMPLETAMENTE localStorage
    console.log('🗑️ [AuthContext] Limpieza completa de localStorage...');
    localStorage.clear();

    // Restaurar solo datos que deben persistir
    if (appVersion) localStorage.setItem(VERSION_KEY, appVersion);
    if (userConsent) localStorage.setItem(CONSENT_KEY, userConsent);
    if (locationPermission) localStorage.setItem(LOCATION_PERMISSION_KEY, locationPermission);
    if (cartItems) {
      localStorage.setItem(CART_KEY, cartItems);
      console.log('✅ [AuthContext] Carrito preservado');
    }
    if (favorites) {
      localStorage.setItem(FAVORITES_KEY, favorites);
      console.log('✅ [AuthContext] Favoritos preservados');
    }

    apiClient.removeAuthToken();

    console.log('✅ [AuthContext] Logout completo - usuario deslogueado, direcciones limpiadas, carrito preservado');

    // Disparar eventos para que componentes se actualicen
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("localStorageChange"));
    window.dispatchEvent(new CustomEvent('user-logout', {
      detail: { timestamp: Date.now() }
    }));
    console.log('📡 [AuthContext] Eventos de logout disparados');
  };

  // Role checking utilities
  const hasRole = (roles: number | number[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(Number(user.role));
  };

  const isAdmin = () => {
    return hasRole([1, 4]);
  };

  const isSuperAdmin = () => {
    return hasRole(4);
  };

  /**
   * Solo se considera autenticado si existe usuario y el token es válido
   */
  const savedToken =
    typeof window !== "undefined" ? localStorage.getItem("imagiq_token") : null;
  const isTokenValidBool = !!(
    savedToken &&
    typeof savedToken === "string" &&
    savedToken.split(".").length === 3
  );
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && isTokenValidBool,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
