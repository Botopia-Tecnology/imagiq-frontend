"use client"
import { useState, useEffect } from "react";
import { Direccion } from "@/types/user";
import { addressesService } from "@/services/addresses.service";
import type { Address } from "@/types/address";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { storesService } from "@/services/stores.service";
import type { FormattedStore } from "@/types/store";
import { productEndpoints, type CandidateStore, type CandidateStoresResponse } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

/**
 * Helper para convertir Address a Direccion (legacy)
 */
const addressToDireccion = (address: Address): Direccion => {
  return {
    id: address.id,
    usuario_id: address.usuarioId,
    email: '', // Se llenará del localStorage si es necesario
    linea_uno: address.direccionFormateada,
    codigo_dane: address.codigo_dane, // Backend lo llena
    ciudad: address.ciudad || '',
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
      const codBodegaMatch = String(store.codBodega) === String(candidateStore.codBodega);
      const nombreMatch = normalizeText(store.descripcion) === normalizeText(candidateStore.nombre_tienda);
      return codBodegaMatch || nombreMatch;
    });

    if (matchedStore) {
      return matchedStore;
    }

    // Si no se encuentra, crear un FormattedStore básico con los datos disponibles
    // Esto es un fallback en caso de que la tienda no esté en el listado completo
    const codDane = candidateStore.codDane 
      ? (typeof candidateStore.codDane === 'string' ? parseInt(candidateStore.codDane) : candidateStore.codDane)
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
  const [selectedStore, setSelectedStore] = useState<FormattedStore | null>(null);
  const [addresses, setAddresses] = useState<Direccion[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");
  const [storesLoading, setStoresLoading] = useState(true);
  const { products } = useCart();

  // Cargar tiendas desde candidate-stores (solo donde se puede recoger el producto)
  useEffect(() => {
    const fetchCandidateStores = async () => {
      try {
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
          setStoresLoading(false);
          return;
        }

        // Obtener todas las tiendas candidatas para todos los productos
        const allCandidateStores = new Map<string, { store: CandidateStore; city: string }>();
        
        // Hacer petición para cada producto
        for (const product of products) {
          try {
            const response = await productEndpoints.getCandidateStores({
              products: [{ sku: product.sku, quantity: product.quantity }],
              user_id: userId,
            });

            if (response.success && response.data) {
              // Solo usar tiendas donde canPickUp es true
              const responseData = response.data as CandidateStoresResponse & { canPickup?: boolean };
              const canPickUp = 
                responseData.canPickUp ?? 
                responseData.canPickup ?? 
                false;

              if (canPickUp && responseData.stores) {
                // Agregar todas las tiendas de todas las ciudades
                Object.entries(responseData.stores).forEach(([city, cityStores]) => {
                  cityStores.forEach((store) => {
                    // Usar codBodega como clave única para evitar duplicados
                    // Usar la ciudad de la tienda si está disponible, sino usar la clave del objeto
                    const storeCity = store.ciudad || city;
                    const key = `${store.codBodega}-${storeCity}`;
                    if (!allCandidateStores.has(key)) {
                      allCandidateStores.set(key, { store, city: storeCity });
                    }
                  });
                });
              }
            }
          } catch (error) {
            console.error(`Error fetching candidate stores for product ${product.sku}:`, error);
          }
        }

        // Convertir CandidateStore a FormattedStore
        const formattedStoresPromises = Array.from(allCandidateStores.values()).map(
          ({ store, city }) => candidateStoreToFormattedStore(store, city)
        );
        
        const formattedStoresResults = await Promise.all(formattedStoresPromises);
        const validStores = formattedStoresResults.filter(
          (store): store is FormattedStore => store !== null
        );

        // Filtrar centros de distribución
        const physicalStores = validStores.filter((store) => {
          const descripcion = normalizeText(store.descripcion);
          return !descripcion.includes("centro de distribucion") && 
                 !descripcion.includes("centro distribucion") &&
                 !descripcion.includes("bodega");
        });

        setStores(physicalStores);
        setFilteredStores(physicalStores);
      } catch (error) {
        console.error("Error loading candidate stores:", error);
        setStores([]);
        setFilteredStores([]);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchCandidateStores();
  }, [products]);

  // Cargar direcciones del usuario usando AddressesService
  useEffect(() => {
    const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>(
      "imagiq_user",
      {}
    );
    if (userInfo && (userInfo.id || userInfo.email)) {
      addressesService.getUserAddresses()
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
            (s.ubicacion_cc && normalizeText(s.ubicacion_cc).includes(normalizedQuery))
        )
      );
    }
  }, [storeQuery, stores]);

  // Autocompletar dirección si está guardada
  useEffect(() => {
    if (deliveryMethod === "domicilio" && typeof window !== "undefined") {
      const saved = JSON.parse(
        localStorage.getItem("checkout-address") || "{}"
      ) as Direccion;
      if (saved && saved.id) {
        setAddress(saved);
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
    addressesService.getUserAddresses()
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
  };
};
