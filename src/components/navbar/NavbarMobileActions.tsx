"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { useCartContext } from "@/features/cart/CartContext";
import carritoIconBlack from "@/img/navbar-icons/carrito-icon-black.png";
import carritoIconWhite from "@/img/navbar-icons/carrito-icon-white.png";
import searchIconBlack from "@/img/navbar-icons/search-icon-black.png";
import searchIconWhite from "@/img/navbar-icons/search-icon-white.png";

interface NavbarMobileActionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showWhiteItemsMobile: boolean;
  isClient: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleCartClick: () => void;
}

export default function NavbarMobileActions({
  searchQuery,
  setSearchQuery,
  showWhiteItemsMobile,
  isClient,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleSearchSubmit,
  handleCartClick,
}: NavbarMobileActionsProps) {
  const { itemCount } = useCartContext();

  return (
    <>
      {/* Iconos móviles */}
      <div className="absolute right-0 top-0 flex md:hidden items-center h-16 space-x-4 pr-2">
        {/* Buscador */}
        <button
          className={cn(
            "flex items-center justify-center w-10 h-10 text-2xl font-bold",
            showWhiteItemsMobile ? "text-white" : "text-black"
          )}
          title={searchQuery === "focus" ? "Cerrar buscador" : "Buscar"}
          onClick={() => {
            if (searchQuery === "focus") setSearchQuery("");
            else {
              setSearchQuery("focus");
              posthogUtils.capture("search_icon_click", {
                source: "navbar_mobile",
              });
            }
          }}
        >
          {searchQuery === "focus" ? (
            <span className="text-2xl">&#10005;</span>
          ) : (
            <Image
              src={showWhiteItemsMobile ? searchIconWhite : searchIconBlack}
              alt="Buscar"
              width={26}
              height={26}
              priority
            />
          )}
        </button>

        {/* Carrito */}
        <Link
          href="/carrito"
          className={cn(
            "flex items-center justify-center w-10 h-10 relative",
            showWhiteItemsMobile ? "text-white" : "text-black"
          )}
          title="Carrito"
          onClick={handleCartClick}
        >
          <Image
            src={showWhiteItemsMobile ? carritoIconWhite : carritoIconBlack}
            alt="Carrito"
            width={34}
            height={34}
            priority
          />
          {isClient && (
            <span
              className={cn(
                "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold transition-all duration-200",
                itemCount > 0 ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )}
              aria-label={`Carrito: ${itemCount} productos`}
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>

        {/* Menú hamburguesa */}
        <button
          className={cn(
            "flex items-center justify-center w-10 h-10",
            showWhiteItemsMobile ? "text-white" : "text-black"
          )}
          aria-label="Abrir menú"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Input de búsqueda animado */}
      {searchQuery === "focus" && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-md z-[10000] animate-fade-in">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#17407A] rounded-full flex items-center px-6 py-4 shadow-lg"
          >
            <input
              type="text"
              className="w-full bg-transparent text-white placeholder-white/80 border-none focus:outline-none text-lg"
              placeholder="Buscar..."
              autoFocus
              value={searchQuery !== "focus" ? searchQuery : ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </>
  );
}
