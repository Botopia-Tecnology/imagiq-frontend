// Hook principal para la lógica del navbar de IMAGIQ ECOMMERCE
// Incluye búsqueda, menú móvil, dropdowns, scroll, rutas y handlers de navegación
import { useAuthContext } from "@/features/auth/context";
import { useCartContext } from "@/features/cart/CartContext";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { useDebounce } from "@/hooks/useDebounce";
import { posthogUtils } from "@/lib/posthogClient";
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
import { useFavorites } from "@/features/products/useProducts";
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";

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
  const [showNavbar] = useState(true); // Siempre mostrar navbar (sticky)
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
  const { trackSearch, trackCategoryClick } = useAnalytics();
  // Derivar cartCount con useMemo para evitar stale closures
  // Usa itemCount como fuente de verdad para garantizar sincronización con el estado global del carrito
  const cartCount = useMemo(() => {
    // Si itemCount está disponible del contexto, úsalo como fuente principal de verdad
    if (typeof itemCount === "number") {
      return itemCount;
    }
    // Fallback: calcular basado en los items del carrito si itemCount no está disponible
    // Verificar también si el carrito está vacío (undefined, null o array vacío)
    if (!cartItems || (Array.isArray(cartItems) && cartItems.length === 0)) {
      return 0;
    }
    return Array.isArray(cartItems)
      ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : 0;
  }, [cartItems, itemCount]);

  // Hook para obtener favoritos
  const { favorites } = useFavorites();

  // Contador de favoritos - basado directamente en el estado del hook
  // El hook useFavorites ya lee del localStorage y se actualiza automáticamente
  const favoritesCount = useMemo(() => {
    if (favorites && Array.isArray(favorites)) {
      return favorites.length;
    }
    return 0;
  }, [favorites]);

  // Estado para animación del badge del carrito
  const [bump, setBump] = useState(false);
  // Estado para animación del badge de favoritos
  const [favoritesBump, setFavoritesBump] = useState(false);

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

  // Efecto: activa animación cuando cambia favoritesCount
  useEffect(() => {
    if (favoritesCount > 0) {
      setFavoritesBump(true);
      const timer = setTimeout(() => setFavoritesBump(false), 200);
      return () => clearTimeout(timer);
    } else {
      setFavoritesBump(false);
    }
  }, [favoritesCount]);
  // Sincronización multi-tab: escucha storage para actualizar contador en tiempo real
  useEffect(() => {
    const syncCart = () => {
      try {
        const stored = localStorage.getItem("cart-items");
        // Importante: verificar también si el carrito está vacío (null o undefined)
        if (stored) {
          // Verificar si hay productos en el carrito
          const parsedCart = JSON.parse(stored);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setBump(true);
            setTimeout(() => setBump(false), 200);
          } else if (Array.isArray(parsedCart) && parsedCart.length === 0) {
            // Si el carrito está vacío (array vacío), actualizar estado del contador
            setBump(false);
          }
        } else {
          // Si no hay productos (carrito vacío), actualizar estado del contador
          // Esto asegura que el contador se oculte cuando el carrito se vacía
          setBump(false);
        }
      } catch (error) {
        console.error("Error syncing cart from storage:", error);
      }
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

  // Efecto: El navbar siempre está visible (sticky behavior)
  // Ya no se necesita controlar visibilidad basada en scroll
  // useEffect eliminado para mantener navbar siempre visible

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
  const isDispositivosMoviles =
    pathname?.startsWith("/productos/dispositivos-moviles") ?? false;
  const isElectrodomesticos =
    pathname?.startsWith("/productos/electrodomesticos") ?? false;
  const isNavbarItem = navbarRoutes.some(
    (route: (typeof navbarRoutes)[0]) =>
      pathname?.startsWith(route.href) ?? false
  );
  const isHeroScrolled = isHome && isScrolled;
  const isScrolledNavbar =
    (isScrolled && (isNavbarItem || isProductDetail)) || isHeroScrolled;
  const isMasInformacionProducto =
    pathname?.startsWith("/productos/view/") ||
    pathname?.startsWith("/productos/dispositivos-moviles/details");
  // Determina si mostrar logo blanco y estilos claros
  // CAMBIO: En home siempre usar logo NEGRO para que se vea sobre el video oscuro
  // Solo en ofertas mantener el logo blanco cuando está arriba
  const isAtTop = typeof window !== "undefined" ? window.scrollY < 100 : true;
  const showWhiteLogo = isOfertas && !activeDropdown && isAtTop && !isScrolled;
  // Forzar texto blanco en ofertas cuando está arriba, negro en home
  const showWhiteItems = isOfertas && !activeDropdown && isAtTop && !isScrolled;
  const showWhiteItemsMobile = false; // Siempre texto negro en mobile

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
      // 🔥 Track Search Event para GA4
      trackSearch(searchQuery.trim(), searchResults.length);

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

  // Handler para click en favoritos (envía analytics y navega)
  const handleFavoritesClick = useCallback(() => {
    posthogUtils.capture("favorites_icon_click", {
      favorites_count: favoritesCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/favoritos");
  }, [favoritesCount, isAuthenticated, router]);

  // Handler para click en item de navbar (envía analytics y cierra menú móvil)
  const handleNavClick = (item: {
    name: string;
    category: string;
    href: string;
  }) => {
    // 🔥 Track Category Click Event para GA4
    trackCategoryClick(item.category, item.name);

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
    showNavbar,
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
    cartCount,
    bump,
    favoritesCount,
    favoritesBump,
    handleFavoritesClick,
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
  };
}
