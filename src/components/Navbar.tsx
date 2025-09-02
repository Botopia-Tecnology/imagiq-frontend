"use client";
/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 */

import { useState, useEffect, useRef, RefCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
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
  // Detectar si estamos en cliente para evitar errores de hidratación
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
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
  // Detectar si estamos en la sección "más información" de dispositivos móviles (incluye subrutas)
  const isMasInformacionDispositivosMoviles = pathname.startsWith(
    "/productos/DispositivosMoviles/mas-informacion"
  );
  // Detectar si estamos en la ruta de ofertas
  const isOfertas = pathname === "/ofertas";
  // Normaliza la ruta para comparar solo el path
  const cleanPath = pathname.split(/[?#]/)[0];
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
  // Detectar si estamos en DispositivosMoviles o Electrodomesticos (con o sin params)
  const isDispositivosMoviles = pathname.startsWith(
    "/productos/DispositivosMoviles"
  );
  const isElectrodomesticos = pathname.startsWith(
    "/productos/Electrodomesticos"
  );
  const isNavbarItem = navbarRoutes.some((route) =>
    pathname.startsWith(route.href)
  );
  const isHeroScrolled = isHome && isScrolled;
  const isScrolledNavbar =
    (isScrolled && (isNavbarItem || isProductDetail)) || isHeroScrolled;
  // Detectar si estamos en la vista de más información de producto
  const isMasInformacionProducto = pathname.startsWith("/productos/view/");
  // Forzar logo blanco SOLO en la vista de más información de producto y sin scroll
  const showWhiteLogo =
    isMasInformacionProducto && !isScrolled
      ? true
      : isOfertas || (isHome && !isScrolled);
  // Forzar items blancos SOLO en esa sección (desktop y móvil) y sin scroll
  const showWhiteItems =
    isMasInformacionProducto && !isScrolled
      ? true
      : isOfertas || (isHome && !isScrolled);
  const showWhiteItemsMobile =
    isMasInformacionProducto && !isScrolled
      ? true
      : !isScrolledNavbar &&
        !isLogin &&
        (isProductDetail || (isHome && !isScrolled));

  return (
    <header
      data-navbar="true"
      className={cn(
        "w-full z-50 transition-all duration-300",
        "sticky top-0 left-0 md:static",
        isOfertas && !isScrolled
          ? "bg-transparent"
          : isOfertas && isScrolled
          ? "bg-white shadow"
          : isDispositivosMoviles || isElectrodomesticos || isScrolledNavbar
          ? "bg-white shadow"
          : isHome && !isScrolled
          ? "bg-transparent"
          : isProductDetail
          ? "bg-transparent"
          : "bg-white shadow"
      )}
      style={
        isOfertas && !isScrolled
          ? { boxShadow: "none", background: "transparent" }
          : { boxShadow: "none" }
      }
      role="navigation"
      aria-label="Navegación principal"
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
              src={showWhiteLogo ? logoSamsungWhite : logoSamsungBlack}
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
          <button
            type="button"
            className={cn(
              "flex items-center justify-center w-10 h-10 text-black",
              isDispositivosMoviles || isElectrodomesticos
                ? "text-black"
                : showWhiteItems
                ? "text-white"
                : "text-black"
            )}
            title={isAuthenticated ? "Dashboard" : "Ingresar"}
            aria-label={isAuthenticated ? "Dashboard" : "Ingresar"}
            onClick={() => {
              posthogUtils.capture("user_icon_click", {
                user_authenticated: isAuthenticated,
                destination: "login",
              });
              window.location.replace("/login");
            }}
          >
            <User className="w-6 h-6" />
          </button>

          {/* Icono carrito con badge SIEMPRE visible si itemCount > 0 */}
          <Link
            href="/carrito"
            className={cn(
              "flex items-center justify-center w-10 h-10 relative text-black",
              isDispositivosMoviles || isElectrodomesticos
                ? "text-black"
                : showWhiteItems
                ? "text-white"
                : "text-black"
            )}
            title="Carrito de compras"
            onClick={handleCartClick}
          >
            <ShoppingCart className="w-6 h-6" />
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
          {/* Icono corazón al lado derecho del carrito */}
          <button
            type="button"
            className={cn(
              "flex items-center justify-center w-10 h-10",
              isDispositivosMoviles || isElectrodomesticos
                ? "text-black"
                : showWhiteItems
                ? "text-white"
                : "text-black"
            )}
            title="Favoritos"
            aria-label="Favoritos"
            style={{ position: "relative" }}
          >
            <Heart
              className={
                showWhiteItems ? "w-6 h-6 text-white" : "w-6 h-6 text-black"
              }
            />
          </button>
        </div>

        {/* Navbar móvil igual a la imagen: logo, buscador, carrito, hamburguesa */}
        <div className="flex md:hidden items-center justify-end w-full px-4 space-x-4 text-black">
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
                {isClient && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold transition-all duration-200",
                      itemCount > 0
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    )}
                    aria-label={`Carrito: ${itemCount} productos`}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
              {/* Icono corazón al lado derecho del carrito en móvil */}
              <button
                className={cn(
                  "flex items-center justify-center w-10 h-10 text-white",
                  showWhiteItemsMobile ? "text-white" : "text-black"
                )}
                title="Favoritos"
                aria-label="Favoritos"
              >
                <Heart
                  className={
                    showWhiteItemsMobile
                      ? "w-5 h-5 text-white"
                      : "w-5 h-5 text-black"
                  }
                />
              </button>
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
        <ul className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
          {navbarRoutes.map((item) => {
            // Indicador activo: cubre coincidencia exacta, rutas hijas y query params para Electrodomésticos
            let isActive = false;
            if (item.name === "Electrodomésticos") {
              isActive = pathname.startsWith("/productos/Electrodomesticos");
            } else {
              isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/") ||
                pathname.startsWith(item.href + "?") ||
                pathname.startsWith(item.href + "#") ||
                cleanPath === item.href ||
                cleanPath.startsWith(item.href + "/") ||
                cleanPath.startsWith(item.href + "?") ||
                cleanPath.startsWith(item.href + "#");
            }
            // Forzar color blanco en todos los items y el indicador activo en /ofertas
            const itemTextColor = showWhiteItems
              ? "text-white"
              : "text-gray-800";
            const activeIndicatorColor =
              showWhiteItems && isActive
                ? "bg-white"
                : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600";
            // Hover: solo escala en /ofertas, no cambia color
            // Hover: solo escala en Ofertas y Home sin scroll, no cambia color
            const ofertasHoverClass = showWhiteItems
              ? "hover:scale-110"
              : "hover:text-blue-700";
            return (
              <li
                key={item.name}
                className="relative"
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  data-item-name={item.name}
                  ref={setNavItemRef}
                  onMouseEnter={() => handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-lg font-semibold transition-all duration-200 whitespace-nowrap block py-3 px-2 lg:px-4 rounded-lg focus:outline-none",
                      itemTextColor,
                      ofertasHoverClass,
                      isActive && showWhiteItems && "text-white",
                      isActive && !showWhiteItems && "text-gray-900"
                    )}
                    style={
                      showWhiteItems
                        ? { transition: "transform 0.2s" }
                        : undefined
                    }
                    aria-label={item.name}
                  >
                    <span className="relative flex flex-col items-center">
                      {item.name}
                      {/* Indicador mejorado solo en desktop */}
                      <span
                        className={cn(
                          "hidden md:block w-full mt-1 rounded-full transition-all duration-500",
                          isActive
                            ? `h-[4px] ${activeIndicatorColor} shadow-md scale-x-105 opacity-100`
                            : "h-[2px] bg-transparent opacity-0"
                        )}
                        style={{
                          boxShadow: isActive
                            ? "0 2px 8px 0 rgba(30, 64, 175, 0.12)"
                            : undefined,
                          transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
                        }}
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                  {/* Renderiza el dropdown en posición fija arriba de la página */}
                  {activeDropdown === item.name && renderDropdown(item.name)}
                </div>
              </li>
            );
          })}
        </ul>
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
            <div
              className="flex flex-col py-8 px-6 space-y-2"
              role="menu"
              aria-label="Menú móvil"
            >
              {navbarRoutes.map((item) => {
                // Indicador activo: cubre coincidencia exacta, rutas hijas y query params (usando pathname completo)
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  pathname.startsWith(item.href + "?") ||
                  cleanPath === item.href ||
                  cleanPath.startsWith(item.href + "/") ||
                  cleanPath.startsWith(item.href + "?");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-black",
                      isActive && "bg-gray-100"
                    )}
                    aria-label={item.name}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
