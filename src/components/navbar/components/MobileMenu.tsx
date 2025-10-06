"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight, ChevronLeft, Search } from "lucide-react";
import type { FC } from "react";
import { DispositivosMovilesSubmenu } from "./DispositivosMovilesSubmenu";
import { TelevisoresSubmenu } from "./TelevisoresSubmenu";
import { ElectrodomesticosSubmenu } from "./ElectrodomesticosSubmenu";
import { MonitoresSubmenu } from "./MonitoresSubmenu";
import { AccesoriosSubmenu } from "./AccesoriosSubmenu";

type MenuItem = {
  name: string;
  href: string;
  hasDropdown?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { name: "Tienda Online", href: "/" },
  { name: "Dispositivos móviles", href: "/productos/dispositivos-moviles", hasDropdown: true },
  { name: "Televisores y AV", href: "/productos/televisores-y-av", hasDropdown: true },
  { name: "Electrodomésticos", href: "/productos/Electrodomesticos", hasDropdown: true },
  { name: "Monitores", href: "/productos/monitores", hasDropdown: true },
  { name: "Accesorios", href: "/productos/accesorios", hasDropdown: true },
  { name: "Soporte", href: "/soporte" },
  { name: "Para Empresas", href: "/ventas-corporativas" },
];

const FEATURED_PRODUCTS = [
  { name: "Galaxy Z Fold7", image: "/img/menu/smartphones.png" },
  { name: "Galaxy Z Flip7", image: "/img/menu/tablets.png" },
  { name: "Galaxy S25 Ultra", image: "/img/menu/smartphones.png" },
  { name: "Galaxy S25 | S25+", image: "/img/menu/smartphones.png" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu: FC<Props> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.hasDropdown && (item.name === "Dispositivos móviles" || item.name === "Televisores y AV" || item.name === "Electrodomésticos" || item.name === "Monitores" || item.name === "Accesorios")) {
      setActiveSubmenu(item.name);
    } else {
      onClose();
    }
  };

  const handleBackToMain = () => {
    setActiveSubmenu(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 w-full max-w-md bg-white z-[101] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4" style={{ borderBottom: activeSubmenu ? 'none' : '1px solid rgb(229, 231, 235)' }}>
          {activeSubmenu ? (
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Volver"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold flex-1 text-center">{activeSubmenu}</h1>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Búsqueda"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {activeSubmenu === "Dispositivos móviles" ? (
          <DispositivosMovilesSubmenu onClose={onClose} />
        ) : activeSubmenu === "Televisores y AV" ? (
          <TelevisoresSubmenu onClose={onClose} />
        ) : activeSubmenu === "Electrodomésticos" ? (
          <ElectrodomesticosSubmenu onClose={onClose} />
        ) : activeSubmenu === "Monitores" ? (
          <MonitoresSubmenu onClose={onClose} />
        ) : activeSubmenu === "Accesorios" ? (
          <AccesoriosSubmenu onClose={onClose} />
        ) : (
          <>
            <div className="bg-black text-white p-4 text-center">
              <h2 className="text-base font-bold mb-1">
                ¡Comenzó el festival de descuentos!
              </h2>
              <p className="text-sm mb-3">
                Hasta 50% de descuento en tu producto favorito
              </p>
              <Link
                href="/ofertas"
                onClick={onClose}
                className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100"
              >
                Ver Ofertas
              </Link>
            </div>

            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  NOVEDADES
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {FEATURED_PRODUCTS.map((product) => (
                    <Link
                      key={product.name}
                      href="/productos/dispositivos-moviles"
                      onClick={onClose}
                      className="text-center"
                    >
                      <div className="bg-gray-50 rounded-lg p-2 mb-1">
                        <div className="w-full aspect-square bg-gray-200 rounded"></div>
                      </div>
                      <p className="text-xs text-gray-900 leading-tight">
                        {product.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  COMPRAR POR CATEGORÍA
                </h3>
                <nav>
                  {MENU_ITEMS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => item.hasDropdown ? handleMenuItemClick(item) : (window.location.href = item.href)}
                      className="w-full flex items-center justify-between py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg px-2 -mx-2"
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t pt-4">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block text-base font-semibold text-blue-600 py-3"
                >
                  Iniciar sesión/Sign-Up
                </Link>
                <Link
                  href="/productos/dispositivos-moviles"
                  onClick={onClose}
                  className="block text-base font-semibold text-gray-900 py-3"
                >
                  ¿Por qué crear una Samsung Account?
                </Link>
                <Link
                  href="/pedidos"
                  onClick={onClose}
                  className="block text-base font-semibold text-gray-900 py-3"
                >
                  Mis pedidos
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
