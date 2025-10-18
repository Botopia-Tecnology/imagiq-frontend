import { useState, useEffect } from 'react';
import { categoriesEndpoints, type VisibleCategory } from '@/lib/api';

export function useVisibleCategories() {
  const [visibleCategories, setVisibleCategories] = useState<VisibleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisibleCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await categoriesEndpoints.getVisibleCategories();
        
        if (response.success && response.data) {
          // Filtrar solo las categorías activas
          const activeCategories = response.data.filter(category => category.activo);
          setVisibleCategories(activeCategories);
        } else {
          setError(response.message || 'Error al cargar categorías');
        }
      } catch (err) {
        console.error('Error fetching visible categories:', err);
        setError('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchVisibleCategories();
  }, []);

  // Función para mapear el nombre de la categoría API al nombre del navbar
  const mapCategoryToNavbarName = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
      'IM': 'Dispositivos móviles',
      'AV': 'Televisores y AV',
      'DA': 'Electrodomésticos',
      'IT': 'Monitores'
    };
    
    return categoryMap[categoryName] || categoryName;
  };

  // Función para obtener las rutas del navbar basadas en las categorías visibles
  const getNavbarRoutes = () => {
    const mappedCategories = visibleCategories.map(category => ({
      name: category.nombreVisible || mapCategoryToNavbarName(category.nombre),
      href: getCategoryHref(category.nombre),
      category: category.nombre.toLowerCase(),
      categoryCode: category.nombre, // Código original de la categoría (IM, AV, DA, IT)
      dropdownName: mapCategoryToNavbarName(category.nombre), // Nombre para el dropdown
      uuid: category.uuid,
      totalProducts: category.totalProducts,
      subcategorias: category.subcategorias
    }));

    // Agregar rutas fijas que siempre deben estar presentes
    const fixedRoutes = [
      {
        name: "Ofertas",
        href: "/ofertas",
        category: "promociones",
        categoryCode: "ofertas",
        dropdownName: "Ofertas",
        uuid: "ofertas",
        totalProducts: 0,
        subcategorias: []
      },
      {
        name: "Accesorios",
        href: "/productos?q=accesorios",
        category: "accesorios",
        categoryCode: "accesorios",
        dropdownName: "Accesorios",
        uuid: "accesorios",
        totalProducts: 0,
        subcategorias: []
      }
    ];

    // Agregar Tiendas al final de todas las opciones
    const tiendasRoute = {
      name: "Tiendas",
      href: "/tiendas",
      category: "ubicaciones",
      categoryCode: "tiendas",
      dropdownName: undefined, // No tiene dropdown
      uuid: "tiendas",
      totalProducts: 0,
      subcategorias: []
    };

    return [...fixedRoutes, ...mappedCategories, tiendasRoute];
  };

  // Función para obtener la URL href basada en el nombre de la categoría
  const getCategoryHref = (categoryName: string): string => {
    const hrefMap: Record<string, string> = {
      'IM': '/productos/dispositivos-moviles',
      'AV': '/productos/televisores',
      'DA': '/productos/electrodomesticos',
      'IT': '/productos/monitores'
    };
    
    return hrefMap[categoryName] || `/productos/${categoryName.toLowerCase()}`;
  };

  return {
    visibleCategories,
    loading,
    error,
    getNavbarRoutes,
    mapCategoryToNavbarName,
    getCategoryHref
  };
}
