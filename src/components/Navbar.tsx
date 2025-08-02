/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 *
 * Componente de navegación empresarial con:
 * - Diseño idéntico a Samsung Store de las imágenes
 * - Integración completa con PostHog para tracking
 * - Búsqueda optimizada con debounce
 * - Carrito de compras con estado global
 * - Responsive design y accesibilidad
 * - Analytics automáticos de navegación
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MapPin, User, ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartContext } from "@/features/cart/CartContext";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import Logo from "./Logo";
import DispositivosMovilesDropdown from "./Dropdowns/Dispositivos_Moviles";
import TelevisionesDropdown from "./Dropdowns/Televisiones";
import ElectrodomesticosDropdown from "./Dropdowns/Electrodomesticos";

// Navigation items matching Samsung Store layout exactly
const navigationItems = [
  {
    name: "Ofertas",
    href: "/tienda/outlet",
    description: "Ofertas especiales hasta 70% OFF",
    category: "promociones",
  },
  {
    name: "Dispositivos móviles",
    href: "/tienda/novedades",
    description: "Últimos productos y lanzamientos",
    category: "nuevos",
  },
  {
    name: "Televisores y AV",
    href: "/tienda/recomendados",
    description: "Productos más populares y mejor valorados",
    category: "populares",
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

  // Refs para mejorar el manejo de hover
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hook para detectar la ruta actual
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Hooks personalizados
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { itemCount } = useCartContext();
  const { isAuthenticated } = useAuthContext();

  // Tracking de PostHog para búsquedas
  useEffect(() => {
    if (debouncedSearch.length > 2) {
      posthogUtils.capture("navbar_search", {
        query: debouncedSearch,
        query_length: debouncedSearch.length,
        user_authenticated: isAuthenticated,
      });

      // Simular búsqueda (aquí se integraría con el microservicio)
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

    // Cerrar menú móvil si está abierto
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
    // Delay para permitir clicks en resultados
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

      // Redirigir a página de resultados
      window.location.href = `/productos?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  // Optimized dropdown handlers
  const handleDropdownEnter = (dropdownName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Render dropdown component based on active dropdown
  const renderDropdown = (itemName: string) => {
    if (activeDropdown !== itemName) return null;

    const dropdownProps = {
      onMouseEnter: () => handleDropdownEnter(itemName),
      onMouseLeave: handleDropdownLeave,
    };

    switch (itemName as DropdownItemType) {
      case "Dispositivos móviles":
        return (
          <div {...dropdownProps}>
            <DispositivosMovilesDropdown />
          </div>
        );
      case "Televisores y AV":
        return (
          <div {...dropdownProps}>
            <TelevisionesDropdown />
          </div>
        );
      case "Electrodomésticos":
        return (
          <div {...dropdownProps}>
            <ElectrodomesticosDropdown />
          </div>
        );
      default:
        return null;
    }
  };

  // Check if item has dropdown
  const hasDropdown = (itemName: string): itemName is DropdownItemType => {
    return DROPDOWN_ITEMS.includes(itemName as DropdownItemType);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

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
        className={cn(
          "text-white z-50",
          isLoginPage ? "relative" : "sticky top-0"
        )}
        style={{ backgroundColor: "#14182A" }}
      >
        {/* Barra superior */}
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo optimizado usando componente con tamaño personalizado */}
            <Logo
              width={180}
              height={180}
              onClick={() =>
                posthogUtils.capture("logo_click", { source: "navbar" })
              }
            />

            {/* Iconos de la derecha con búsqueda - exactos a Samsung Store */}
            <div className="flex items-center space-x-4">
              {/* Barra de búsqueda - se expande al hover */}
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
                      "transition-all duration-300 ease-in-out h-10 rounded-full bg-gray-600 border-0 text-white placeholder-gray-400 focus:outline-none",
                      "w-0 pl-0 pr-0 group-hover:w-80 group-hover:pl-4 group-hover:pr-12",
                      (isSearchFocused || searchQuery.length > 0) &&
                        "w-80 pl-4 pr-12"
                    )}
                    data-track="search-input"
                  />
                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors absolute right-0"
                    data-track="search-button"
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

              {/* Ubicación */}
              <button
                className="hidden md:flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors"
                onClick={() =>
                  posthogUtils.capture("location_click", { source: "navbar" })
                }
                data-track="location-button"
                title="Ubicación"
              >
                <MapPin className="w-5 h-5" />
              </button>

              {/* Usuario */}
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors"
                onClick={() =>
                  posthogUtils.capture("user_icon_click", {
                    user_authenticated: isAuthenticated,
                    destination: isAuthenticated ? "dashboard" : "login",
                  })
                }
                data-track="user-button"
                title={isAuthenticated ? "Dashboard" : "Ingresar"}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Carrito */}
              <Link
                href="/checkout"
                className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors relative"
                onClick={handleCartClick}
                data-track="cart-button"
                title="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Menú móvil */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-track="mobile-menu-button"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú de navegación principal - exacto a Samsung Store */}
        <nav className="hidden md:block" style={{ backgroundColor: "#14182A" }}>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center space-x-16 py-6">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasDropdown(item.name)) {
                      handleDropdownEnter(item.name);
                    }
                  }}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm font-normal transition-all duration-300 whitespace-nowrap block py-3 px-4 rounded-lg hover:bg-gray-700/20"
                    onClick={() => handleNavClick(item)}
                    data-track={`nav-${item.category}`}
                  >
                    {item.name}
                  </Link>

                  {/* Optimized dropdown rendering */}
                  {renderDropdown(item.name)}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-x-0 top-16 bg-gray-900 shadow-2xl border-t border-gray-700 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ backgroundColor: "#1a1f35" }}
          >
            <div className="px-4 py-6">
              {/* Búsqueda móvil mejorada */}
              <div className="mb-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="¿Qué estás buscando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Enlaces de navegación móvil con mejor diseño */}
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-4 px-4 text-white bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-200 animate-dropdown-item border border-gray-700/50 hover:border-gray-600"
                    onClick={() => handleNavClick(item)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="font-medium text-base mb-1">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Opciones adicionales móvil mejoradas */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  className="flex items-center space-x-3 w-full py-4 px-4 text-white bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-gray-600"
                  onClick={() =>
                    posthogUtils.capture("mobile_location_click", {
                      source: "mobile_menu",
                    })
                  }
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-base">
                      Encontrar tienda
                    </div>
                    <div className="text-sm text-gray-400">
                      Ubicaciones cercanas
                    </div>
                  </div>
                </button>
              </div>

              {/* Información adicional del usuario en móvil */}
              <div className="mt-4 space-y-2">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className="flex items-center space-x-3 w-full py-4 px-4 text-white bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-gray-600"
                  onClick={() => {
                    posthogUtils.capture("mobile_user_click", {
                      user_authenticated: isAuthenticated,
                      destination: isAuthenticated ? "dashboard" : "login",
                    });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium text-base">
                      {isAuthenticated ? "Dashboard" : "Iniciar sesión"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {isAuthenticated
                        ? "Panel de administración"
                        : "Acceder a tu cuenta"}
                    </div>
                  </div>
                </Link>

                <Link
                  href="/checkout"
                  className="flex items-center justify-between w-full py-4 px-4 text-white bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-gray-600"
                  onClick={() => {
                    handleCartClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-base">Carrito</div>
                      <div className="text-sm text-gray-400">
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

        {/* Overlay para cerrar menú móvil al tocar fuera */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 top-16"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </header>
    </>
  );
}
