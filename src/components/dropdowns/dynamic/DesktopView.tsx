import type { FC } from "react";
import { useCallback, useRef } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { CloseButton } from "@/components/navbar/components/CloseButton";
import type { MenuItem } from "./types";
import { usePrefetchProducts } from "@/hooks/usePrefetchProducts";
import { menusEndpoints } from "@/lib/api";


type Props = {
  items: MenuItem[];
  categoryName: string;
  categoryCode?: string;
  onItemClick: (label: string, href: string) => void;
  loading?: boolean;
};

export const DesktopView: FC<Props> = ({ items, categoryName, categoryCode, onItemClick, loading = false }) => {
  const { prefetchWithDebounce, cancelPrefetch, prefetchProducts } = usePrefetchProducts();
  
  // Ref para manejar timers de debounce de submenús
  const submenuPrefetchTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  
  // Ref para rastrear qué menús ya están precargando productos de submenús
  const menuSubmenuProductsPrefetchingRef = useRef<Set<string>>(new Set());
  
  // Ref para rastrear timers de prefetch de productos de submenús por menú
  const submenuProductsPrefetchTimersRef = useRef<Map<string, Array<ReturnType<typeof setTimeout>>>>(new Map());

  // Prefetch productos cuando el usuario hace hover sobre un menú
  const handleMenuHover = useCallback((menuUuid: string) => {
    if (!categoryCode) return;
    
    // El prefetch solo necesita categoryCode y menuUuid
    // La categoría (slug) no es necesaria para el prefetch, solo se usa para navegación
    prefetchWithDebounce({
      categoryCode,
      menuUuid,
      // categoria es opcional y solo se usa como metadata
    }, 200); // Debounce de 200ms
    
    // Precargar submenús del menú con debounce
    // Limpiar timer anterior si existe
    const existingTimer = submenuPrefetchTimers.current.get(menuUuid);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Crear nuevo timer para precargar submenús
    const timer = setTimeout(async () => {
      try {
        // Llamada silenciosa para precargar submenús
        // El endpoint ya maneja caché y deduplicación automáticamente
        const submenusResponse = await menusEndpoints.getSubmenus(menuUuid);
        
        // Si ya estamos precargando productos de submenús para este menú, no hacerlo de nuevo
        if (menuSubmenuProductsPrefetchingRef.current.has(menuUuid)) {
          submenuPrefetchTimers.current.delete(menuUuid);
          return;
        }
        
        // Si hay submenús activos, precargar productos de cada uno
        if (submenusResponse.success && submenusResponse.data) {
          const activeSubmenus = submenusResponse.data.filter(submenu => submenu.activo && submenu.uuid);
          
          if (activeSubmenus.length > 0) {
            menuSubmenuProductsPrefetchingRef.current.add(menuUuid);
            
            // Limpiar timers anteriores si existen
            const existingProductTimers = submenuProductsPrefetchTimersRef.current.get(menuUuid);
            if (existingProductTimers) {
              existingProductTimers.forEach(t => clearTimeout(t));
            }
            
            const productTimers: Array<ReturnType<typeof setTimeout>> = [];
            
            // Precargar productos de cada submenú activo con delay escalonado
            activeSubmenus.forEach((submenu, index) => {
              if (!submenu.uuid) return;
              
              // Delay escalonado: 0ms, 100ms, 200ms, etc.
              const productTimer = setTimeout(() => {
                prefetchProducts({
                  categoryCode,
                  menuUuid,
                  submenuUuid: submenu.uuid,
                }).catch(() => {
                  // Silenciar errores
                });
              }, index * 100); // Escalonar cada 100ms
              
              productTimers.push(productTimer);
            });
            
            // Guardar timers para poder cancelarlos
            submenuProductsPrefetchTimersRef.current.set(menuUuid, productTimers);
          }
        }
      } catch (error) {
        // Silenciar errores en prefetch - no afectar la UX
        console.debug("[SubmenuPrefetch] Error silencioso:", error);
      } finally {
        submenuPrefetchTimers.current.delete(menuUuid);
      }
    }, 200); // Debounce de 200ms
    
    submenuPrefetchTimers.current.set(menuUuid, timer);
  }, [categoryCode, prefetchWithDebounce, prefetchProducts]);

  // Cancelar prefetch cuando el usuario deja de hacer hover
  const handleMenuLeave = useCallback((menuUuid: string) => {
    if (!categoryCode) return;
    
    cancelPrefetch({
      categoryCode,
      menuUuid,
    });
    
    // Limpiar timer de precarga de submenús si existe
    const timer = submenuPrefetchTimers.current.get(menuUuid);
    if (timer) {
      clearTimeout(timer);
      submenuPrefetchTimers.current.delete(menuUuid);
    }
    
    // Limpiar timers de prefetch de productos de submenús
    const productTimers = submenuProductsPrefetchTimersRef.current.get(menuUuid);
    if (productTimers) {
      productTimers.forEach(t => clearTimeout(t));
      submenuProductsPrefetchTimersRef.current.delete(menuUuid);
    }
    
    // Nota: No removemos de menuSubmenuProductsPrefetchingRef porque queremos
    // que los productos sigan precargándose en background aunque el usuario deje de hacer hover
  }, [categoryCode, cancelPrefetch]);

  // Filtrar solo items activos
  const activeItems = items.filter(item => item.activo);

  // Mostrar skeleton solo si está cargando Y no hay menús disponibles
  // Esto permite que cada categoría muestre sus menús independientemente tan pronto como estén disponibles
  if (loading && activeItems.length === 0) {
    return (
      <div
        className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 relative"
        role="status"
        aria-label="Cargando menús"
      >
        <CloseButton onClick={() => onItemClick("close", "")} />
        <div className="w-full">
          <div className="grid gap-4 grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="w-full h-32 bg-gray-200 rounded-lg" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (activeItems.length === 0) {
    return (
      <div
        className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 relative"
        role="menu"
        aria-label={categoryName}
      >
        <CloseButton onClick={() => onItemClick("close", "")} />
        <div className="text-center py-8 text-gray-500">
          No hay menús disponibles para esta categoría
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 relative"
      role="menu"
      aria-label={categoryName}
    >
      <CloseButton onClick={() => onItemClick("close", "")} />

      <div className="w-full">
        <ul className={`grid gap-4 ${activeItems.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {activeItems.map((item) => (
            <MenuItemCard 
              key={item.uuid} 
              item={item} 
              onClick={onItemClick}
              onHover={handleMenuHover}
              onLeave={handleMenuLeave}
            />
          ))}
        </ul>
      </div>

    </div>
  );
};
