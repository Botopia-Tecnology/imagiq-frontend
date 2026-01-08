"use client";
import Step3 from "../Step3";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";
import { 
  getFullCandidateStoresResponseFromCache,
  buildGlobalCanPickUpKey 
} from "../utils/globalCanPickUpCache";

/**
 * Verifica si existe un caché válido de candidate-stores para el usuario
 * Esto es CRÍTICO antes de permitir acceso al Step3
 */
function checkCandidateStoresCache(userId: string): boolean {
  try {
    console.log('🔍 [checkCandidateStoresCache] Iniciando validación para userId:', userId);
    
    // Obtener productos del carrito - MULTIPLE SOURCES
    let products: Array<{ sku: string; quantity: number }> = [];
    
    // Intento 1: imagiq_cart (formato nuevo)
    const cartStr = localStorage.getItem("imagiq_cart");
    if (cartStr && cartStr !== 'null' && cartStr !== 'undefined') {
      try {
        const cart = JSON.parse(cartStr);
        products = cart.products || cart || [];
      } catch (e) {
        console.warn("⚠️ [checkCandidateStoresCache] Error parseando imagiq_cart:", e);
      }
    }
    
    // Intento 2: cart (formato antiguo)
    if (products.length === 0) {
      const oldCartStr = localStorage.getItem("cart");
      if (oldCartStr && oldCartStr !== 'null' && oldCartStr !== 'undefined') {
        try {
          const oldCart = JSON.parse(oldCartStr);
          products = oldCart.products || oldCart || [];
        } catch (e) {
          console.warn("⚠️ [checkCandidateStoresCache] Error parseando cart:", e);
        }
      }
    }
    
    if (products.length === 0) {
      console.warn("⚠️ [checkCandidateStoresCache] Carrito vacío o no encontrado");
      // Si no hay productos pero es usuario autenticado, permitir acceso
      // El Step3 mostrará mensaje apropiado
      return true;
    }

    console.log(`📦 [checkCandidateStoresCache] Productos en carrito: ${products.length}`);

    // Obtener dirección actual
    const addressStr = localStorage.getItem("checkout-address");
    if (!addressStr || addressStr === 'null' || addressStr === 'undefined') {
      console.warn("⚠️ [checkCandidateStoresCache] No hay dirección");
      // Si no hay dirección pero es usuario autenticado, permitir de todas formas
      // porque puede seleccionar dirección en Step3
      return true;
    }

    const address = JSON.parse(addressStr);
    const addressId = address.id;
    
    console.log(`📍 [checkCandidateStoresCache] Dirección ID: ${addressId}`);

    // Construir la clave de caché
    const productsToCheck = products.map((p: { sku: string; quantity: number }) => ({
      sku: p.sku,
      quantity: p.quantity,
    }));
    
    const cacheKey = buildGlobalCanPickUpKey({
      userId,
      products: productsToCheck,
      addressId: addressId || null,
    });

    console.log(`🔑 [checkCandidateStoresCache] Cache key: ${cacheKey}`);

    // Verificar si existe el caché
    const cachedResponse = getFullCandidateStoresResponseFromCache(cacheKey);
    
    if (cachedResponse) {
      console.log("✅ [checkCandidateStoresCache] Caché válido encontrado:", {
        canPickUp: cachedResponse.canPickUp,
        hasStores: !!cachedResponse.stores,
        storesCount: Object.keys(cachedResponse.stores || {}).length
      });
      return true;
    }

    // Si no hay caché pero hay productos y dirección, intentar buscar cualquier caché relacionado
    // Esto es un fallback para casos edge
    const allCacheKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('global_canPickUp_') && key.includes(userId)
    );
    
    if (allCacheKeys.length > 0) {
      console.log(`🔄 [checkCandidateStoresCache] Encontrados ${allCacheKeys.length} cachés relacionados, permitiendo acceso`);
      return true;
    }

    console.warn("⚠️ [checkCandidateStoresCache] No se encontró caché válido");
    return false;
  } catch (error) {
    console.error("❌ [checkCandidateStoresCache] Error:", error);
    // En caso de error, permitir acceso (fail-safe)
    return true;
  }
}

