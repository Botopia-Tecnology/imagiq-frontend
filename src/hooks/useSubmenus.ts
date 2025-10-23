import { useState, useEffect } from 'react';
import { menusEndpoints, type Submenu } from '@/lib/api';
import type { Category } from '@/app/productos/[categoria]/components/CategorySlider';

export function useSubmenus(menuUuid: string | null) {
  const [submenus, setSubmenus] = useState<Submenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay menuUuid, no hacer fetch
    if (!menuUuid) {
      setSubmenus([]);
      setLoading(false);
      return;
    }

    const fetchSubmenus = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await menusEndpoints.getSubmenus(menuUuid);

        if (response.success && response.data) {
          // Filtrar solo los submenús activos y ordenarlos
          const activeSubmenus = response.data
            .filter(submenu => submenu.activo)
            .sort((a, b) => a.orden - b.orden);
          setSubmenus(activeSubmenus);
        } else {
          setError(response.message || 'Error al cargar submenús');
          setSubmenus([]);
        }
      } catch (err) {
        console.error('Error fetching submenus:', err);
        setError('Error al cargar submenús');
        setSubmenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmenus();
  }, [menuUuid]);

  /**
   * Transforma los submenús de la API al formato Category para el CategorySlider
   */
  const transformToCategories = (baseHref: string): Category[] => {
    return submenus.map(submenu => ({
      id: submenu.uuid,
      name: submenu.nombreVisible || submenu.nombre,
      subtitle: '', // Los submenús no tienen subtitle en la estructura actual
      image: submenu.imagen || '', // URL de la imagen desde la API
      href: `${baseHref}?submenu=${submenu.uuid}`, // Genera href con el uuid del submenú
    }));
  };

  return {
    submenus,
    loading,
    error,
    transformToCategories
  };
}
