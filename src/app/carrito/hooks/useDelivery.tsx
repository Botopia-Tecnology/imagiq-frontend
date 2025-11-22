"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Direccion } from "@/types/user";
import { addressesService } from "@/services/addresses.service";
import type { Address } from "@/types/address";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { storesService } from "@/services/stores.service";
import type { FormattedStore } from "@/types/store";
import {
  productEndpoints,
  type CandidateStore,
  type CandidateStoresResponse,
} from "@/lib/api";
import { useCart } from "@/hooks/useCart";

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
    .replace(/[\u0300-\u036f]/g, ""); // Remueve diacríticos (acentos)
};

/**
 * Convierte CandidateStore a FormattedStore
 * Busca la información completa de la tienda desde el servicio de tiendas
 * usando el codBodega o nombre_tienda para hacer el match
 */
const candidateStoreToFormattedStore = async (
  candidateStore: CandidateStore,
  city: string
): Promise<FormattedStore | null> => {
  try {
    // Obtener todas las tiendas para buscar la información completa
    const allStores = await storesService.getFormattedStores();

    // Buscar la tienda por codBodega o nombre_tienda
    const matchedStore = allStores.find((store) => {
      const codBodegaMatch =
        String(store.codBodega) === String(candidateStore.codBodega);
      const nombreMatch =
        normalizeText(store.descripcion) ===
        normalizeText(candidateStore.nombre_tienda);
      return codBodegaMatch || nombreMatch;
    });

    if (matchedStore) {
      return matchedStore;
    }

    // Si no se encuentra, crear un FormattedStore básico con los datos disponibles
    // Esto es un fallback en caso de que la tienda no esté en el listado completo
    const codDane = candidateStore.codDane
      ? typeof candidateStore.codDane === "string"
        ? parseInt(candidateStore.codDane)
        : candidateStore.codDane
      : 0;

    return {
      codigo: parseInt(candidateStore.codBodega) || 0,
      descripcion: candidateStore.nombre_tienda,
      departamento: city, // Usar la ciudad como departamento si no está disponible
      ciudad: candidateStore.ciudad || city,
      direccion: candidateStore.direccion,
      place_ID: candidateStore.place_ID,
      ubicacion_cc: "",
      horario: candidateStore.horario,
      telefono: "",
      extension: "",
      email: "",
      codBodega: candidateStore.codBodega,
      codDane: codDane,
      latitud: 0,
      longitud: 0,
      position: [0, 0],
    };
  } catch (error) {
    console.error("Error converting CandidateStore to FormattedStore:", error);
    return null;
  }
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
  
  // Ref para prevenir llamadas infinitas a fetchCandidateStores
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const lastAddressIdRef = useRef<string | null>(null); // Para rastrear última dirección procesada
  const isRemovingTradeInRef = useRef(false); // Para prevenir llamadas durante eliminación de trade-in

  // Cargar método de entrega desde localStorage al inicio
  const [deliveryMethod, setDeliveryMethodState] = useState<string>(() => {
    if (typeof window === "undefined") return "domicilio";
    return localStorage.getItem("checkout-delivery-method") || "domicilio";
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
    // PROTECCIÓN CRÍTICA: NO hacer peticiones durante eliminación de trade-in
    if (isRemovingTradeInRef.current) {
      return;
    }
    
    // Prevenir llamadas múltiples simultáneas
    if (isFetchingRef.current) {
      return;
    }
    
    // Prevenir llamadas muy frecuentes (debounce de 3000ms - AUMENTADO)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 3000) {
      return;
    }
    
    try {
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setStoresLoading(true);

      // Obtener user_id
      const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
        "imagiq_user",
        {}
      );
      const userId = user?.id || user?.user_id;

        if (!userId || products.length === 0) {
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

        // Crear hash único de la petición (productos + userId + dirección)
        const currentAddressId = lastAddressIdRef.current || '';
        const requestHash = JSON.stringify({
          products: productsToCheck,
          userId,
          addressId: currentAddressId,
        });

        // PROTECCIÓN CRÍTICA: Si esta misma petición ya falló antes, NO reintentar
        if (failedRequestHashRef.current === requestHash) {
          console.error("🚫 Esta petición ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.");
          setStores([]);
          setFilteredStores([]);
          setCanPickUp(false);
          setStoresLoading(false);
          isFetchingRef.current = false;
          return;
        }

        // Si el hash es el mismo que la última petición exitosa, no hacer nada
        if (lastSuccessfulHashRef.current === requestHash) {
          setStoresLoading(false);
          isFetchingRef.current = false;
          return;
        }

        // Llamar al endpoint con TODOS los productos agrupados
        const response = await productEndpoints.getCandidateStores({
          products: productsToCheck,
          user_id: userId,
        });

        if (response.success && response.data) {
          // Si la petición fue exitosa, marcar el hash como exitoso
          lastSuccessfulHashRef.current = requestHash;
          // Limpiar el hash de fallo si existía
          if (failedRequestHashRef.current === requestHash) {
            failedRequestHashRef.current = null;
          }

          const responseData = response.data as CandidateStoresResponse & { canPickup?: boolean };
          
          // Obtener canPickUp global de la respuesta
          const globalCanPickUp = responseData.canPickUp ?? responseData.canPickup ?? false;
          
          // Establecer canPickUp global
          setCanPickUp(globalCanPickUp);

          // Guardar ciudades disponibles (incluso si canPickUp es false)
          if (responseData.stores) {
            const cities = Object.keys(responseData.stores).filter(city => {
              const cityStores = responseData.stores[city];
              return cityStores && cityStores.length > 0;
            });
            setAvailableCities(cities);
          } else {
            setAvailableCities([]);
          }

          // Solo procesar tiendas si canPickUp global es true
          // Si es false, no mostrar tiendas
          if (globalCanPickUp && responseData.stores) {
            // Obtener todas las tiendas de la respuesta global
            const allCandidateStores = new Map<string, { store: CandidateStore; city: string }>();

            // Agregar todas las tiendas de todas las ciudades de la respuesta global
            Object.entries(responseData.stores).forEach(([city, cityStores]) => {
              cityStores.forEach((store) => {
                const storeCity = store.ciudad || city;
                const key = `${store.codBodega}-${storeCity}`;
                if (!allCandidateStores.has(key)) {
                  allCandidateStores.set(key, { store, city: storeCity });
                }
              });
            });

            // Procesar tiendas candidatas
            let physicalStores: FormattedStore[] = [];

            if (allCandidateStores.size > 0) {
              // Convertir CandidateStore a FormattedStore
              const formattedStoresPromises = Array.from(allCandidateStores.values()).map(
                ({ store, city }) => candidateStoreToFormattedStore(store, city)
              );

              const formattedStoresResults = await Promise.all(formattedStoresPromises);
              const validStores = formattedStoresResults.filter(
                (store): store is FormattedStore => store !== null
              );

              // Filtrar centros de distribución y bodegas
              physicalStores = validStores.filter((store) => {
                const descripcion = normalizeText(store.descripcion);
                const codigo = store.codigo?.toString().trim() || "";

                // Excluir centros de distribución, bodegas, y código "001"
                return !descripcion.includes("centro de distribucion") &&
                       !descripcion.includes("centro distribucion") &&
                       !descripcion.includes("bodega") &&
                       codigo !== "001";
              });
            }

            // Mostrar solo las tiendas que devolvió el endpoint global
            setStores(physicalStores);
            setFilteredStores(physicalStores);
          } else {
            // Si canPickUp global es false, no mostrar tiendas
            setStores([]);
            setFilteredStores([]);
          }
        } else {
          // Si falla la petición, marcar este hash como fallido
          failedRequestHashRef.current = requestHash;
          console.error(`🚫 Petición falló. Hash bloqueado: ${requestHash.substring(0, 50)}...`);
          console.error("🚫 Esta petición NO se reintentará automáticamente para proteger la base de datos.");
          
          // Si falla la petición, no hay pickup disponible
          setCanPickUp(false);
          setStores([]);
          setFilteredStores([]);
        }
      } catch (error) {
        // Si hay un error en el catch, también marcar como fallido
        const currentAddressId = lastAddressIdRef.current || '';
        const productsToCheck = products.map((p) => ({
          sku: p.sku,
          quantity: p.quantity,
        }));
        const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
          "imagiq_user",
          {}
        );
        const userId = user?.id || user?.user_id;
        const requestHash = JSON.stringify({
          products: productsToCheck,
          userId,
          addressId: currentAddressId,
        });
        
        failedRequestHashRef.current = requestHash;
        console.error("🚫 Error loading candidate stores - Petición bloqueada para evitar sobrecargar BD:", error);
        console.error(`🚫 Hash bloqueado: ${requestHash.substring(0, 50)}...`);
        console.error("🚫 Esta petición NO se reintentará automáticamente.");
        
        setStores([]);
        setFilteredStores([]);
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
      if (currentAddress) {
        try {
          const parsed = JSON.parse(currentAddress) as Direccion;
          if (parsed.id === lastAddressIdRef.current) {
            return;
          }
          lastAddressIdRef.current = parsed.id || null;
        } catch (error) {
          // Si no se puede parsear, continuar
        }
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
            localStorage.getItem("checkout-address") || "{}"
          ) as Direccion;

          if (saved && saved.id) {
            setAddress(saved);
            lastAddressIdRef.current = saved.id;
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
        return;
      }
      
      // Recalcular canPickUp global y tiendas cuando cambia la dirección
      fetchCandidateStores();
    };

    const handleStorageChange = (e: StorageEvent) => {
      // Escuchar cambios en checkout-address o imagiq_default_address
      if (e.key === 'checkout-address' || e.key === 'imagiq_default_address') {
        handleAddressChange(e);
      }
    };

    // Escuchar evento de eliminación de trade-in
    const handleRemovingTradeIn = (event: Event) => {
      const customEvent = event as CustomEvent;
      isRemovingTradeInRef.current = customEvent.detail?.removing || false;
    };
    window.addEventListener('removing-trade-in', handleRemovingTradeIn as EventListener);

    // Escuchar evento storage (para cambios entre tabs)
    window.addEventListener('storage', handleStorageChange);

    // Escuchar eventos personalizados desde header
    window.addEventListener('address-changed', handleAddressChange as EventListener);

    // Escuchar eventos personalizados desde checkout
    window.addEventListener('checkout-address-changed', handleAddressChange as EventListener);
    
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
    window.addEventListener('delivery-method-changed', handleDeliveryMethodChanged as EventListener);

    // También verificar cambios periódicamente en la misma tab (porque storage solo funciona entre tabs)
    // PERO DESHABILITAR durante eliminación de trade-in
    let lastCheckoutAddress = localStorage.getItem('checkout-address');
    let lastDefaultAddress = localStorage.getItem('imagiq_default_address');

    const checkAddressChanges = () => {
      // PROTECCIÓN CRÍTICA: NO hacer nada si estamos eliminando trade-in
      if (isRemovingTradeInRef.current) {
        return;
      }
      
      const currentCheckoutAddress = localStorage.getItem('checkout-address');
      const currentDefaultAddress = localStorage.getItem('imagiq_default_address');

      if (currentCheckoutAddress !== lastCheckoutAddress && lastCheckoutAddress !== null) {
        handleAddressChange(new Event('checkout-address-changed'));
        lastCheckoutAddress = currentCheckoutAddress;
      }

      if (currentDefaultAddress !== lastDefaultAddress && lastDefaultAddress !== null) {
        handleAddressChange(new Event('address-changed'));
        lastDefaultAddress = currentDefaultAddress;
      }
    };

    // AUMENTAR intervalo a 2000ms para reducir peticiones
    const intervalId = setInterval(checkAddressChanges, 2000);

    return () => {
      window.removeEventListener('removing-trade-in', handleRemovingTradeIn as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('address-changed', handleAddressChange as EventListener);
      window.removeEventListener('checkout-address-changed', handleAddressChange as EventListener);
      window.removeEventListener('delivery-method-changed', handleDeliveryMethodChanged as EventListener);
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
    if (deliveryMethod === "domicilio" && typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("checkout-address");
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
  useEffect(() => {
    if (typeof window !== "undefined" && stores.length > 0) {
      const savedStore = localStorage.getItem("checkout-store");
      if (savedStore) {
        try {
          const parsed = JSON.parse(savedStore) as FormattedStore;
          // Verificar que la tienda guardada existe en la lista actual
          const foundStore = stores.find((s) => s.codigo === parsed.codigo);
          if (foundStore) {
            setSelectedStore(foundStore);
          }
        } catch (error) {
          console.error("Error parsing saved store:", error);
        }
      }
    }
  }, [stores]);

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
    addressLoading, // Exportar estado de loading para mostrar skeleton
    availableCities,
  };
};
