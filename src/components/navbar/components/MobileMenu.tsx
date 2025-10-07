"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import type { FC, FormEvent } from "react";
import { DispositivosMovilesSubmenu } from "./DispositivosMovilesSubmenu";
import { TelevisoresSubmenu } from "./TelevisoresSubmenu";
import { ElectrodomesticosSubmenu } from "./ElectrodomesticosSubmenu";
import { MonitoresSubmenu } from "./MonitoresSubmenu";
import { AccesoriosSubmenu } from "./AccesoriosSubmenu";
import { SearchBar } from "./SearchBar";

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
  { name: "Soporte", href: "/soporte/inicio_de_soporte" },
  { name: "Para Empresas", href: "/ventas-corporativas" },
];

const FEATURED_PRODUCTS = [
  {
    name: "Galaxy Z Fold7",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/galaxy-zflod7_hrd0oj.webp",  // 👈 Pon tu URL aquí
    href: "/productos/dispositivos-moviles/galaxy-z-fold7"
  },
  {
    name: "Galaxy Z Flip7",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849937/galaxy-zflip7_spfhq7.webp",  // 👈 Pon tu URL aquí
    href: "/productos/dispositivos-moviles/galaxy-z-flip7"
  },
  {
    name: "Galaxy S25 Ultra",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/25s-ultra_xfxhqt.webp",  // 👈 Pon tu URL aquí
    href: "/productos/dispositivos-moviles/galaxy-s25-ultra"
  },
  {
    name: "Galaxy S25 | S25+",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/25s_skxtgm.webp",  // 👈 Pon tu URL aquí
    href: "/productos/dispositivos-moviles/galaxy-s25"
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
};

export const MobileMenu: FC<Props> = ({ isOpen, onClose, searchQuery, onSearchChange, onSearchSubmit }) => {
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
        <div className="sticky top-0 bg-white p-4 z-20" style={{ borderBottom: activeSubmenu ? 'none' : '1px solid rgb(229, 231, 235)' }}>
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
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  onSubmit={onSearchSubmit}
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

        <div className="sticky top-[73px] bg-black text-white p-4 text-center z-10">
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
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  NOVEDADES
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {FEATURED_PRODUCTS.map((product) => (
                    <Link
                      key={product.name}
                      href={product.href}
                      onClick={onClose}
                      className="text-center"
                    >
                      <div className="bg-gray-50 rounded-lg p-2 mb-1">
                        <div className="w-full aspect-square relative">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                            unoptimized
                          />
                        </div>
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
