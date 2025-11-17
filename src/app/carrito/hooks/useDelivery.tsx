"use client"
import { useState, useEffect } from "react";
import { Direccion } from "@/types/user";
import { addressesService } from "@/services/addresses.service";
import type { Address } from "@/types/address";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { storesService } from "@/services/stores.service";
import type { FormattedStore } from "@/types/store";

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

  // Cargar tiendas desde el API (excluyendo centros de distribución)
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setStoresLoading(true);
        const formattedStores = await storesService.getFormattedStores();
        // Filtrar centros de distribución - solo mostrar tiendas físicas (SES)
        const physicalStores = formattedStores.filter((store) => {
          const descripcion = normalizeText(store.descripcion);
          // Excluir centros de distribución
          return !descripcion.includes("centro de distribucion") && 
                 !descripcion.includes("centro distribucion") &&
                 !descripcion.includes("bodega");
        });
        setStores(physicalStores);
        setFilteredStores(physicalStores);
      } catch (error) {
        console.error("Error loading stores:", error);
        setStores([]);
        setFilteredStores([]);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchStores();
  }, []);

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
