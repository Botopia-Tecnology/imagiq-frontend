"use client";
/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 * Limpio, escalable y con animaciones suaves en hover
 */
import { useState, useEffect, useRef, RefCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartContext } from "@/features/cart/CartContext";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import TelevisionesDropdown from "./dropdowns/televisiones";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import { navbarRoutes } from "../routes/navbarRoutes";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import logoSamsungBlack from "@/img/Samsung_black.png";
import carritoIconWhite from "@/img/navbar-icons/carrito-icon-white.png";
import carritoIconBlack from "@/img/navbar-icons/carrito-icon-black.png";
import favoritoIconWhite from "@/img/navbar-icons/favorito-icon-white.png";
import favoritoIconBlack from "@/img/navbar-icons/favoritos-icon-black.png";
import searchIconWhite from "@/img/navbar-icons/search-icon-white.png";
import searchIconBlack from "@/img/navbar-icons/search-icon-black.png";
import userIconWhite from "@/img/navbar-icons/user-icon-white.png";
import userIconBlack from "@/img/navbar-icons/user-icon-black.png";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";

// Helper para dropdown
const getDropdownComponent = (name: string) => {
  switch (name) {
    case "Dispositivos móviles":
      return <DispositivosMovilesDropdown />;
    case "Televisores y AV":
      return <TelevisionesDropdown />;
    case "Electrodomésticos":
      return <ElectrodomesticosDropdown />;
    default:
      return null;
  }
};

// Elimina DROPDOWN_ITEMS, tipa searchResults correctamente
interface SearchResult {
  id: number;
  name: string;
  category: string;
}

