// Hook principal para la lógica del navbar de IMAGIQ ECOMMERCE
// Incluye búsqueda, menú móvil, dropdowns, scroll, rutas y handlers de navegación
import { useAuthContext } from "@/features/auth/context";
import { useCartContext } from "@/features/cart/CartContext";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { useDebounce } from "@/hooks/useDebounce";
import { posthogUtils } from "@/lib/posthogClient";
import { useProductContext } from "@/features/products/ProductContext";
import { navbarRoutes } from "@/routes/navbarRoutes";
import { usePathname, useRouter } from "next/navigation";
import {
  RefCallback,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  const cleanPath = pathname?.split(/[?#]/)[0] ?? ""; // Ruta limpia sin query/hash
  const isHome = pathname === "/"; // ¿Está en home?
  const isLogin = pathname === "/login"; // ¿Está en login?
  const isOfertas = pathname === "/ofertas"; // ¿Está en ofertas?
  const debouncedSearch = useDebounce(searchQuery, 300); // Query de búsqueda con debounce
  const { cart: cartItems, itemCount } = useCartContext();
  const { isAppliance } = useProductContext();
  // Derivar cartCount con useMemo para evitar stale closures
  const cartCount = useMemo(() => {
    return Array.isArray(cartItems)
      ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
  }, [cartItems]);
  // Estado para animación del badge
  const [bump, setBump] = useState(false);
  // Efecto: activa animación cuando cambia cartCount
  useEffect(() => {
    if (cartCount > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 200);
      return () => clearTimeout(timer);
    } else {
      setBump(false);
    }
  }, [cartCount]);
  // Sincronización multi-tab: escucha storage
  useEffect(() => {
    const syncCart = () => {
      try {
        const stored = localStorage.getItem("cart-items");
        if (stored) {
          setBump(true);
          setTimeout(() => setBump(false), 200);
        }
      } catch {}
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);
  const { isAuthenticated, user } = useAuthContext(); // ¿Usuario autenticado? y datos del usuario
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
    pathname?.startsWith("/productos/") &&
    !pathname?.includes("/productos/dispositivos-moviles");
  const isDispositivosMoviles = pathname?.startsWith(
    "/productos/dispositivos-moviles"
  ) ?? false;
  const isElectrodomesticos = pathname?.startsWith(
    "/productos/electrodomesticos"
  ) ?? false;
  const isNavbarItem = navbarRoutes.some((route: (typeof navbarRoutes)[0]) =>
    pathname?.startsWith(route.href) ?? false
  );
  const isHeroScrolled = isHome && isScrolled;
  const isScrolledNavbar =
    (isScrolled && (isNavbarItem || isProductDetail)) || isHeroScrolled;
  const isMasInformacionProducto =
    pathname?.startsWith("/productos/view/") ||
    pathname?.startsWith("/productos/dispositivos-moviles/details");
  // Determina si mostrar logo blanco y estilos claros
  const showWhiteLogo = isOfertas || (isHome && !isScrolled);
  const showWhiteItems = showWhiteLogo;
  const showWhiteItemsMobile =
    isOfertas ||
    (isMasInformacionProducto && !isScrolled && !isAppliance) ||
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
  const handleCartClick = useCallback(() => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: cartCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/carrito");
  }, [cartCount, isAuthenticated, router]);

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
    user, // Nuevo: datos del usuario para saludo
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
    cartCount, // Nuevo: fuente de verdad del contador
    bump, // Estado para animación del badge
  };
}