export default function Step3Page() {
  const router = useRouter();
  const [, /* loggedUser */] = useSecureStorage<User | null>("imagiq_user", null);
  const [isChecking, setIsChecking] = useState(true);
  const checkExecuted = useRef(false);

  // Protección: Solo permitir acceso si hay usuario logueado (invitado o regular con token)
  useEffect(() => {
    // Prevenir múltiples ejecuciones
    if (checkExecuted.current) {
      return;
    }

    const performCheck = () => {
      checkExecuted.current = true;

      const token = localStorage.getItem("imagiq_token");
      
      // Intentar obtener usuario desde localStorage directamente (más confiable)
      let userToCheck = null;
      try {
        const userInfo = localStorage.getItem("imagiq_user");
        if (userInfo) {
          userToCheck = JSON.parse(userInfo);
        }
      } catch {
        userToCheck = null;
      }
      
      console.log("🔍 [STEP3] Verificando acceso:", { 
        hasToken: !!token, 
        hasUser: !!userToCheck,
        userRol: userToCheck ? ((userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role) : null,
        userEmail: userToCheck?.email
      });

      // CASO 1: Usuario autenticado con token (rol 2 o rol 3) - SIEMPRE permitir acceso
      // Step3 es para TODOS los usuarios autenticados, pueden agregar/seleccionar dirección aquí
      if (token && userToCheck) {
        const userRole = (userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role;
        
        // 🚨 CRÍTICO: Verificar que exista caché de candidate-stores antes de permitir acceso
        const hasCandidateStoresCache = checkCandidateStoresCache(userToCheck.id);
        
        if (!hasCandidateStoresCache) {
          console.error("❌ [STEP3] No hay caché de candidate-stores, redirigiendo a step1");
          router.push("/carrito/step1");
          return;
        }
        
        console.log(`✅ [STEP3] Usuario autenticado (rol ${userRole}) con token y caché válido, permitiendo acceso`);
        setIsChecking(false);
        return;
      }

      // CASO 2: Usuario invitado sin token pero CON dirección agregada en step2
      // Permitir acceso si hay checkout-address (ya completó step2)
      // IMPORTANTE: También verificar imagiq_default_address como fallback
      let savedAddress = localStorage.getItem("checkout-address");
      
      // Si no hay checkout-address, intentar usar imagiq_default_address
      if (!savedAddress || savedAddress === "null" || savedAddress === "undefined") {
        console.log("⚠️ [STEP3] No hay checkout-address, intentando con imagiq_default_address...");
        const defaultAddress = localStorage.getItem("imagiq_default_address");
        if (defaultAddress && defaultAddress !== "null" && defaultAddress !== "undefined") {
          // Copiar imagiq_default_address a checkout-address
          localStorage.setItem("checkout-address", defaultAddress);
          savedAddress = defaultAddress;
          console.log("✅ [STEP3] imagiq_default_address copiado a checkout-address");
        }
      }
      
      if (savedAddress && savedAddress !== "null" && savedAddress !== "undefined") {
        try {
          const address = JSON.parse(savedAddress);
          // Validar que tenga los campos mínimos (ciudad y linea_uno)
          if (address && address.ciudad && address.linea_uno) {
            console.log("✅ [STEP3] Usuario invitado con dirección válida en checkout-address, permitiendo acceso");
            console.log("📍 Dirección:", { ciudad: address.ciudad, linea_uno: address.linea_uno });
            setIsChecking(false);
            return;
          } else {
            console.warn("⚠️ [STEP3] checkout-address existe pero no tiene campos válidos:", address);
          }
        } catch (err) {
          console.error("❌ [STEP3] Error al parsear checkout-address:", err);
        }
      } else {
        console.log("⚠️ [STEP3] No hay checkout-address válido");
      }

      // CASO 3: Sin sesión activa Y sin dirección - redirigir a step2
      console.warn("⚠️ [STEP3] No hay sesión activa ni dirección. Redirigiendo a step2...");
      router.push("/carrito/step2");
    };

    performCheck();
  }, [router]);

  const handleBack = () => router.push("/carrito/step1");
  const handleNext = () => router.push("/carrito/step4");

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <Step3 onBack={handleBack} onContinue={handleNext} />;
}
