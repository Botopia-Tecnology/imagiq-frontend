"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Check, Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/features/auth/context";
import type { DefaultAddress, Direccion } from "@/types/user";
import AddNewAddressForm from "../../app/carrito/components/AddNewAddressForm";
import { invalidateShippingOriginCache } from "@/hooks/useShippingOrigin";

interface AddressDropdownProps {
  showWhiteItems: boolean;
  currentAddress: DefaultAddress;
}

const AddressDropdown: React.FC<AddressDropdownProps> = React.memo(({
  showWhiteItems,
  currentAddress,
}) => {
  const { user, login } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState<DefaultAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false); // Ref para evitar múltiples llamadas simultáneas

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses?usuarioId=${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setAddresses(data || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleSelectAddress = async (address: DefaultAddress) => {
    if (address.id === currentAddress.id) {
      setOpen(false);
      return;
    }

    try {
      console.log('🔄 Cambiando dirección predeterminada:', address);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${address.id}/set-default?usuarioId=${user?.id}`,
        { method: "POST" }
      );

      console.log('📡 Respuesta del servidor:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Dirección actualizada correctamente:', result);

        // Actualizar user en context con nueva dirección
        if (user) {
          await login({
            ...user,
            defaultAddress: address,
          });
          console.log('✅ Context actualizado con nueva dirección');
        }
        setOpen(false);
      } else {
        const errorData = await response.json();
        console.error('❌ Error al actualizar dirección:', errorData);
        alert('Error al cambiar la dirección predeterminada. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error("❌ Error setting default address:", error);
      alert('Error al cambiar la dirección predeterminada. Por favor intenta de nuevo.');
    }
  };

  const handleAddNewAddress = () => {
    setOpen(false);
    setShowModal(true);
  };

  const handleAddressAdded = async (newAddress: Direccion) => {
    console.log('🆕 Nueva dirección agregada:', newAddress);
    setShowModal(false);

    // Invalidar cache del hook useShippingOrigin
    invalidateShippingOriginCache();

    // Refrescar lista de direcciones
    await fetchAddresses();

    // Convertir Direccion a DefaultAddress y establecerla como predeterminada
    const defaultAddressFormat: DefaultAddress = {
      id: newAddress.id,
      nombreDireccion: newAddress.linea_uno || 'Nueva dirección',
      direccionFormateada: newAddress.linea_uno,
      ciudad: newAddress.ciudad,
      departamento: undefined,
      esPredeterminada: true,
    };

    // Siempre establecer la nueva dirección como predeterminada
    await handleSelectAddress(defaultAddressFormat);
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
                <div className="p-6 text-center text-gray-500 text-sm">Cargando...</div>
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
