"use client";
/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 */

import { useAuthContext } from "@/features/auth/context";
import { useCartContext } from "@/features/cart/CartContext";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { useDebounce } from "@/hooks/useDebounce";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import carritoIconBlack from "@/img/navbar-icons/carrito-icon-black.png";
import carritoIconWhite from "@/img/navbar-icons/carrito-icon-white.png";
import favoritoIconWhite from "@/img/navbar-icons/favorito-icon-white.png";
import favoritoIconBlack from "@/img/navbar-icons/favoritos-icon-black.png";
import searchIconBlack from "@/img/navbar-icons/search-icon-black.png";
import searchIconWhite from "@/img/navbar-icons/search-icon-white.png";
import userIconBlack from "@/img/navbar-icons/user-icon-black.png";
import userIconWhite from "@/img/navbar-icons/user-icon-white.png";
import logoSamsungBlack from "@/img/Samsung_black.png";
import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";
import { Heart, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RefCallback, useEffect, useMemo, useRef, useState } from "react";
import { navbarRoutes } from "../routes/navbarRoutes";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import TelevisionesDropdown from "./dropdowns/televisiones";

// Dropdown item type literals (no runtime value needed)
type DropdownItemType =
  | "Dispositivos móviles"
  | "Televisores y AV"
  | "Electrodomésticos";

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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Nuevo ref para debounce

  const pathname = usePathname();
  // Detectar si estamos en la sección "más información" de dispositivos móviles (incluye subrutas)
  // const isMasInformacionDispositivosMoviles = pathname.startsWith(
  //   "/productos/dispositivos-moviles/mas-informacion"
  // );
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

  const { hideNavbar } = useNavbarVisibility();

  // Efecto para detectar cliente
  useEffect(() => setIsClient(true), []);

  // EFECTO SCROLL OPTIMIZADO - Sin parpadeo
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;

        // Cancelar timeout anterior si existe
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Usar requestAnimationFrame para sincronizar con el render
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shouldBeScrolled = scrollY > 100;

          // Solo actualizar si el estado realmente cambió
          setIsScrolled((prev) => {
            if (prev !== shouldBeScrolled) {
              return shouldBeScrolled;
            }
            return prev;
          });

          ticking = false;
        });
      }
    };

    // Throttle adicional para evitar demasiadas actualizaciones
    const throttledScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Ejecutar una vez al montar
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
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
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, isAuthenticated]);

  // 3. Funciones
  // function hasDropdown(name: string) {
  //   return DROPDOWN_ITEMS.includes(name as DropdownItemType);
  // }

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

  // Lógica de colores y estado (optimizada con useMemo)
  const navbarConfig = useMemo(() => {
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

    // Determinar estilos de manera consistente
    let backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
    let boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    let background: string | undefined = undefined;

    if (isOfertas && !isScrolled) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    } else if (isOfertas && isScrolled) {
      backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
      boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    } else if (
      isDispositivosMoviles ||
      isElectrodomesticos ||
      isScrolledNavbar
    ) {
      backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
      boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    } else if (isHome && !isScrolled) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    } else if (isProductDetail) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    } else {
      backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
      boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    }

    return {
      showWhiteLogo,
      showWhiteItems,
      showWhiteItemsMobile,
      backgroundStyle,
      boxShadow,
      background,
      isDispositivosMoviles,
      isElectrodomesticos,
    };
  }, [isScrolled, isOfertas, isHome, isLogin, pathname]);

  // Dropdown hover handlers
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
    !pathname.includes("/productos/dispositivos-moviles");
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
    <>
      <header
        data-navbar="true"
        className={cn(
          "w-full z-50 backdrop-blur-md sticky top-0 left-0 md:static",
          // Transición suave optimizada
          "transition-all duration-300 ease-in-out",
          navbarConfig.backgroundStyle,
          // Aplicar hideNavbar con transform en lugar de display
          hideNavbar
            ? "transform -translate-y-full opacity-0"
            : "transform translate-y-0 opacity-100"
        )}
        style={{
          boxShadow: navbarConfig.boxShadow,
          background: navbarConfig.background,
          // Transición más suave y consistente
          transition: hideNavbar
            ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
            : "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          // Optimización de rendimiento
          willChange: hideNavbar
            ? "transform, opacity"
            : "background, box-shadow",
        }}
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
              className="flex items-center gap-2"
            >
              <Image
                src={
                  navbarConfig.showWhiteLogo
                    ? "/frame_311_white.png"
                    : "/frame_311_black.png"
                }
                alt="Q Logo"
                height={32}
                width={32}
                style={{ minWidth: 32, width: 32 }}
                priority
              />
              <Image
                src={
                  navbarConfig.showWhiteLogo
                    ? logoSamsungWhite
                    : logoSamsungBlack
                }
                alt="Samsung Logo"
                height={32}
                style={{ minWidth: 120, width: "auto" }}
                priority
              />
              <Image
                src={showWhiteLogo ? "/store_white.png" : "/store_black.png"}
                alt="Store Logo"
                height={20}
                width={60}
                style={{ minWidth: 36, width: 36 }}
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
                navbarConfig.isDispositivosMoviles ||
                  navbarConfig.isElectrodomesticos
                  ? "text-black"
                  : navbarConfig.showWhiteItems
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
                src={
                  navbarConfig.showWhiteItems ? userIconWhite : userIconBlack
                }
                alt="Usuario"
                width={28}
                height={28}
                priority
              />
            </button>

            {/* Icono carrito con badge SIEMPRE visible si itemCount > 0 */}
            <Link
              href="/carrito"
              className={cn(
                "flex items-center justify-center w-10 h-10 relative text-black",
                navbarConfig.isDispositivosMoviles ||
                  navbarConfig.isElectrodomesticos
                  ? "text-black"
                  : navbarConfig.showWhiteItems
                  ? "text-white"
                  : "text-black"
              )}
              title="Carrito de compras"
              onClick={handleCartClick}
            >
              <Image
                src={
                  navbarConfig.showWhiteItems
                    ? carritoIconWhite
                    : carritoIconBlack
                }
                alt="Carrito"
                width={34}
                height={34}
                priority
              />
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

            {/* Icono corazón al lado derecho del carrito */}
            <button
              type="button"
              className={cn(
                "flex items-center justify-center w-10 h-10",
                navbarConfig.isDispositivosMoviles ||
                  navbarConfig.isElectrodomesticos
                  ? "text-black"
                  : navbarConfig.showWhiteItems
                  ? "text-white"
                  : "text-black"
              )}
              title="Favoritos"
              aria-label="Favoritos"
              style={{ position: "relative" }}
              onClick={() => router.push("/product-favoritos")}
            >
              <Heart
                className={
                  showWhiteItems ? "w-6 h-6 text-white" : "w-6 h-6 text-black"
                }
              />
              <Image
                src={
                  navbarConfig.showWhiteItems
                    ? favoritoIconWhite
                    : favoritoIconBlack
                }
                alt="Favoritos"
                width={20}
                height={21}
                priority
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

        {/* Navbar móvil */}
        <div className="absolute right-0 top-0 flex md:hidden items-center h-16 space-x-4 pr-2 md:static md:w-auto">
          {/* Icono buscar */}
          <button
            className={cn(
              "flex items-center justify-center w-10 h-10 text-2xl font-bold",
              navbarConfig.showWhiteItemsMobile ? "text-white" : "text-black"
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
                src={
                  navbarConfig.showWhiteItemsMobile
                    ? searchIconWhite
                    : searchIconBlack
                }
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
              navbarConfig.showWhiteItemsMobile ? "text-white" : "text-black"
            )}
            title="Carrito"
            onClick={handleCartClick}
          >
            <Image
              src={
                navbarConfig.showWhiteItemsMobile
                  ? carritoIconWhite
                  : carritoIconBlack
              }
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
              navbarConfig.showWhiteItemsMobile ? "text-white" : "text-black"
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
      </header>
      <nav
        className={cn(
          "hidden md:block relative overflow-hidden",
          "transition-all duration-300 ease-in-out",
          isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        )}
        style={{
          willChange: "max-height, opacity",
        }}
      >
        <ul className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
          {navbarRoutes.map((item) => {
            // Indicador activo: cubre coincidencia exacta, rutas hijas y query params para Electrodomésticos
            let isActive = false;
            if (item.name === "Electrodomésticos") {
              isActive = pathname.startsWith("/productos/electrodomesticos");
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
            const itemTextColor = navbarConfig.showWhiteItems
              ? "text-white"
              : "text-gray-800";
            const activeIndicatorColor =
              navbarConfig.showWhiteItems && isActive
                ? "bg-white"
                : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600";

            // Animación hover: fade + slide + escala, curva personalizada
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
                      isActive && navbarConfig.showWhiteItems && "text-white",
                      isActive &&
                        !navbarConfig.showWhiteItems &&
                        "text-gray-900"
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
    </>
  );
}
