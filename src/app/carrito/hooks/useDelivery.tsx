"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Direccion } from "@/types/user";
import { addressesService } from "@/services/addresses.service";
import type { Address } from "@/types/address";
import { safeGetLocalStorage } from "@/lib/localStorage";
import type { FormattedStore } from "@/types/store";
import {
  productEndpoints,
  type CandidateStore,
  type CandidateStoresResponse,
  type ApiResponse,
} from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import {
  buildGlobalCanPickUpKey,
  getFullCandidateStoresResponseFromCache,
  setGlobalCanPickUpCache,
} from "../utils/globalCanPickUpCache";

/**
 * Helper para convertir Address a Direccion (legacy)
 */
const addressToDireccion = (address: Address): Direccion => {
  return {
    id: address.id,
    usuario_id: address.usuarioId,
    email: "", // Se llenará del localStorage si es necesario
    linea_uno: address.direccionFormateada,
    codigo_dane: address.codigo_dane, // Backend lo llena
    ciudad: address.ciudad || "",
    pais: address.pais,
    esPredeterminada: address.esPredeterminada,
  };
};

/**
 * Normaliza texto removiendo acentos y convirtiendo a minúsculas
 * Esto permite buscar "Bogota" y encontrar "Bogotá"
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, ""); // Remueve diacríticos (acentos)
};

/**
 * Convierte CandidateStore a FormattedStore directamente desde el endpoint candidate-stores
 * NO valida con ningún otro endpoint, usa directamente los datos del endpoint
 */
const candidateStoreToFormattedStore = (
  candidateStore: CandidateStore,
  city: string
): FormattedStore => {
  // Convertir codDane a número
  let codDane: number;
  if (candidateStore.codDane) {
    if (typeof candidateStore.codDane === "string") {
      codDane = Number.parseInt(candidateStore.codDane, 10);
    } else {
      codDane = candidateStore.codDane;
    }
  } else {
    codDane = 0;
  }

  // Extraer código numérico del codBodega
  const codigo = Number.parseInt(candidateStore.codBodega.replaceAll(/\D/g, ''), 10) || 0;

  // Extraer teléfono y extensión si están disponibles
  const telefono = candidateStore.telefono || "";
  const extension = candidateStore.extension || "";

  // Crear FormattedStore directamente con los datos del endpoint
  return {
    codigo: codigo,
    descripcion: candidateStore.nombre_tienda.trim(),
    departamento: city, // Usar la ciudad como departamento
    ciudad: city, // IMPORTANTE: Usar el parámetro city (key del objeto) para consistencia en filtros
    direccion: candidateStore.direccion,
    place_ID: candidateStore.place_ID,
    ubicacion_cc: "", // No viene en el endpoint candidate-stores
    horario: candidateStore.horario,
    telefono: telefono,
    extension: extension,
    email: "", // No viene en el endpoint candidate-stores
    codBodega: candidateStore.codBodega,
    codDane: codDane,
    latitud: 0, // No viene en el endpoint candidate-stores
    longitud: 0, // No viene en el endpoint candidate-stores
    position: [0, 0], // No viene en el endpoint candidate-stores
    stock: candidateStore.stock, // Stock disponible en la tienda
  };
};