export default function Navbar() {
  // Estados principales
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
  const [isClient, setIsClient] = useState(false);
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const cleanPath = pathname.split(/[?#]/)[0];
  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isOfertas = pathname === "/ofertas";
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { itemCount } = useCartContext();
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const { hideNavbar } = useNavbarVisibility();

  // Efecto para detectar cliente
  useEffect(() => setIsClient(true), []);

  // Efecto scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(handleScroll, 0);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Efecto búsqueda
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
    } else setSearchResults([]);
  }, [debouncedSearch, isAuthenticated]);

  // Helpers de color y estado
  const isProductDetail =
    pathname.startsWith("/productos/") &&
    !pathname.includes("/productos/dispositivos-moviles");
  const isDispositivosMoviles = pathname.startsWith(
    "/productos/dispositivos-moviles"
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
  const isMasInformacionProducto = pathname.startsWith("/productos/view/");
  const showWhiteLogo =
    isMasInformacionProducto && !isScrolled
      ? true
      : isOfertas || (isHome && !isScrolled);
  const showWhiteItems = showWhiteLogo;
  const showWhiteItemsMobile =
    isOfertas ||
    (isMasInformacionProducto && !isScrolled) ||
    (!isScrolledNavbar &&
      !isLogin &&
      (isProductDetail || (isHome && !isScrolled)));

  // Dropdown hover handlers
  const handleDropdownEnter = (dropdownName: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
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
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
  };
  const handleDropdownContainerLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };
  const setNavItemRef: RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      const itemName = el.getAttribute("data-item-name");
      if (itemName) navItemRefs.current[itemName] = el;
    }
  };

  // Handler búsqueda
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

  // Handler carrito
  const handleCartClick = () => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: itemCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/carrito");
  };

  // Handler navegación
  const handleNavClick = (item: (typeof navbarRoutes)[0]) => {
    posthogUtils.capture("navbar_click", {
      nav_item: item.name,
      nav_category: item.category,
      nav_href: item.href,
      user_authenticated: isAuthenticated,
    });
    setIsMobileMenuOpen(false);
  };

  /**
   * Renderiza el dropdown animado para el item activo
   * Combina fade + slide para una experiencia suave
   */
  const renderDropdown = (itemName: string) =>
    activeDropdown === itemName && dropdownCoords ? (
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
        className="transition-all duration-900 ease-[cubic-bezier(.4,0,.2,1)] opacity-100 translate-y-4 animate-fade-in bg-white rounded-xl shadow-lg will-change-transform will-change-opacity"
      >
        {getDropdownComponent(itemName)}
      </div>
    ) : null;

  // --- Render principal ---
  return (
    <header
      data-navbar="true"
      className={cn(
        "w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/60",
        "sticky top-0 left-0 md:static",
        isOfertas && !isScrolled
          ? "bg-transparent"
          : isOfertas && isScrolled
          ? "bg-white/60 shadow backdrop-blur-md"
          : isDispositivosMoviles || isElectrodomesticos || isScrolledNavbar
          ? "bg-white/60 shadow backdrop-blur-md"
          : isHome && !isScrolled
          ? "bg-transparent"
          : isProductDetail
          ? "bg-transparent"
          : "bg-white/60 shadow backdrop-blur-md"
      )}
      style={{
        boxShadow:
          isOfertas && !isScrolled
            ? "none"
            : isScrolled
            ? "0 2px 8px 0 rgba(30, 64, 175, 0.12)"
            : "none",
        background: isOfertas && !isScrolled ? "transparent" : undefined,
        transition:
          "background 0.6s cubic-bezier(.4,0,.2,1), box-shadow 0.6s cubic-bezier(.4,0,.2,1)",
      }}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Logo principal */}
      <div className="flex items-center justify-between h-16 px-8 max-w-full">
        <div className="flex items-center flex-shrink-0 gap-1 md:gap-2">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              posthogUtils.capture("logo_click", { source: "navbar" });
              router.push("/");
            }}
            aria-label="Inicio"
            className="flex items-center gap-0 md:gap-0 cursor-pointer"
            style={{ padding: 0 }}
          >
            <Image
              src={
                showWhiteLogo ? "/frame_311_white.png" : "/frame_311_black.png"
              }
              alt="Q Logo"
              height={22}
              width={22}
              className="h-[22px] w-[22px] min-w-[22px] md:h-[24px] md:w-[24px] md:min-w-[24px]"
              priority
            />
            <Image
              src={showWhiteLogo ? logoSamsungWhite : logoSamsungBlack}
              alt="Samsung Logo"
              height={28}
              className="h-7 min-w-[80px] md:h-8 md:min-w-[120px]"
              priority
            />
            <span
              className={
                showWhiteLogo
                  ? "ml-2 text-base font-bold tracking-wide text-white select-none"
                  : "ml-2 text-base font-bold tracking-wide text-black select-none"
              }
              style={{
                marginLeft: 8,
                marginRight: 0,
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              Store
            </span>
          </Link>
        </div>
        {/* Iconos desktop */}
        <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
          {/* Buscador */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white/70 backdrop-blur-md rounded-full px-4 h-12 shadow-sm border border-white/30 transition-all duration-300 w-72"
            style={{ zIndex: 1000, overflow: "hidden" }}
          >
            <input
              type="text"
              className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:outline-none text-lg px-2"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar productos"
              autoComplete="off"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10"
              title="Buscar"
              style={{ zIndex: 1001 }}
            >
              <Image
                src={showWhiteItems ? searchIconWhite : searchIconBlack}
                alt="Buscar"
                width={26}
                height={26}
                priority
              />
            </button>
          </form>
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
            <Image
              src={showWhiteItems ? userIconWhite : userIconBlack}
              alt="Usuario"
              width={28}
              height={28}
              priority
            />
          </button>
          {/* Icono carrito */}
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
            <Image
              src={showWhiteItems ? carritoIconWhite : carritoIconBlack}
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
          {/* Icono favoritos */}
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
            onClick={() => router.push("/product-favoritos")} // <-- Redirecciona aquí
          >
            <Image
              src={showWhiteItems ? favoritoIconWhite : favoritoIconBlack}
              alt="Favoritos"
              width={20}
              height={21}
              priority
            />
          </button>
        </div>
        {/* Navbar móvil */}
        <div className="absolute right-0 top-0 flex md:hidden items-center h-16 space-x-4 pr-2 md:static md:w-auto">
          {/* Icono buscar */}
          <button
            className={cn(
              "flex items-center justify-center w-10 h-10 text-2xl font-bold",
              showWhiteItemsMobile ? "text-white" : "text-black"
            )}
            title={searchQuery === "focus" ? "Cerrar buscador" : "Buscar"}
            aria-label={searchQuery === "focus" ? "Cerrar buscador" : "Buscar"}
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
          {/* Icono carrito */}
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
          {/* Icono menú hamburguesa */}
          <button
            className={cn(
              "flex items-center justify-center w-10 h-10",
              showWhiteItemsMobile ? "text-white" : "text-black"
            )}
            aria-label="Abrir menú"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Input animado */}
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
                  <Image
                    src={searchIconWhite}
                    alt="Buscar"
                    width={26}
                    height={26}
                    priority
                  />
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
      {/* Menú de navegación principal - animación hover suave */}
      <nav
        className={cn(
          "hidden md:block transition-all duration-500 relative",
          isScrolled
            ? "max-h-0 opacity-0 overflow-hidden"
            : "max-h-20 opacity-100"
        )}
      >
        <ul className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
          {navbarRoutes.map((item) => {
            // Indicador activo
            const isActive =
              item.name === "Electrodomésticos"
                ? pathname.startsWith("/productos/Electrodomesticos")
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  pathname.startsWith(item.href + "?") ||
                  pathname.startsWith(item.href + "#") ||
                  cleanPath === item.href ||
                  cleanPath.startsWith(item.href + "/") ||
                  cleanPath.startsWith(item.href + "?") ||
                  cleanPath.startsWith(item.href + "#");
            // Clases animación hover suave mejorada SOLO Tailwind
            const itemTextColor = showWhiteItems
              ? "text-white"
              : "text-gray-800";
            const activeIndicatorColor =
              showWhiteItems && isActive
                ? "bg-white"
                : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600";
            // Animación hover: fade + slide + escala, curva personalizada
            const hoverClass = cn(
              "transition-all duration-900 ease-[cubic-bezier(.4,0,.2,1)] will-change-transform will-change-opacity transform-gpu",
              showWhiteItems
                ? "hover:scale-110 hover:opacity-90 hover:-translate-y-1"
                : "hover:text-blue-700 hover:scale-105 hover:opacity-90 hover:-translate-y-1"
            );
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
                      "text-lg font-normal whitespace-nowrap block py-3 px-2 lg:px-4 rounded-lg focus:outline-none",
                      itemTextColor,
                      hoverClass,
                      isActive && showWhiteItems && "text-white",
                      isActive && !showWhiteItems && "text-gray-900"
                    )}
                    aria-label={item.name}
                  >
                    <span className="relative flex flex-col items-center">
                      {item.name}
                      {/* Indicador activo con animación fade/slide */}
                      <span
                        className={cn(
                          "hidden md:block w-full mt-1 rounded-full transition-all duration-900 ease-[cubic-bezier(.4,0,.2,1)] will-change-transform will-change-opacity transform-gpu",
                          isActive
                            ? `h-[4px] ${activeIndicatorColor} shadow-md scale-x-105 opacity-100 translate-y-0`
                            : "h-[2px] bg-transparent opacity-0 -translate-y-2"
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                  {/* Dropdown con animación fade + slide */}
                  {activeDropdown === item.name && renderDropdown(item.name)}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Overlay menú móvil */}
      {isMobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black/50 z-30 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 shadow-lg border-t border-gray-200 flex flex-col animate-slide-in overflow-y-auto">
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
