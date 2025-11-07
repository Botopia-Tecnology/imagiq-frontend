"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Check, Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/features/auth/context";
import type { Address } from "@/types/address";
import AddNewAddressForm from "../../app/carrito/components/AddNewAddressForm";
import { invalidateShippingOriginCache } from "@/hooks/useShippingOrigin";
import { useDefaultAddress } from "@/hooks/useDefaultAddress";
import { addressesService } from "@/services/addresses.service";

interface AddressDropdownProps {
  showWhiteItems: boolean;
}

const AddressDropdown: React.FC<AddressDropdownProps> = React.memo(({
  showWhiteItems,
}) => {
  const { user, login } = useAuthContext();
  const { address: currentAddress, isLoading: loadingDefault, invalidate } = useDefaultAddress('ENVIO');
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    if (!open && addresses.length === 0 && !isFetchingRef.current) {
      fetchAddresses();
    }
    setOpen(!open);
  };

  const fetchAddresses = async () => {
    if (!user?.id || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const data = await addressesService.getUserAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleSelectAddress = async (address: Address) => {
    if (address.id === currentAddress?.id) {
      setOpen(false);
      return;
    }

    try {
      console.log('🔄 Cambiando dirección predeterminada:', address);
      const result = await addressesService.setDefaultAddress(address.id);
      console.log('✅ Dirección actualizada correctamente:', result);

      // Invalidar cache del hook useDefaultAddress
      invalidate();

      // Invalidar cache del hook useShippingOrigin
      invalidateShippingOriginCache();

      // Actualizar user en context con nueva dirección
      if (user) {
        const defaultAddressFormat = {
          id: address.id,
          nombreDireccion: address.nombreDireccion,
          direccionFormateada: address.direccionFormateada,
          ciudad: address.ciudad,
          departamento: address.departamento,
          esPredeterminada: true,
        };

        await login({
          ...user,
          defaultAddress: defaultAddressFormat,
        });
        console.log('✅ Context actualizado con nueva dirección');
      }
      setOpen(false);
    } catch (error) {
      console.error("❌ Error setting default address:", error);
      alert('Error al cambiar la dirección predeterminada. Por favor intenta de nuevo.');
    }
  };

  const handleAddNewAddress = () => {
    setOpen(false);
    setShowModal(true);
  };

  const handleAddressAdded = async (newAddress: Address) => {
    console.log('🆕 Nueva dirección agregada:', newAddress);
    setShowModal(false);

    // Invalidar cache del hook useDefaultAddress
    invalidate();

    // Invalidar cache del hook useShippingOrigin
    invalidateShippingOriginCache();

    // Refrescar lista de direcciones
    await fetchAddresses();

    // La nueva dirección ya es predeterminada por defecto en el backend
    // Actualizar context con nueva dirección
    if (user) {
      const defaultAddressFormat = {
        id: newAddress.id,
        nombreDireccion: newAddress.lineaUno || 'Nueva dirección',
        direccionFormateada: newAddress.lineaUno,
        ciudad: newAddress.ciudad,
        departamento: newAddress.departamento,
        esPredeterminada: true,
      };

      await login({
        ...user,
        defaultAddress: defaultAddressFormat,
      });
    }
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Skeleton mientras carga la dirección predeterminada
  if (loadingDefault || !currentAddress) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Skeleton para Desktop (>= 1280px) */}
        <div className="hidden xl:flex items-center gap-1.5 max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px]">
          <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0" />
          <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
          <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0 ml-1" />
        </div>

        {/* Skeleton para Mobile/Tablet (< 1280px) */}
        <div className="xl:hidden flex items-center gap-2 max-w-[200px] sm:max-w-[280px] pr-4">
          <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-1 w-full">
              <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0" />
              <div className="h-3 bg-gray-300 rounded animate-pulse flex-1" />
            </div>
            <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
          </div>
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Botón para Desktop (>= 1280px) - Una línea */}
        <button
          className={cn(
            "hidden xl:flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px] truncate hover:opacity-80 transition-opacity cursor-pointer",
            showWhiteItems ? "text-white/90" : "text-black/80"
          )}
          onClick={handleToggle}
          title={currentAddress.direccionFormateada}
          style={{ lineHeight: "1.4" }}
          type="button"
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate block" style={{ lineHeight: "1.4" }}>
            {currentAddress.direccionFormateada}
          </span>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
        </button>

        {/* Botón para Mobile/Tablet (< 1280px) - Dos líneas con flecha */}
        <button
          className={cn(
            "xl:hidden flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer py-1 max-w-[200px] sm:max-w-[280px] pr-4",
            showWhiteItems ? "text-white/90" : "text-black/80"
          )}
          onClick={handleToggle}
          title={currentAddress.direccionFormateada}
          type="button"
        >
          <div className="flex flex-col items-start gap-0 min-w-0 flex-1">
            <div className="flex items-center gap-1 w-full">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] font-semibold truncate">
                {currentAddress.nombreDireccion}
              </span>
            </div>
            <span className="text-[11px] font-normal truncate w-full block leading-tight">
              {currentAddress.direccionFormateada}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        </button>

        {open && (
          <div
            className="fixed xl:absolute left-0 right-0 xl:left-0 xl:right-auto top-[64px] xl:top-full mt-0 xl:mt-1 w-full xl:w-[420px] bg-white border-t xl:border border-gray-200 xl:rounded-lg shadow-2xl z-[10000] overflow-hidden"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-base">Mis direcciones</h3>
              <p className="text-xs text-gray-600 mt-1">
                Selecciona tu dirección predeterminada
              </p>
            </div>

            <div className="max-h-[60vh] xl:max-h-96 overflow-y-auto bg-white">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No hay direcciones registradas
                </div>
              ) : (
                addresses.map((address) => (
                  <button
                    key={address.id}
                    className={cn(
                      "w-full text-left px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0",
                      address.id === currentAddress.id && "bg-blue-50 hover:bg-blue-100"
                    )}
                    onClick={() => handleSelectAddress(address)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {address.nombreDireccion}
                          </span>
                          {address.id === currentAddress.id && (
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                          {address.direccionFormateada}
                        </p>
                        {address.ciudad && (
                          <p className="text-xs text-gray-500 mt-1">
                            {address.ciudad}
                            {address.departamento && `, ${address.departamento}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Botón para agregar nueva dirección */}
            <div className="border-t border-gray-200 bg-white p-4">
              <button
                onClick={handleAddNewAddress}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                type="button"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar nueva dirección</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para agregar dirección - usando Portal para renderizar fuera del Navbar */}
      {showModal && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Agregar nueva dirección
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setShowModal(false)}
                withContainer={false}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

AddressDropdown.displayName = 'AddressDropdown';

export default AddressDropdown;
