/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect, useRef, RefCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartContext } from "@/features/cart/CartContext";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import DispositivosMovilesDropdown from "./Dropdowns/Dispositivos_Moviles";
import TelevisionesDropdown from "./Dropdowns/Televisiones";
import ElectrodomesticosDropdown from "./Dropdowns/Electrodomesticos";
import { navbarRoutes } from "../routes/navbarRoutes";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import logoSamsungBlack from "@/img/Samsung_black.png";

// Items that have dropdowns
const DROPDOWN_ITEMS = [
  "Dispositivos móviles",
  "Televisores y AV",
  "Electrodomésticos",
] as const;

type DropdownItemType = (typeof DROPDOWN_ITEMS)[number];

interface SearchResult {
  id: number;
  name: string;
  category: string;
}

export default function Navbar() {
  // 1. Estados y hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { itemCount } = useCartContext();
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  // 2. Efectos y lógica
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (debouncedSearch.length > 2) {
      posthogUtils.capture("navbar_search", {
        query: debouncedSearch,
        query_length: debouncedSearch.length,
        user_authenticated: isAuthenticated,
      });
      setSearchResults([
        {
          id: 1,
          name: `Resultado para "${debouncedSearch}"`,
          category: "Productos",
        },
      ]);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, isAuthenticated]);

  // 3. Funciones
  function hasDropdown(name: string) {
    return DROPDOWN_ITEMS.includes(name as DropdownItemType);
  }

  const handleNavClick = (item: (typeof navbarRoutes)[0]) => {
    posthogUtils.capture("navbar_click", {
      nav_item: item.name,
      nav_category: item.category,
      nav_href: item.href,
      user_authenticated: isAuthenticated,
    });
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: itemCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/carrito");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      posthogUtils.capture("search_submit", {
        query: searchQuery.trim(),
        source: "navbar",
        results_count: searchResults.length,
      });
      window.location.href = `/productos?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const handleDropdownEnter = (dropdownName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdownName);
    const navItem = navItemRefs.current[dropdownName];
    if (navItem) {
      const rect = navItem.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };

  const handleDropdownContainerEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const handleDropdownContainerLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };

  const renderDropdown = (itemName: string) => {
    if (activeDropdown !== itemName || !dropdownCoords) return null;
    let DropdownComponent = null;
    switch (itemName as DropdownItemType) {
      case "Dispositivos móviles":
        DropdownComponent = <DispositivosMovilesDropdown />;
        break;
      case "Televisores y AV":
        DropdownComponent = <TelevisionesDropdown />;
        break;
      case "Electrodomésticos":
        DropdownComponent = <ElectrodomesticosDropdown />;
        break;
      default:
        return null;
    }
    return (
      <div
        onMouseEnter={handleDropdownContainerEnter}
        onMouseLeave={handleDropdownContainerLeave}
        style={{
          position: "fixed",
          top: dropdownCoords.top,
          left: dropdownCoords.left,
          minWidth: dropdownCoords.width,
          zIndex: 1000000,
        }}
        className="animate-dropdown-enter"
      >
        {DropdownComponent}
      </div>
    );
  };

  const setNavItemRef: RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      const itemName = el.getAttribute("data-item-name");
      if (itemName && navItemRefs.current) {
        navItemRefs.current[itemName] = el;
      }
    }
  };

  const isProductDetail =
    pathname.startsWith("/productos/") &&
    !pathname.includes("/productos/DispositivosMoviles");
  const isNavbarItem = navbarRoutes.some((route) => pathname === route.href);
  const isHeroScrolled = isHome && isScrolled;
  const isScrolledNavbar =
    (isScrolled && (isNavbarItem || isProductDetail)) || isHeroScrolled;
  const showBlackLogo =
    isLogin || isScrolledNavbar || isNavbarItem || isHeroScrolled;
  const showWhiteItems =
    !isScrolledNavbar &&
    !isLogin &&
    (isProductDetail || (isHome && !isScrolled));
  const showWhiteItemsMobile =
    !isScrolledNavbar &&
    !isLogin &&
    (isProductDetail || (isHome && !isScrolled));

  // ...existing code...
  return (
    <>
      <header
        data-navbar="true"
        className={cn(
          "w-full  z-50 transition-all duration-300",
          "sticky top-0 left-0 md:static", // móvil sticky arriba, desktop normal
          isScrolledNavbar
            ? "bg-white shadow"
            : isHome && !isScrolled
            ? "bg-transparent"
            : isProductDetail
            ? "bg-transparent"
            : "bg-white shadow"
        )}
        style={{ boxShadow: "none" }}
      >
        <div className="flex items-center justify-between h-16 px-8 max-w-full">
          {/* Logo Samsung-style */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/"
              onClick={() =>
                posthogUtils.capture("logo_click", { source: "navbar" })
              }
              aria-label="Inicio"
            >
              <Image
                src={showBlackLogo ? logoSamsungBlack : logoSamsungWhite}
                alt="Samsung Logo"
                height={32}
                style={{ minWidth: 120, width: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Iconos desktop: solo visible en md+ */}
          <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
            {/* Icono buscador con animación de input mejorada */}
            <div
              className="relative flex items-center group"
              onMouseEnter={() => setSearchQuery("focus")}
              onMouseLeave={() => setSearchQuery("")}
            >
              <form
                onSubmit={handleSearchSubmit}
                className={cn(
                  "flex items-center transition-all duration-500 bg-[#17407A] rounded-full px-4 h-12",
                  searchQuery === "focus"
                    ? "w-72 opacity-100"
                    : "w-0 opacity-0 px-0"
                )}
                style={{ zIndex: 1000, overflow: "hidden" }}
              >
                <input
                  type="text"
                  className="w-full bg-transparent text-white placeholder-white/80 border-none focus:outline-none text-lg"
                  placeholder="Buscar..."
                  value={searchQuery !== "focus" ? searchQuery : ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              {/* Icono de búsqueda desktop */}
              <button
                className={cn(
                  "flex items-center justify-center w-10 h-10 transition-colors absolute right-0",
                  showWhiteItems ? "text-white" : "text-black"
                )}
                title="Buscar"
                onClick={() =>
                  posthogUtils.capture("search_icon_click", {
                    source: "navbar",
                  })
                }
                style={{ zIndex: 1001 }}
              >
                <Search
                  className={
                    showWhiteItems ? "w-6 h-6 text-white" : "w-6 h-6 text-black"
                  }
                />
              </button>
            </div>

            {/* Icono login */}
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className={cn(
                "flex items-center justify-center w-10 h-10",
                showWhiteItems ? "text-white" : "text-black"
              )}
              title={isAuthenticated ? "Dashboard" : "Ingresar"}
              onClick={() =>
                posthogUtils.capture("user_icon_click", {
                  user_authenticated: isAuthenticated,
                  destination: isAuthenticated ? "dashboard" : "login",
                })
              }
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Icono carrito */}
            <Link
              href="/carrito"
              className={cn(
                "flex items-center justify-center w-10 h-10 relative",
                showWhiteItems ? "text-white" : "text-black"
              )}
              title="Carrito de compras"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Navbar móvil igual a la imagen: logo, buscador, carrito, hamburguesa */}
          <div className="flex md:hidden items-center justify-end w-full px-4 space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-4 relative">
              {/* Icono buscador SIEMPRE visible en móvil */}
              <div className="relative group w-10 flex flex-col items-center">
                <button
                  className={cn(
                    "flex items-center justify-center w-10 h-10 text-white text-2xl font-bold",
                    showWhiteItemsMobile ? "text-white" : "text-black"
                  )}
                  title={searchQuery === "focus" ? "Cerrar buscador" : "Buscar"}
                  aria-label={
                    searchQuery === "focus" ? "Cerrar buscador" : "Buscar"
                  }
                  onClick={() => {
                    if (searchQuery === "focus") {
                      setSearchQuery("");
                    } else {
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
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Iconos carrito y hamburguesa siempre visibles en móvil */}
              <div className="flex items-center space-x-4 transition-all duration-300">
                <Link
                  href="/carrito"
                  className={cn(
                    "flex items-center justify-center w-10 h-10 relative text-white",
                    showWhiteItemsMobile ? "text-white" : "text-black"
                  )}
                  title="Carrito"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
                <button
                  className={cn(
                    "flex items-center justify-center w-10 h-10 text-white",
                    showWhiteItemsMobile ? "text-white" : "text-black"
                  )}
                  aria-label="Abrir menú"
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              {/* Input animado al hacer click, aparece debajo y centrado con botón cerrar */}
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
                    <button type="submit" className="ml-2">
                      <Search className="w-6 h-6 text-white" />
                    </button>
                    <button
                      type="button"
                      className="ml-4 text-white text-2xl font-bold focus:outline-none"
                      aria-label="Cerrar buscador"
                      onClick={() => setSearchQuery("")}
                    ></button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menú de navegación principal - se oculta al hacer scroll */}
        <nav
          className={cn(
            "hidden md:block transition-all duration-300 relative",
            isScrolled
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-20 opacity-100"
          )}
        >
          <div className="w-full">
            <div className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
              {navbarRoutes.map((item) => (
                <div
                  key={item.name}
                  data-item-name={item.name}
                  ref={setNavItemRef}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => {
                    if (hasDropdown(item.name)) {
                      handleDropdownEnter(item.name);
                    }
                  }}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className={
                      "text-lg lg:text-lg font-semibold transition-all duration-300 whitespace-nowrap block py-3 px-2 lg:px-4 rounded-lg" +
                      (showWhiteItems
                        ? " text-white/90 hover:text-white hover:bg-white/10"
                        : " text-gray-700 hover:text-gray-900 hover:bg-gray-100")
                    }
                    onClick={() => handleNavClick(item)}
                  >
                    {item.name}
                  </Link>
                  {/* Renderiza el dropdown en posición fija arriba de la página */}
                  {activeDropdown === item.name && renderDropdown(item.name)}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Menú móvil: no mostrar overlay ni menú lateral, solo navbar superior */}
        {/* ...no hay menú lateral en móvil, solo navbar superior como la imagen... */}

        {/* Overlay para cerrar menú móvil */}
        {isMobileMenuOpen && (
          <>
            {/* Fondo oscuro para cerrar menú, solo debajo del navbar, animación fade-in */}
            <div
              className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black/50 z-30 animate-fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menú móvil: items del navbar en overlay, SIEMPRE visibles y en color negro, animación slide-in */}
            <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 shadow-lg border-t border-gray-200 flex flex-col animate-slide-in overflow-y-auto">
              {/* Botón cerrar (X) */}
              <button
                className="absolute top-4 right-6 text-gray-500 hover:text-gray-900 text-2xl font-bold focus:outline-none"
                aria-label="Cerrar menú"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                &#10005;
              </button>
              <nav className="flex flex-col py-8 px-6 space-y-2">
                {navbarRoutes.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-black hover:bg-gray-100"
                    onClick={() => handleNavClick(item)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  );
}
