import { useState, useEffect } from 'react';
import { categoriesEndpoints, type VisibleCategoryComplete, type VisibleCategory, type Menu, type Submenu } from '@/lib/api';

export function useVisibleCategories() {
  const [visibleCategories, setVisibleCategories] = useState<VisibleCategoryComplete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisibleCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await categoriesEndpoints.getVisibleCategoriesComplete();

        if (response.success && response.data) {
          // Filtrar solo las categorías activas y ordenarlas
          const activeCategories = response.data
            .filter(category => category.activo)
            .sort((a, b) => a.orden - b.orden);
          setVisibleCategories(activeCategories);
        } else {
          setError(response.message || 'Error al cargar categorías');
        }
      } catch (err) {
        console.error('Error fetching visible categories:', err);
        setError('Error al cargar categorías');

        // Fallback: usar categorías mock si el backend no está disponible
        const mockCategories: VisibleCategoryComplete[] = [
          {
            uuid: 'mock-im',
            nombre: 'IM',
            nombreVisible: 'Dispositivos móviles',
            descripcion: 'Dispositivos móviles',
            imagen: '',
            activo: true,
            orden: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            menus: []
          },
          {
            uuid: 'mock-av',
            nombre: 'AV',
            nombreVisible: 'Televisores y AV',
            descripcion: 'Televisores y Audio/Video',
            imagen: '',
            activo: true,
            orden: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            menus: []
          },
          {
            uuid: 'mock-da',
            nombre: 'DA',
            nombreVisible: 'Electrodomésticos',
            descripcion: 'Electrodomésticos',
            imagen: '',
            activo: true,
            orden: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            menus: []
          },
          {
            uuid: 'mock-it',
            nombre: 'IT',
            nombreVisible: 'Monitores',
            descripcion: 'Monitores',
            imagen: '',
            activo: true,
            orden: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            menus: []
          }
        ];
        setVisibleCategories(mockCategories);
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

  // Función para calcular productos de un submenu
  const calculateSubmenuProducts = (submenu: Submenu) => submenu.totalProducts || 0;

  // Función para calcular productos de un menu
  const calculateMenuProducts = (menu: Menu) => 
    (menu.submenus || []).reduce((total: number, submenu: Submenu) => 
      total + calculateSubmenuProducts(submenu), 0);

  // Función para obtener las rutas del navbar basadas en las categorías visibles
  const getNavbarRoutes = () => {
    const mappedCategories = visibleCategories.map(category => {
      // Calcular total de productos sumando todos los productos de los submenus
      const totalProducts = (category.menus || []).reduce((menuTotal, menu) => 
        menuTotal + calculateMenuProducts(menu), 0);

      return {
        name: category.nombreVisible || mapCategoryToNavbarName(category.nombre),
        href: getCategoryHref(category.nombre),
        category: category.nombre.toLowerCase(),
        categoryCode: category.nombre, // Código original de la categoría (IM, AV, DA, IT)
        dropdownName: mapCategoryToNavbarName(category.nombre), // Nombre para el dropdown
        uuid: category.uuid,
        totalProducts,
        menus: category.menus || [],
        orden: category.orden
      };
    });

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
        menus: [],
        orden: 0
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
      menus: [],
      orden: 1000
    };

    // Combinar y ordenar por el campo orden
    return [...fixedRoutes, ...mappedCategories, tiendasRoute].sort((a, b) => a.orden - b.orden);
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
