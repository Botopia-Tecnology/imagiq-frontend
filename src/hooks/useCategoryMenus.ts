import { useEffect, useMemo, useState } from 'react';
import { useVisibleCategories } from './useVisibleCategories';
import { menusEndpoints, type Menu } from '@/lib/api';

export function useCategoryMenus(categoriaNombre?: string) {
  const { visibleCategories } = useVisibleCategories();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryUuid = useMemo(() => {
    if (!categoriaNombre) return null;
    const category = visibleCategories.find(cat => cat.nombre === categoriaNombre);
    return category?.uuid ?? null;
  }, [visibleCategories, categoriaNombre]);

  useEffect(() => {
    if (!categoryUuid) return;

    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await menusEndpoints.getMenusByCategory(categoryUuid);
        if (!isMounted) return;
        if (resp.success && resp.data) {
          // Filtrar activos y ordenar por orden
          const active = (resp.data as Menu[]).filter(m => m.activo).sort((a, b) => a.orden - b.orden);
          setMenus(active);
        } else {
          setMenus([]);
          setError(resp.message || 'Error al cargar menús');
        }
      } catch (e) {
        if (!isMounted) return;
        setError('Error al cargar menús');
        setMenus([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [categoryUuid]);

  return { menus, loading, error };
}


