"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/features/auth/context";
import type { DefaultAddress } from "@/types/user";

interface AddressDropdownProps {
  showWhiteItems: boolean;
  currentAddress: DefaultAddress;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({
  showWhiteItems,
  currentAddress,
}) => {
  const { user, login } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<DefaultAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!open && addresses.length === 0) {
      fetchAddresses();
    }
    setOpen(!open);
  };

  const fetchAddresses = async () => {
    if (!user?.id) return;

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
    }
  };

  const handleSelectAddress = async (address: DefaultAddress) => {
    if (address.id === currentAddress.id) {
      setOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${address.id}/set-default?usuarioId=${user?.id}`,
        { method: "POST" }
      );

      if (response.ok) {
        // Actualizar user en context con nueva dirección
        if (user) {
          await login({
            ...user,
            defaultAddress: address,
          });
        }
        setOpen(false);
      }
    } catch (error) {
      console.error("Error setting default address:", error);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          "flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px] truncate hover:opacity-80 transition-opacity",
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
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] overflow-hidden"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Mis direcciones</h3>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona tu dirección predeterminada
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Cargando...</div>
            ) : addresses.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay direcciones registradas
              </div>
            ) : (
              addresses.map((address) => (
                <button
                  key={address.id}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0",
                    address.id === currentAddress.id && "bg-blue-50"
                  )}
                  onClick={() => handleSelectAddress(address)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {address.nombreDireccion}
                        </span>
                        {address.id === currentAddress.id && (
                          <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {address.direccionFormateada}
                      </p>
                      {address.ciudad && (
                        <p className="text-xs text-gray-500 mt-0.5">
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
        </div>
      )}
    </div>
  );
};

export default AddressDropdown;