export const useDelivery = () => {
  const [address, setAddress] = useState<Direccion | null>(null);
  const [addressEdit, setAddressEdit] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");
  const [stores, setStores] = useState<FormattedStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<FormattedStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<FormattedStore | null>(
    null
  );
  const [addresses, setAddresses] = useState<Direccion[]>([]);
  const [canPickUp, setCanPickUp] = useState<boolean>(true); // Estado para saber si se puede recoger en tienda
  const [addressLoading, setAddressLoading] = useState(false); // Estado para mostrar skeleton al recargar dirección
  const [availableCities, setAvailableCities] = useState<string[]>([]); // Ciudades donde hay tiendas disponibles
  const [availableStoresWhenCanPickUpFalse, setAvailableStoresWhenCanPickUpFalse] = useState<FormattedStore[]>([]); // Tiendas disponibles cuando canPickUp es false
  const [lastResponse, setLastResponse] = useState<ApiResponse<CandidateStoresResponse> | null>(null); // DEBUG: Estado para guardar la última respuesta

  // Ref para prevenir llamadas infinitas a fetchCandidateStores
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const lastAddressIdRef = useRef<string | null>(null); // Para rastrear última dirección procesada
  const lastAddressIdProcessedRef = useRef<string | null>(null); // Última dirección para la que se hizo petición
  const lastAddressFetchTimeRef = useRef<number>(0); // Tiempo de última petición por dirección
  const lastAddressForStoreSelectionRef = useRef<string | null>(null); // Última dirección cuando se seleccionó la tienda
  const isRemovingTradeInRef = useRef(false); // Para prevenir llamadas durante eliminación de trade-in
  const failedRequestHashRef = useRef<string | null>(null); // Hash de la última petición que falló
  const lastSuccessfulHashRef = useRef<string | null>(null); // Hash de la última petición exitosa
  const retryCountRef = useRef<Map<string, number>>(new Map()); // Contador de reintentos por hash de petición
  const processingAddressChangeRef = useRef<string | null>(null); // Dirección que se está procesando actualmente
  const lastAddressChangeProcessedTimeRef = useRef<number>(0); // Timestamp del último cambio de dirección procesado
  const retry429CountRef = useRef(0); // Contador de reintentos por error 429

  // Flag global compartido para evitar procesar el mismo cambio desde múltiples listeners
  // Se usa en window para que sea compartido entre todos los componentes
  if (typeof globalThis.window !== 'undefined' && !(globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing) {
    (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing = undefined;
  }

  // Cargar método de entrega desde localStorage al inicio
  const [deliveryMethod, setDeliveryMethodState] = useState<string>(() => {
    if (globalThis.window === undefined) return "domicilio";
    return globalThis.window.localStorage.getItem("checkout-delivery-method") || "domicilio";
  });

  // Wrapper para setDeliveryMethod que también guarda en localStorage
  const setDeliveryMethod = (method: string) => {
    // Validar que el método sea válido
    if (method !== "tienda" && method !== "domicilio") {
      console.error(`⚠️ Método de entrega inválido: ${method}. Usando "domicilio" por defecto.`);
      method = "domicilio";
    }

    setDeliveryMethodState(method);

    // Guardar en localStorage inmediatamente (importante para usuarios invitados)
    if (typeof globalThis.window !== "undefined") {
      try {
        globalThis.window.localStorage.setItem("checkout-delivery-method", method);
        // Disparar evento personalizado para notificar cambios
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", { detail: { method } })
        );
        // También disparar evento storage para compatibilidad
        globalThis.window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error("Error al guardar método de entrega en localStorage:", error);
      }
    }
  };

  const [storesLoading, setStoresLoading] = useState(true);
  const { products } = useCart();

  // Cargar método de entrega desde localStorage cuando se monta el componente
  // También escuchar cambios en localStorage para sincronizar entre componentes
  useEffect(() => {
    if (globalThis.window === undefined) return;

    const updateFromStorage = () => {
      const savedMethod = globalThis.window.localStorage.getItem("checkout-delivery-method");
      if (
        savedMethod &&
        (savedMethod === "tienda" || savedMethod === "domicilio")
      ) {
        setDeliveryMethodState((current) => {
          // Solo actualizar si el valor cambió
          if (current !== savedMethod) {
            return savedMethod;
          }
          return current;
        });
      }
    };

    // Cargar al montar
    updateFromStorage();

    // Escuchar cambios en localStorage (solo entre pestañas, no en la misma pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      // Solo actualizar si el cambio viene de otra pestaña
      if (e.key === "checkout-delivery-method") {
        updateFromStorage();
      }
    };
    globalThis.window.addEventListener("storage", handleStorageChange);

    // Escuchar evento personalizado (para cambios en la misma pestaña)
    const handleDeliveryMethodChanged = () => {
      updateFromStorage();
    };
    globalThis.window.addEventListener("delivery-method-changed", handleDeliveryMethodChanged);

    return () => {
      globalThis.window?.removeEventListener("storage", handleStorageChange);
      globalThis.window?.removeEventListener("delivery-method-changed", handleDeliveryMethodChanged);
    };
  }, []);

  // Función para cargar tiendas candidatas
  // Llama al endpoint con TODOS los productos agrupados para obtener canPickUp global y sus tiendas
  const fetchCandidateStores = useCallback(async () => {
    console.log('🚀🚀🚀 INICIO fetchCandidateStores - FUNCIÓN LLAMADA');

    // PROTECCIÓN CRÍTICA: NO hacer peticiones durante eliminación de trade-in
    if (isRemovingTradeInRef.current) {
      console.log('❌ Abortando: isRemovingTradeInRef.current = true');
      return;
    }

    // Prevenir llamadas múltiples simultáneas
    if (isFetchingRef.current) {
      console.log('❌ Abortando: isFetchingRef.current = true (ya hay una petición en curso)');
      return;
    }

    // Prevenir llamadas muy frecuentes (debounce de 3000ms para evitar 429)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 3000) {
      console.log('⏸️ Debounce activo: esperando antes de hacer otra petición a candidate-stores');
      console.log(`   Tiempo desde última petición: ${now - lastFetchTimeRef.current}ms (necesita >= 3000ms)`);
      return;
    }

    console.log('✅ Pasó todas las verificaciones, continuando con fetchCandidateStores');

    // Obtener user_id PRIMERO (antes de activar loading)
    const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
      "imagiq_user",
      {}
    );
    const userId = user?.id || user?.user_id;

    console.log('👤 User ID obtenido:', userId, '| Productos count:', products.length);

    if (!userId || products.length === 0) {
      console.log('❌ Sin user_id o sin productos, abortando fetchCandidateStores');
      setStores([]);
      setFilteredStores([]);
      setCanPickUp(false);
      setStoresLoading(false);
      isFetchingRef.current = false;
      return;
    }

    // Preparar TODOS los productos del carrito para una sola petición
    const productsToCheck = products.map((p) => ({
      sku: p.sku,
      quantity: p.quantity,
    }));

    console.log('📦 Productos a verificar:', productsToCheck);

    // Obtener dirección actual desde localStorage para incluirla en el hash
    let currentAddressId = lastAddressIdRef.current || '';
    try {
      const savedAddress = globalThis.window?.localStorage.getItem("checkout-address");
      if (savedAddress) {
        const parsed = JSON.parse(savedAddress) as Direccion;
        if (parsed.id) {
          currentAddressId = parsed.id;
          // Actualizar lastAddressIdRef si cambió
          if (lastAddressIdRef.current !== parsed.id) {
            lastAddressIdRef.current = parsed.id;
          }
        }
      }
    } catch (error) {
      console.error('Error al leer dirección para hash:', error);
    }

    // CRÍTICO: Intentar leer del caché ANTES de activar storesLoading
    // Esto evita skeleton cuando se cambia a "recoger en tienda"
    const cacheKey = buildGlobalCanPickUpKey({
      userId,
      products: productsToCheck,
      addressId: currentAddressId || null,
    });
    const cachedResponse = getFullCandidateStoresResponseFromCache(cacheKey);

      // Si hay datos en caché, usarlos INMEDIATAMENTE sin activar skeleton
    if (cachedResponse) {
      console.log('✅✅✅ Datos encontrados en caché, usando respuesta cacheada SIN activar skeleton');
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      // NO activar setStoresLoading(true) aquí - los datos ya están listos

      // Procesar respuesta cacheada exactamente igual que si viniera del endpoint
      const responseData = cachedResponse;
      const globalCanPickUp = responseData.canPickUp ?? false;

      // Procesar tiendas desde la respuesta cacheada
      let physicalStores: FormattedStore[] = [];
      const cities: string[] = Object.keys(responseData.stores || {}).filter(city => {
        const cityStores = responseData.stores?.[city];
        return cityStores && cityStores.length > 0;
      });

      if (responseData.stores) {
        const allStoresInOrder: Array<{ store: CandidateStore; city: string }> = [];
        for (const [city, cityStores] of Object.entries(responseData.stores)) {
          if (cityStores && cityStores.length > 0) {
            for (const store of cityStores) {
              allStoresInOrder.push({ store, city: city });
            }
          }
        }

        if (allStoresInOrder.length > 0) {
          const validStores = allStoresInOrder.map(
            ({ store, city }) => candidateStoreToFormattedStore(store, city)
          );

          // Filtrar centros de distribución y bodegas
          physicalStores = validStores.filter((store) => {
            const descripcion = normalizeText(store.descripcion);
            const codigo = store.codigo?.toString().trim() || "";
            const isValid = !descripcion.includes("centro de distribucion") &&
              !descripcion.includes("centro distribucion") &&
              !descripcion.includes("bodega") &&
              codigo !== "001";
            return isValid;
          });
        }
      }

      // Establecer estados inmediatamente desde caché (sin skeleton)
      setCanPickUp(globalCanPickUp);
      setAvailableCities(cities);

      if (globalCanPickUp) {
        const firstCity = cities.length > 0 ? cities[0] : null;
        const storesToShow = firstCity
          ? physicalStores.filter(store => store.ciudad === firstCity)
          : physicalStores;
        setStores(storesToShow);
        setFilteredStores([...storesToShow]);
        setAvailableStoresWhenCanPickUpFalse(storesToShow);
      } else {
        setAvailableStoresWhenCanPickUpFalse(physicalStores);
        setStores([]);
        setFilteredStores([]);
      }

      // NO mostrar skeleton, datos ya están listos
      setStoresLoading(false);
      isFetchingRef.current = false;
      setLastResponse({ success: true, data: cachedResponse });
      return; // Salir sin hacer petición al endpoint
    }

    // Si NO hay datos en caché, entonces SÍ hacer la petición al endpoint
    // Ahora SÍ activar storesLoading porque vamos a hacer una petición real
    try {
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setStoresLoading(true);

      // Crear hash único de la petición (productos + userId + dirección)
      const requestHash = JSON.stringify({
        products: productsToCheck,
        userId,
        addressId: currentAddressId,
      });

      // Si el hash es el mismo que la última petición exitosa, no hacer nada
      // PERO solo si la dirección no cambió recientemente
      if (lastSuccessfulHashRef.current === requestHash) {
        // Verificar si la dirección cambió desde la última petición exitosa
        const addressChanged = lastAddressIdRef.current !== lastAddressIdProcessedRef.current;
        if (!addressChanged) {
          setStoresLoading(false);
          isFetchingRef.current = false;
          return;
        }
        // Si la dirección cambió, limpiar el hash exitoso para forzar nueva petición
        lastSuccessfulHashRef.current = null;
      }

      // Llamar al endpoint con TODOS los productos agrupados
      console.log('🌐 Llamando al endpoint getCandidateStores con:', {
        products: productsToCheck,
        user_id: userId,
      });

      const response = await productEndpoints.getCandidateStores({
        products: productsToCheck,
        user_id: userId,
      });

      setLastResponse(response); // DEBUG: Guardar respuesta cruda

      console.log('🔥🔥🔥 RESPUESTA RECIBIDA DE CANDIDATE-STORES:', {
        success: response.success,
        hasData: !!response.data,
        message: response.message,
      });

      // Log completo en formato legible
      console.log('📋 RESPUESTA COMPLETA:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        const responseData = response.data;

        console.log('🔥 DATOS DE LA RESPUESTA:', {
          canPickUp: responseData.canPickUp,
          storesType: typeof responseData.stores,
          storesIsArray: Array.isArray(responseData.stores),
          storesKeys: responseData.stores ? Object.keys(responseData.stores) : 'NO STORES',
          fullStoresData: responseData.stores,
        });

        // Obtener canPickUp global de la respuesta
        const globalCanPickUp = responseData.canPickUp ?? false;

        // Procesar tiendas INMEDIATAMENTE (sin delays) - PRESERVAR ORDEN EXACTO DEL ENDPOINT
        let physicalStores: FormattedStore[] = [];
        const cities: string[] = Object.keys(responseData.stores || {}).filter(city => {
          const cityStores = responseData.stores?.[city];
          return cityStores && cityStores.length > 0;
        });

        console.log('📦 Procesando respuesta candidate-stores:', {
          canPickUp: globalCanPickUp,
          cities: cities,
          storesKeys: Object.keys(responseData.stores || {}),
          storesData: responseData.stores,
        });

        if (responseData.stores) {
          // IMPORTANTE: Preservar el orden exacto de las tiendas como vienen del endpoint
          // Recorrer las ciudades en el orden que vienen del endpoint
          const allStoresInOrder: Array<{ store: CandidateStore; city: string }> = [];

          for (const [city, cityStores] of Object.entries(responseData.stores)) {
            if (cityStores && cityStores.length > 0) {
              console.log(`🏙️ Procesando ciudad ${city} con ${cityStores.length} tiendas`);
              // Agregar las tiendas en el orden exacto que vienen del endpoint
              for (const store of cityStores) {
                // IMPORTANTE: Usar la ciudad de la KEY del objeto, no store.ciudad
                // Porque store.ciudad puede tener formato diferente
                allStoresInOrder.push({ store, city: city });
                console.log(`  ✅ Tienda encontrada: ${store.nombre_tienda} (${store.codBodega}) en ${city}`);
              }
            }
          }

          console.log(`🛍️ Total de tiendas a procesar: ${allStoresInOrder.length}`);

          if (allStoresInOrder.length > 0) {
            // Convertir CandidateStore a FormattedStore directamente (sin validar con otro endpoint)
            // PRESERVAR EL ORDEN EXACTO
            const validStores = allStoresInOrder.map(
              ({ store, city }) => candidateStoreToFormattedStore(store, city)
            );

            console.log(`✅ Tiendas convertidas: ${validStores.length}`);
            console.log(`📋 Todas las tiendas ANTES del filtro:`, validStores.map(s => ({ nombre: s.descripcion, codigo: s.codigo })));

            // Filtrar centros de distribución y bodegas (pero mantener el orden)
            physicalStores = validStores.filter((store) => {
              const descripcion = normalizeText(store.descripcion);
              const codigo = store.codigo?.toString().trim() || "";

              // Excluir centros de distribución, bodegas, y código "001"
              const isValid = !descripcion.includes("centro de distribucion") &&
                !descripcion.includes("centro distribucion") &&
                !descripcion.includes("bodega") &&
                codigo !== "001";

              if (!isValid) {
                console.log(`🚫 Tienda filtrada: ${store.descripcion} (${codigo}) - Razón: ${descripcion.includes("centro de distribucion") || descripcion.includes("centro distribucion") ? 'Centro de distribución' :
                  descripcion.includes("bodega") ? 'Bodega' :
                    codigo === "001" ? 'Código 001' : 'Desconocida'
                  }`);
              } else {
                console.log(`✅ Tienda ACEPTADA: ${store.descripcion} (${codigo})`);
              }

              return isValid;
            });

            console.log(`🏪 Tiendas físicas finales DESPUÉS del filtro: ${physicalStores.length}`);
            console.log('📋 Tiendas en orden:', physicalStores.map(s => `${s.descripcion} (${s.ciudad})`));
          } else {
            // IMPORTANTE: Si stores existe pero está vacío o no hay tiendas, physicalStores ya está como []
            console.log(`ℹ️ Endpoint respondió con stores vacío o sin tiendas. Total de tiendas: 0`);
          }
        } else {
          // IMPORTANTE: Si responseData.stores no existe o es undefined, también procesar
          console.log(`ℹ️ Endpoint respondió sin campo stores. Estableciendo tiendas vacías.`);
          physicalStores = [];
        }

        // IMPORTANTE: Establecer canPickUp y tiendas AL MISMO TIEMPO (sin delays)
        console.log(`🎯 Estableciendo canPickUp=${globalCanPickUp} y ${physicalStores.length} tiendas`);
        console.log(`📋 Primeras 3 tiendas:`, physicalStores.slice(0, 3).map(s => s.descripcion));

        // Establecer canPickUp primero
        setCanPickUp(globalCanPickUp);
        setAvailableCities(cities);

        // IMPORTANTE: SIEMPRE guardar las tiendas, independientemente de canPickUp
        // Si canPickUp es true, mostrar tiendas normalmente
        if (globalCanPickUp) {
          // IMPORTANTE: Cuando canPickUp es true, solo mostrar tiendas de la PRIMERA ciudad
          // La primera ciudad es la ciudad del usuario (la más cercana)
          const firstCity = cities.length > 0 ? cities[0] : null;
          const storesToShow = firstCity
            ? physicalStores.filter(store => store.ciudad === firstCity)
            : physicalStores;

          console.log(`✅ canPickUp=true: Filtrando tiendas de la primera ciudad (${firstCity})`);
          console.log(`   Total tiendas disponibles: ${physicalStores.length}`);
          console.log(`   Tiendas de ${firstCity}: ${storesToShow.length}`);
          console.log(`   Otras ciudades disponibles:`, cities.slice(1));

          // IMPORTANTE: Establecer stores y filteredStores al mismo tiempo
          setStores(storesToShow);
          // Asegurar que filteredStores se actualice inmediatamente
          setFilteredStores([...storesToShow]);
          // También guardar en availableStoresWhenCanPickUpFalse por si acaso
          setAvailableStoresWhenCanPickUpFalse(storesToShow);
          console.log(`✅ Tiendas establecidas. stores.length=${storesToShow.length}, filteredStores.length=${storesToShow.length}`);
        } else {
          // Si canPickUp global es false, guardar tiendas en availableStoresWhenCanPickUpFalse
          // IMPORTANTE: Estas son las tiendas que vienen de candidate-stores y se mostrarán en el mensaje
          console.log(`⚠️ Guardando ${physicalStores.length} tiendas en availableStoresWhenCanPickUpFalse (canPickUp=false)`);
          console.log(`🔥 TIENDAS A GUARDAR:`, physicalStores.map(s => ({ nombre: s.descripcion, ciudad: s.ciudad, codigo: s.codigo })));
          setAvailableStoresWhenCanPickUpFalse(physicalStores);
          // Limpiar stores normales cuando canPickUp es false
          setStores([]);
          setFilteredStores([]);
          console.log(`✅ Tiendas guardadas en availableStoresWhenCanPickUpFalse para mostrar en mensaje`);
        }

        console.log('🔥🔥🔥 ESTADO FINAL DESPUÉS DE PROCESAR:', {
          globalCanPickUp,
          physicalStoresCount: physicalStores.length,
          citiesCount: cities.length,
        });

        // IMPORTANTE: Guardar respuesta completa en caché para evitar skeleton al cambiar a "tienda"
        setGlobalCanPickUpCache(cacheKey, globalCanPickUp, responseData);

        // Si la petición fue exitosa, marcar el hash como exitoso DESPUÉS de procesar
        lastSuccessfulHashRef.current = requestHash;
        // Resetear contador de reintentos 429
        retry429CountRef.current = 0;
        // Limpiar el hash de fallo si existía
        if (failedRequestHashRef.current === requestHash) {
          failedRequestHashRef.current = null;
          retryCountRef.current.delete(requestHash);
        }

        // IMPORTANTE: NO agregar delays - React procesará los estados de inmediato
        // Las tiendas ya están establecidas en el estado arriba
      } else {
        // Si falla la petición, verificar si es 429 (Too Many Requests)
        const is429Error = response.message?.includes('429') || response.message?.includes('Too Many Requests') || response.message?.includes('ThrottleException');

        console.log('❌ RESPUESTA NO EXITOSA O SIN DATOS:', {
          success: response.success,
          hasData: !!response.data,
          message: response.message,
          is429: is429Error,
        });

        // Si es 429, reintentar después de 3 segundos (máximo 2 reintentos)
        if (is429Error && retry429CountRef.current < 2) {
          retry429CountRef.current += 1;
          console.warn(`⚠️ Error 429 detectado - reintentando en 3 segundos... (intento ${retry429CountRef.current}/2)`);
          setTimeout(() => {
            console.log('🔄 Reintentando después de 429...');
            // Limpiar flags para permitir el reintento
            isFetchingRef.current = false;
            lastFetchTimeRef.current = 0;
            // Reintentar
            fetchCandidateStores();
          }, 3000);
          return; // No establecer estados aún
        } else if (is429Error) {
          console.error('❌ Máximo de reintentos alcanzado para error 429');
          retry429CountRef.current = 0; // Resetear contador
        }

        // Para otros errores, establecer estados vacíos
        setCanPickUp(false);
        setStores([]);
        setFilteredStores([]);
        setAvailableStoresWhenCanPickUpFalse([]);
      }
    } catch (error) {
      // Si hay un error, no hay pickup disponible
      console.error('❌❌❌ ERROR EN fetchCandidateStores:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

      // Verificar si es error de red o 429
      const errorMessage = error instanceof Error ? error.message : String(error);
      const is429Error = errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('ThrottleException');

      if (is429Error && retry429CountRef.current < 2) {
        retry429CountRef.current += 1;
        console.warn(`⚠️ Error 429 en catch - reintentando en 3 segundos... (intento ${retry429CountRef.current}/2)`);
        setTimeout(() => {
          console.log('🔄 Reintentando después de error 429...');
          // Limpiar flags para permitir el reintento
          isFetchingRef.current = false;
          lastFetchTimeRef.current = 0;
          // Reintentar
          fetchCandidateStores();
        }, 3000);
        return; // No establecer estados aún
      } else if (is429Error) {
        console.error('❌ Máximo de reintentos alcanzado para error 429 en catch');
        retry429CountRef.current = 0; // Resetear contador
      }

      setStores([]);
      setFilteredStores([]);
      setAvailableStoresWhenCanPickUpFalse([]);
      setCanPickUp(false);
    } finally {
      setStoresLoading(false);
      isFetchingRef.current = false;
    }
  }, [products]);

  // Cargar tiendas desde candidate-stores (solo donde se puede recoger el producto)
  // Si no hay pickup disponible, cargar TODAS las tiendas
  // PROTECCIÓN: Solo ejecutar una vez al montar o cuando cambian los productos significativamente
  const productsHashRef = useRef<string>('');
  useEffect(() => {
    // Crear un hash de los productos para detectar cambios reales
    const productsHash = JSON.stringify(products.map(p => ({ sku: p.sku, quantity: p.quantity })));

    // Solo ejecutar si realmente cambiaron los productos O es la primera vez
    if (productsHashRef.current === '' || productsHashRef.current !== productsHash) {
      productsHashRef.current = productsHash;

      // Verificar que NO estemos eliminando trade-in
      if (!isRemovingTradeInRef.current) {
        fetchCandidateStores();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]); // Depender de products completo pero con protección de hash

  // Escuchar cambios de dirección (desde header O desde checkout)
  useEffect(() => {
    const handleAddressChange = async (event: Event) => {
      // Prevenir llamadas durante eliminación de trade-in
      if (isRemovingTradeInRef.current) {
        return;
      }

      // Verificar si el evento es realmente de cambio de dirección
      const customEvent = event as CustomEvent;
      const eventType = event.type;

      // Ignorar eventos que no son de dirección
      if (eventType === 'delivery-method-changed' || eventType === 'storage') {
        const key = (event as StorageEvent).key;
        if (key && key !== 'checkout-address' && key !== 'imagiq_default_address') {
          return; // No es un cambio de dirección
        }
      }

      // Verificar si realmente cambió la dirección
      const currentAddress = localStorage.getItem('checkout-address');
      let addressChanged = false;
      let newAddressId: string | null = null;

      if (currentAddress) {
        try {
          const parsed = JSON.parse(currentAddress) as Direccion;
          newAddressId = parsed.id || null;
          // Si la dirección no cambió realmente, no hacer nada
          if (newAddressId === lastAddressIdRef.current) {
            return;
          }
          addressChanged = true;
        } catch {
          // Si no se puede parsear, no hacer nada
          return;
        }
      } else {
        // Si no hay dirección, no hacer nada
        return;
      }

      // PROTECCIÓN CRÍTICA: Evitar procesar el mismo cambio múltiples veces
      // Cuando se disparan múltiples eventos (address-changed, checkout-address-changed, storage)
      // para el mismo cambio de dirección, solo procesar una vez
      const now = Date.now();
      const isProcessingSameAddress = processingAddressChangeRef.current === newAddressId;
      const recentlyProcessed = now - lastAddressChangeProcessedTimeRef.current < 3000; // 3 segundos

      // Verificar flag global compartido
      const globalProcessing = typeof globalThis.window !== 'undefined'
        ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
        : null;
      const isGloballyProcessing = globalProcessing === newAddressId;

      if (isProcessingSameAddress || isGloballyProcessing || (recentlyProcessed && lastAddressIdProcessedRef.current === newAddressId)) {
        // Ya se está procesando este cambio o se procesó recientemente, ignorar
        return;
      }

      // Marcar que estamos procesando este cambio (local y global)
      processingAddressChangeRef.current = newAddressId;
      lastAddressChangeProcessedTimeRef.current = now;
      if (typeof globalThis.window !== 'undefined' && newAddressId !== null) {
        (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing = newAddressId;
      }

      // Verificar si el cambio viene del header
      const fromHeader = customEvent.detail?.fromHeader;

      if (fromHeader) {
        // Mostrar skeleton
        setAddressLoading(true);

        // Esperar un momento para mostrar el skeleton
        await new Promise(resolve => setTimeout(resolve, 300));

        // Leer la nueva dirección de localStorage
        try {
          const saved = JSON.parse(
            globalThis.window.localStorage.getItem("checkout-address") || "{}"
          ) as Direccion;

          if (saved?.id) {
            setAddress(saved);
            lastAddressIdRef.current = saved.id;
            newAddressId = saved.id;
          }
        } catch (error) {
          console.error('❌ Error al leer dirección de localStorage:', error);
        } finally {
          // Ocultar skeleton
          setAddressLoading(false);
        }
      }

      // PROTECCIÓN CRÍTICA: Verificar que NO estemos eliminando trade-in antes de llamar
      if (isRemovingTradeInRef.current) {
        processingAddressChangeRef.current = null;
        return;
      }

      // IMPORTANTE: Solo actualizar lastAddressIdRef si realmente cambió
      if (addressChanged && newAddressId !== null) {
        // PROTECCIÓN CRÍTICA: Solo hacer petición si:
        // 1. Es una dirección diferente a la última procesada
        // 2. O si pasaron más de 2 segundos desde la última petición para esta dirección
        const isDifferentAddress = lastAddressIdProcessedRef.current !== newAddressId;
        const enoughTimePassed = now - lastAddressFetchTimeRef.current > 2000;

        // ACTUALIZAR INMEDIATAMENTE para evitar que otros eventos procesen la misma dirección
        if (isDifferentAddress) {
          lastAddressIdRef.current = newAddressId;
          lastAddressIdProcessedRef.current = newAddressId;
          lastAddressFetchTimeRef.current = now;

          // IMPORTANTE: Limpiar el hash de la última petición exitosa para forzar nueva petición
          // cuando cambia la dirección
          lastSuccessfulHashRef.current = null;

          // IMPORTANTE: Limpiar la tienda seleccionada cuando cambia la dirección
          // porque las tiendas disponibles pueden cambiar
          console.log(`🔄 Dirección cambió a ${newAddressId}, limpiando tienda seleccionada y forzando recarga de tiendas`);
          setSelectedStore(null);
          // También limpiar del localStorage
          if (globalThis.window) {
            globalThis.window.localStorage.removeItem("checkout-store");
            globalThis.window.localStorage.removeItem("checkout-store-address-id");
          }
          // Actualizar el ref para indicar que la dirección cambió
          lastAddressForStoreSelectionRef.current = null;

          // Recalcular canPickUp global y tiendas cuando cambia la dirección
          // El debounce de 8000ms en fetchCandidateStores evitará peticiones múltiples
          fetchCandidateStores();
        } else if (enoughTimePassed) {
          // Si es la misma dirección pero pasó suficiente tiempo, actualizar tiempo pero no hacer petición
          // (ya se hizo una petición recientemente para esta dirección)
          lastAddressFetchTimeRef.current = now;
        }
      }

      // Limpiar el flag de procesamiento después de un delay para permitir que otros cambios se procesen
      setTimeout(() => {
        if (processingAddressChangeRef.current === newAddressId) {
          processingAddressChangeRef.current = null;
        }
        if (typeof globalThis.window !== 'undefined' &&
          (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing === newAddressId) {
          (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing = undefined;
        }
      }, 5000);
    };

    const handleStorageChange = (e: StorageEvent) => {
      // IMPORTANTE: Solo procesar eventos storage REALES (entre tabs)
      // Los eventos storage disparados manualmente desde syncAddress NO tienen newValue/oldValue
      // y NO deben procesarse aquí porque ya se procesaron con los eventos personalizados
      if (e.key === 'checkout-address' || e.key === 'imagiq_default_address') {
        // Solo procesar si es un evento storage REAL (tiene newValue y oldValue)
        // Los eventos storage disparados manualmente no tienen estas propiedades
        if (e.newValue !== undefined && e.oldValue !== undefined) {
          handleAddressChange(e);
        }
      }
    };

    // Escuchar evento de eliminación de trade-in
    const handleRemovingTradeIn = (event: Event) => {
      const customEvent = event as CustomEvent;
      isRemovingTradeInRef.current = customEvent.detail?.removing || false;
    };
    globalThis.window.addEventListener('removing-trade-in', handleRemovingTradeIn as EventListener);

    // Escuchar evento storage (para cambios entre tabs)
    globalThis.window.addEventListener('storage', handleStorageChange);

    // Escuchar eventos personalizados desde header
    globalThis.window.addEventListener('address-changed', handleAddressChange as EventListener);

    // Escuchar eventos personalizados desde checkout
    globalThis.window.addEventListener('checkout-address-changed', handleAddressChange as EventListener);

    // Escuchar delivery-method-changed pero solo si NO viene con skipFetch
    const handleDeliveryMethodChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      // Si viene con skipFetch, no hacer nada (viene de eliminación de trade-in)
      if (customEvent.detail?.skipFetch) {
        return;
      }
      // Si no viene skipFetch, puede ser un cambio legítimo, pero no llamar fetchCandidateStores
      // porque no es un cambio de dirección
    };
    globalThis.window.addEventListener('delivery-method-changed', handleDeliveryMethodChanged as EventListener);

    // También verificar cambios periódicamente en la misma tab (porque storage solo funciona entre tabs)
    // PERO DESHABILITAR durante eliminación de trade-in
    let lastCheckoutAddress = localStorage.getItem('checkout-address');
    let lastDefaultAddress = localStorage.getItem('imagiq_default_address');

    const checkAddressChanges = () => {
      // PROTECCIÓN CRÍTICA: NO hacer nada si estamos eliminando trade-in
      if (isRemovingTradeInRef.current) {
        return;
      }

      // PROTECCIÓN: No verificar si se procesó un cambio recientemente (últimos 3 segundos)
      const now = Date.now();
      if (now - lastAddressChangeProcessedTimeRef.current < 3000) {
        return;
      }

      const currentCheckoutAddress = localStorage.getItem('checkout-address');
      const currentDefaultAddress = localStorage.getItem('imagiq_default_address');

      // Verificar si realmente cambió la dirección (comparar IDs, no solo el string completo)
      let checkoutAddressChanged = false;
      let defaultAddressChanged = false;
      let newAddressId: string | null = null;

      if (currentCheckoutAddress !== lastCheckoutAddress && lastCheckoutAddress !== null) {
        try {
          const parsed = JSON.parse(currentCheckoutAddress || '{}') as Direccion;
          const lastParsed = JSON.parse(lastCheckoutAddress || '{}') as Direccion;
          // Solo considerar cambio si el ID cambió
          if (parsed.id !== lastParsed.id) {
            checkoutAddressChanged = true;
            newAddressId = parsed.id || null;
          }
        } catch {
          // Si no se puede parsear, considerar cambio si el string cambió
          checkoutAddressChanged = true;
        }
      }

      if (currentDefaultAddress !== lastDefaultAddress && lastDefaultAddress !== null) {
        try {
          const parsed = JSON.parse(currentDefaultAddress || '{}') as Direccion;
          const lastParsed = JSON.parse(lastDefaultAddress || '{}') as Direccion;
          // Solo considerar cambio si el ID cambió
          if (parsed.id !== lastParsed.id) {
            defaultAddressChanged = true;
            if (!newAddressId) {
              newAddressId = parsed.id || null;
            }
          }
        } catch {
          // Si no se puede parsear, considerar cambio si el string cambió
          defaultAddressChanged = true;
        }
      }

      // PROTECCIÓN ADICIONAL: Verificar que no se esté procesando el mismo cambio
      if (newAddressId && processingAddressChangeRef.current === newAddressId) {
        return; // Ya se está procesando este cambio
      }

      if (checkoutAddressChanged) {
        handleAddressChange(new Event('checkout-address-changed'));
        lastCheckoutAddress = currentCheckoutAddress;
      }

      if (defaultAddressChanged && !checkoutAddressChanged) {
        // Solo procesar defaultAddressChanged si no se procesó checkoutAddressChanged
        // para evitar procesar el mismo cambio dos veces
        handleAddressChange(new Event('address-changed'));
        lastDefaultAddress = currentDefaultAddress;
      }
    };

    // AUMENTAR intervalo a 5000ms para reducir peticiones y evitar 429
    const intervalId = setInterval(checkAddressChanges, 5000);

    return () => {
      globalThis.window?.removeEventListener('removing-trade-in', handleRemovingTradeIn as EventListener);
      globalThis.window?.removeEventListener('storage', handleStorageChange);
      globalThis.window?.removeEventListener('address-changed', handleAddressChange as EventListener);
      globalThis.window?.removeEventListener('checkout-address-changed', handleAddressChange as EventListener);
      globalThis.window?.removeEventListener('delivery-method-changed', handleDeliveryMethodChanged as EventListener);
      clearInterval(intervalId);
    };
  }, [fetchCandidateStores]);

  // Cargar direcciones del usuario usando AddressesService
  useEffect(() => {
    const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>(
      "imagiq_user",
      {}
    );
    if (userInfo && (userInfo.id || userInfo.email)) {
      addressesService
        .getUserAddresses()
        .then((addresses: Address[]) => {
          // Convertir Address[] a Direccion[] para mantener compatibilidad
          const direcciones = addresses.map(addressToDireccion);
          setAddresses(direcciones);
        })
        .catch((error) => {
          console.error("Error loading addresses:", error);
          setAddresses([]);
        });
    }
  }, []);

  // Filtrar tiendas según búsqueda (con normalización de acentos)
  useEffect(() => {
    if (storeQuery.trim() === "") {
      setFilteredStores(stores);
    } else {
      const normalizedQuery = normalizeText(storeQuery);
      setFilteredStores(
        stores.filter(
          (s) =>
            normalizeText(s.descripcion).includes(normalizedQuery) ||
            normalizeText(s.direccion).includes(normalizedQuery) ||
            normalizeText(s.ciudad).includes(normalizedQuery) ||
            normalizeText(s.departamento).includes(normalizedQuery) ||
            (s.ubicacion_cc &&
              normalizeText(s.ubicacion_cc).includes(normalizedQuery))
        )
      );
    }
  }, [storeQuery, stores]);

  // Autocompletar dirección si está guardada
  useEffect(() => {
    if (deliveryMethod === "domicilio" && globalThis.window !== undefined) {
      const savedAddress = globalThis.window.localStorage.getItem("checkout-address");
      if (savedAddress && savedAddress !== "undefined") {
        try {
          const saved = JSON.parse(savedAddress) as Direccion;
          if (saved.id) {
            setAddress(saved);
          }
        } catch (error) {
          console.error("Error parsing saved address:", error);
        }
      }
    }
  }, [deliveryMethod]);

  // Cargar tienda seleccionada desde localStorage
  // IMPORTANTE: Solo restaurar si la dirección no cambió desde que se guardó
  useEffect(() => {
    if (globalThis.window !== undefined && stores.length > 0) {
      const savedStore = globalThis.window.localStorage.getItem("checkout-store");
      const savedAddressId = globalThis.window.localStorage.getItem("checkout-store-address-id");
      const currentAddressId = lastAddressIdRef.current;

      // Solo restaurar la tienda si la dirección no cambió desde que se guardó
      if (savedStore && savedAddressId === currentAddressId && currentAddressId !== null) {
        try {
          const parsed = JSON.parse(savedStore) as FormattedStore;
          // Verificar que la tienda guardada existe en la lista actual
          const foundStore = stores.find((s) => s.codigo === parsed.codigo);
          if (foundStore) {
            setSelectedStore(foundStore);
            lastAddressForStoreSelectionRef.current = currentAddressId;
          }
        } catch (error) {
          console.error("Error parsing saved store:", error);
        }
      } else if (savedAddressId !== currentAddressId && currentAddressId !== null) {
        // Si la dirección cambió, asegurarse de que no haya tienda seleccionada
        if (selectedStore !== null) {
          setSelectedStore(null);
        }
        // Limpiar el localStorage si la dirección cambió
        if (globalThis.window) {
          globalThis.window.localStorage.removeItem("checkout-store");
          globalThis.window.localStorage.removeItem("checkout-store-address-id");
        }
      }
    }
  }, [stores, selectedStore]);

  // Validar si se puede continuar
  const canContinue =
    (deliveryMethod === "domicilio" && address !== null) ||
    (deliveryMethod === "tienda" && selectedStore !== null);

  // Función para refrescar direcciones después de agregar una nueva
  const addAddress = () => {
    // Esta función solo refresca la lista de direcciones
    // La creación real se hace en AddNewAddressForm
    addressesService
      .getUserAddresses()
      .then((addresses: Address[]) => {
        // Convertir Address[] a Direccion[] para mantener compatibilidad
        const direcciones = addresses.map(addressToDireccion);
        setAddresses(direcciones);
        return direcciones;
      })
      .catch((error) => {
        console.error("Error refreshing addresses:", error);
        setAddresses([]);
        return [];
      });
  };

  // Función para forzar recarga de tiendas ignorando protecciones
  // Útil cuando canPickUp global es true pero las tiendas no se cargaron
  // IMPORTANTE: Aún respeta el debounce para evitar 429
  const forceRefreshStores = useCallback(() => {
    console.log('🔄 forceRefreshStores llamado');

    // Verificar flag global para evitar forzar recarga si ya se está procesando un cambio
    const globalProcessing = typeof globalThis.window !== 'undefined'
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;

    // Si hay un cambio de dirección en proceso, NO forzar recarga (useDelivery ya lo está manejando)
    if (globalProcessing) {
      console.log('⏸️ No forzar recarga: hay un cambio de dirección en proceso');
      return;
    }

    // Verificar debounce de 2 segundos
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      console.log('⏸️ Debounce activo en forceRefreshStores: esperando antes de forzar recarga');
      console.log(`   Tiempo desde última petición: ${now - lastFetchTimeRef.current}ms (necesita >= 2000ms)`);
      return;
    }

    console.log('✅ Forzando recarga de tiendas - limpiando protecciones');
    // Limpiar refs de protección para forzar la recarga
    lastSuccessfulHashRef.current = null;
    lastFetchTimeRef.current = 0;
    isFetchingRef.current = false;
    // Llamar a fetchCandidateStores
    fetchCandidateStores();
  }, [fetchCandidateStores]);

  return {
    address,
    setAddress,
    addressEdit,
    setAddressEdit,
    storeQuery,
    setStoreQuery,
    filteredStores,
    selectedStore,
    setSelectedStore,
    addresses,
    addAddress,
    deliveryMethod,
    setDeliveryMethod,
    canContinue,
    storesLoading,
    canPickUp,
    stores,
    refreshStores: fetchCandidateStores,
    forceRefreshStores, // Nueva función para forzar recarga
    addressLoading, // Exportar estado de loading para mostrar skeleton
    availableCities,
    availableStoresWhenCanPickUpFalse, // Tiendas disponibles cuando canPickUp es false
    lastResponse, // Exportar respuesta cruda para debugging
  };
};
