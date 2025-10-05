"use client"
import { useState, useEffect } from "react";
import { stores, Store } from "../../../components/LocationsArray";
import { Direccion } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useDelivery = () => {
  const [address, setAddress] = useState<Direccion | null>(null);
  const [addressEdit, setAddressEdit] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [addresses, setAddresses] = useState<Direccion[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");

  // Cargar direcciones del usuario
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("imagiq_user") || "{}");
    if (userInfo && userInfo.id) {
      fetch(
        `${API_BASE_URL}/api/users/${userInfo.id || userInfo.email}/addresses`
      )
        .then((res) => res.json())
        .then((data) => setAddresses(data))
        .catch((error) => console.error("Error loading addresses:", error));
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
  const addAddress = (userIdentifier: string) => {
    // Esta función solo refresca la lista de direcciones
    // La creación real se hace en AddNewAddressForm
    fetch(`${API_BASE_URL}/api/users/${userIdentifier}/addresses`)
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data);
        return data;
      })
      .catch((error) => {
        console.error("Error refreshing addresses:", error);
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
