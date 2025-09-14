// Hook principal para la lógica del navbar de IMAGIQ ECOMMERCE
// Incluye búsqueda, menú móvil, dropdowns, scroll, rutas y handlers de navegación
import { useState, useEffect, useRef, RefCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartContext } from "@/features/cart/CartContext";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { navbarRoutes } from "@/routes/navbarRoutes";

// Tipo para resultados de búsqueda
export interface SearchResult {
  id: number;
  name: string;
  category: string;
}

export function useNavbarLogic() {
  // Estados principales del navbar
  const [searchQuery, setSearchQuery] = useState(""); // Query de búsqueda
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Menú móvil abierto
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // Resultados de búsqueda
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Dropdown activo
  const [dropdownCoords, setDropdownCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null); // Coordenadas del dropdown
  const [isScrolled, setIsScrolled] = useState(false); // Estado de scroll
  const [isClient, setIsClient] = useState(false); // Detecta si es cliente
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Referencias a items del navbar
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout para ocultar dropdown
  const pathname = usePathname(); // Ruta actual
  const cleanPath = pathname.split(/[?#]/)[0]; // Ruta limpia sin query/hash
  const isHome = pathname === "/"; // ¿Está en home?
  const isLogin = pathname === "/login"; // ¿Está en login?
  const isOfertas = pathname === "/ofertas"; // ¿Está en ofertas?
  const debouncedSearch = useDebounce(searchQuery, 300); // Query de búsqueda con debounce
  const { itemCount } = useCartContext(); // Cantidad de productos en carrito
  const { isAuthenticated } = useAuthContext(); // ¿Usuario autenticado?
  const router = useRouter(); // Router para navegación
  const { hideNavbar } = useNavbarVisibility(); // Estado global para ocultar navbar

  // Efecto para detectar si está en cliente (evita SSR issues)
  useEffect(() => setIsClient(true), []);

  // Sentinel para IntersectionObserver (detecta scroll en navbar)
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Efecto: Detecta scroll usando IntersectionObserver y actualiza estado
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    setIsScrolled(sentinel.getBoundingClientRect().top < 0);
    return () => observer.disconnect();
  }, [pathname]);

  // Efecto: Ejecuta búsqueda y actualiza resultados (mock) + analytics
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

  // Helpers para rutas y estado visual del navbar
  const isProductDetail =
    pathname.startsWith("/productos/") &&
    !pathname.includes("/productos/dispositivos-moviles");
  const isDispositivosMoviles = pathname.startsWith(
    "/productos/dispositivos-moviles"
  );
  const isElectrodomesticos = pathname.startsWith(
    "/productos/Electrodomesticos"
  );
  const isNavbarItem = navbarRoutes.some((route: (typeof navbarRoutes)[0]) =>
    pathname.startsWith(route.href)
  );
  const isHeroScrolled = isHome && isScrolled;
  const isScrolledNavbar =
    (isScrolled && (isNavbarItem || isProductDetail)) || isHeroScrolled;
  const isMasInformacionProducto = pathname.startsWith("/productos/view/");
  // Determina si mostrar logo blanco y estilos claros
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

  // Handlers para hover de dropdowns (animación y posición)
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
  // Handler para salir del dropdown (con timeout para animación)
  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };
  // Handler para entrar al contenedor del dropdown (cancela timeout)
  const handleDropdownContainerEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
  };
  // Handler para salir del contenedor del dropdown (inicia timeout)
  const handleDropdownContainerLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };
  // Ref callback para asociar refs a items del navbar
  const setNavItemRef: RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      const itemName = el.getAttribute("data-item-name");
      if (itemName) navItemRefs.current[itemName] = el;
    }
  };

  // Handler para submit de búsqueda (envía analytics y navega)
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

  // Handler para click en carrito (envía analytics y navega)
  const handleCartClick = () => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: itemCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/carrito");
  };

  // Handler para click en item de navbar (envía analytics y cierra menú móvil)
  const handleNavClick = (item: (typeof navbarRoutes)[0]) => {
    posthogUtils.capture("navbar_click", {
      nav_item: item.name,
      nav_category: item.category,
      nav_href: item.href,
      user_authenticated: isAuthenticated,
    });
    setIsMobileMenuOpen(false);
  };

  // Retorna todos los estados y handlers necesarios para el navbar
  return {
    searchQuery,
    setSearchQuery,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    searchResults,
    setSearchResults,
    activeDropdown,
    setActiveDropdown,
    dropdownCoords,
    setDropdownCoords,
    isScrolled,
    setIsScrolled,
    isClient,
    setIsClient,
    navItemRefs,
    dropdownTimeoutRef,
    pathname,
    cleanPath,
    isHome,
    isLogin,
    isOfertas,
    debouncedSearch,
    itemCount,
    isAuthenticated,
    router,
    hideNavbar,
    sentinelRef,
    isProductDetail,
    isDispositivosMoviles,
    isElectrodomesticos,
    isNavbarItem,
    isHeroScrolled,
    isScrolledNavbar,
    isMasInformacionProducto,
    showWhiteLogo,
    showWhiteItems,
    showWhiteItemsMobile,
    handleDropdownEnter,
    handleDropdownLeave,
    handleDropdownContainerEnter,
    handleDropdownContainerLeave,
    setNavItemRef,
    handleSearchSubmit,
    handleCartClick,
    handleNavClick,
  };
}
