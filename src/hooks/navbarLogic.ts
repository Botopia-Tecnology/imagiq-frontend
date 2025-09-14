import { useState, useEffect, useRef, RefCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartContext } from "@/features/cart/CartContext";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { navbarRoutes } from "@/routes/navbarRoutes";

export interface SearchResult {
  id: number;
  name: string;
  category: string;
}

export function useNavbarLogic() {
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

  // Sentinel para IntersectionObserver (scroll detection)
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Efecto scroll usando IntersectionObserver
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
  const isNavbarItem = navbarRoutes.some((route: typeof navbarRoutes[0]) =>
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
