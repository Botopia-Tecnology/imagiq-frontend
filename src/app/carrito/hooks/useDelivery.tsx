"use client"
import { useState, useEffect } from "react";
import { stores, Store } from "../../../components/LocationsArray";
import { Direccion } from "@/types/user";
import { addressesService } from "@/services/addresses.service";
import type { Address } from "@/types/address";

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

export const useDelivery = () => {
  const [address, setAddress] = useState<Direccion | null>(null);
  const [addressEdit, setAddressEdit] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [addresses, setAddresses] = useState<Direccion[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");

  // Cargar direcciones del usuario usando AddressesService
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("imagiq_user") || "{}");
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

  // Filtrar tiendas según búsqueda
  useEffect(() => {
    if (storeQuery.trim() === "") {
      setFilteredStores(stores);
    } else {
      const q = storeQuery.toLowerCase();
      setFilteredStores(
        stores.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            (s.mall && s.mall.toLowerCase().includes(q))
        )
      );
    }
  }, [storeQuery]);

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
  };
};
