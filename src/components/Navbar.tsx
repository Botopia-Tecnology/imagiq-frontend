/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect, useRef, RefCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MapPin, User, ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartContext } from "@/features/cart/CartContext";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import DispositivosMovilesDropdown from "./Dropdowns/Dispositivos_Moviles";
import TelevisionesDropdown from "./Dropdowns/Televisiones";
import ElectrodomesticosDropdown from "./Dropdowns/Electrodomesticos";

// Navigation items matching Samsung Store layout exactly
const navigationItems = [
  {
    name: "Ofertas",
    href: "/tienda/outlet",

    category: "promociones",
  },
  {
    name: "Dispositivos móviles",
    href: "/productos/DispositivosMoviles",

    category: "moviles",
  },
  {
    name: "Televisores y AV",
    href: "/tienda/televisores",
    description: "Smart TVs, audio y video",
    category: "televisores",
  },
  {
    name: "Electrodomésticos",
    href: "/tienda/electrodomesticos",
    description: "Electrodomésticos para el hogar",
    category: "hogar",
  },
  {
    name: "Tiendas",
    href: "/tiendas",
    description: "Encuentra nuestras tiendas físicas",
    category: "ubicaciones",
  },
  {
    name: "Servicio Técnico",
    href: "/soporte",
    description: "Servicio técnico y atención al cliente",
    category: "servicio",
  },
  {
    name: "Ventas corporativas",
    href: "/ventas-corporativas",
    description: "Soluciones para empresas",
    category: "corporativo",
  },
];

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
  // Estados del componente
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  // Estados adicionales para posicionamiento de dropdowns
  const [dropdownPosition, setDropdownPosition] = useState<{
    [key: string]: { top: number; left: number };
  }>({});
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Refs para mejorar el manejo de hover
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hook para detectar la ruta actual
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Hooks personalizados
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { itemCount } = useCartContext();
  const { isAuthenticated } = useAuthContext();

  // Detectar scroll para ocultar menú de navegación
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tracking de PostHog para búsquedas
  useEffect(() => {
    if (debouncedSearch.length > 2) {
      posthogUtils.capture("navbar_search", {
        query: debouncedSearch,
        query_length: debouncedSearch.length,
        user_authenticated: isAuthenticated,
      });

      // Simular búsqueda
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

  // Tracking de clicks en navegación
  const handleNavClick = (item: (typeof navigationItems)[0]) => {
    posthogUtils.capture("navbar_click", {
      nav_item: item.name,
      nav_category: item.category,
      nav_href: item.href,
      user_authenticated: isAuthenticated,
    });
    setIsMobileMenuOpen(false);
  };

  // Tracking de interacciones del carrito
  const handleCartClick = () => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: itemCount,
      user_authenticated: isAuthenticated,
    });
  };

  // Tracking de búsqueda
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    posthogUtils.capture("search_focus", {
      source: "navbar",
      user_authenticated: isAuthenticated,
    });
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
      setSearchResults([]);
    }, 200);
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

    // Calcular la posición del dropdown basado en el elemento padre
    const navItemElement = navItemRefs.current[dropdownName];
    if (navItemElement) {
      const rect = navItemElement.getBoundingClientRect();
      setDropdownPosition({
        ...dropdownPosition,
        [dropdownName]: {
          top: rect.bottom,
          left: rect.left + rect.width / 2,
        },
      });
    }
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const renderDropdown = (itemName: string) => {
    if (activeDropdown !== itemName) return null;

    const pos = dropdownPosition[itemName] || { top: 0, left: 0 };

    switch (itemName as DropdownItemType) {
      case "Dispositivos móviles":
        return <DispositivosMovilesDropdown position={pos} />;
      case "Televisores y AV":
        return <TelevisionesDropdown position={pos} />;
      case "Electrodomésticos":
        return <ElectrodomesticosDropdown position={pos} />;
      default:
        return null;
    }
  };

  const hasDropdown = (itemName: string): itemName is DropdownItemType => {
    return DROPDOWN_ITEMS.includes(itemName as DropdownItemType);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Detectar si estamos en páginas de productos para usar navbar blanco
  const isProductPage =
    pathname.startsWith("/productos") ||
    pathname.includes("/DispositivosMoviles");

  // Corrección del tipo para la función ref
  const setNavItemRef: RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      const itemName = el.getAttribute("data-item-name");
      if (itemName) {
        navItemRefs.current[itemName] = el;
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes dropdown-enter {
          from {
            opacity: 0;
            transform: translateX(-16.666667%) translateY(-15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-16.666667%) translateY(0) scale(1);
          }
        }

        @keyframes dropdown-item {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dropdown-enter {
          animation: dropdown-enter 0.25s ease-out forwards;
        }

        .animate-dropdown-item {
          opacity: 0;
          animation: dropdown-item 0.3s ease-out forwards;
        }
      `}</style>

      <header
        data-navbar="true"
        className={cn(
          "text-white transition-all duration-300 w-full",
          isLoginPage ? "relative" : "sticky top-0",
          // Navbar blanco para páginas de productos
          isProductPage && "text-gray-900 bg-white shadow-md",
          // Ajustar altura cuando está scrolled
          isScrolled ? "shadow-lg" : ""
        )}
        style={{
          zIndex: 99999,
          ...(!isProductPage
            ? {
                background: "linear-gradient(to bottom, #1A4880, #24538F)",
              }
            : {}),
        }}
      >
        {/* Barra principal */}
        <div
          className="w-full relative overflow-hidden"
          style={{ zIndex: 99999 }}
        >
          <div className="flex items-center justify-between h-15 px-4 md:px-8 max-w-full">
            {/* Logo Samsung-style */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className={cn(
                  "text-2xl font-bold tracking-wider transition-colors",
                  isProductPage ? "text-gray-900" : "text-white"
                )}
                onClick={() =>
                  posthogUtils.capture("logo_click", { source: "navbar" })
                }
              >
                SAMSUNG
              </Link>
            </div>

            {/* Iconos de la derecha - solo visible en móvil o siempre según el diseño */}
            <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
              {/* Barra de búsqueda - solo en desktop */}
              <div className="hidden md:flex items-center group relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    placeholder=""
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className={cn(
                      "transition-all duration-300 ease-in-out h-10 rounded-full border-0 focus:outline-none",
                      isProductPage
                        ? "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-200"
                        : "bg-white/10 text-white placeholder-gray-300 focus:bg-white/20",
                      "w-0 pl-0 pr-0 group-hover:w-64 lg:group-hover:w-80 group-hover:pl-4 group-hover:pr-12",
                      (isSearchFocused || searchQuery.length > 0) &&
                        "w-64 lg:w-80 pl-4 pr-12"
                    )}
                  />
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center w-10 h-10 transition-colors absolute right-0",
                      isProductPage
                        ? "text-gray-500 hover:text-gray-700"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                {/* Resultados de búsqueda */}
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {searchResults.map((result: SearchResult) => (
                      <div
                        key={result.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() =>
                          posthogUtils.capture("search_result_click", {
                            result_name: result.name,
                            query: searchQuery,
                          })
                        }
                      >
                        <div className="font-semibold">{result.name}</div>
                        <div className="text-sm text-gray-500">
                          {result.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Iconos de acción */}
              <button
                className={cn(
                  "hidden md:flex items-center justify-center w-10 h-10 transition-colors",
                  isProductPage
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-white/70 hover:text-white"
                )}
                onClick={() =>
                  posthogUtils.capture("location_click", { source: "navbar" })
                }
                title="Ubicación"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className={cn(
                  "flex items-center justify-center w-10 h-10 transition-colors",
                  isProductPage
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-white/70 hover:text-white"
                )}
                onClick={() =>
                  posthogUtils.capture("user_icon_click", {
                    user_authenticated: isAuthenticated,
                    destination: isAuthenticated ? "dashboard" : "login",
                  })
                }
                title={isAuthenticated ? "Dashboard" : "Ingresar"}
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/checkout"
                className={cn(
                  "flex items-center justify-center w-10 h-10 transition-colors relative",
                  isProductPage
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-white/70 hover:text-white"
                )}
                onClick={handleCartClick}
                title="Carrito de compras"
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
                  "md:hidden flex items-center justify-center w-10 h-10 transition-colors",
                  isProductPage
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-white/70 hover:text-white"
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
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
            <div className="w-full overflow-x-auto">
              <div className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
                {navigationItems.map((item) => (
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
                      className={cn(
                        "text-sm lg:text-md font-bold transition-all duration-300 whitespace-nowrap block py-3 px-2 lg:px-4 rounded-lg",
                        isProductPage
                          ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => handleNavClick(item)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Contenedor fijo para dropdowns cuando navbar está collapsed */}
          {isScrolled && activeDropdown && (
            <div
              className="absolute top-full left-0 w-full"
              style={{ zIndex: 999999 }}
            >
              <div className="flex justify-center">
                <div className="relative" style={{ zIndex: 999999 }}>
                  {renderDropdown(activeDropdown)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bg-white shadow-2xl border-t border-gray-200 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-6">
              {/* Búsqueda móvil */}
              <div className="mb-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="¿Qué estás buscando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Enlaces de navegación móvil */}
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-4 px-4 text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 animate-dropdown-item border border-gray-200"
                    onClick={() => handleNavClick(item)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="font-medium text-base mb-1">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Opciones adicionales móvil */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  className="flex items-center space-x-3 w-full py-4 px-4 text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                  onClick={() =>
                    posthogUtils.capture("mobile_location_click", {
                      source: "mobile_menu",
                    })
                  }
                >
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-base">
                      Encontrar tienda
                    </div>
                    <div className="text-sm text-gray-600">
                      Ubicaciones cercanas
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className="flex items-center space-x-3 w-full py-4 px-4 text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                  onClick={() => {
                    posthogUtils.capture("mobile_user_click", {
                      user_authenticated: isAuthenticated,
                      destination: isAuthenticated ? "dashboard" : "login",
                    });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-base">
                      {isAuthenticated ? "Dashboard" : "Iniciar sesión"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isAuthenticated
                        ? "Panel de administración"
                        : "Acceder a tu cuenta"}
                    </div>
                  </div>
                </Link>

                <Link
                  href="/checkout"
                  className="flex items-center justify-between w-full py-4 px-4 text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                  onClick={() => {
                    handleCartClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-base">Carrito</div>
                      <div className="text-sm text-gray-600">
                        {itemCount > 0
                          ? `${itemCount} producto${itemCount > 1 ? "s" : ""}`
                          : "Sin productos"}
                      </div>
                    </div>
                  </div>
                  {itemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Overlay para cerrar menú móvil */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 top-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </header>

      {/* Renderizado de todos los dropdowns en el portal */}
      <div id="dropdowns-container" className="dropdown-portal">
        {activeDropdown && renderDropdown(activeDropdown)}
      </div>
    </>
  );
}
