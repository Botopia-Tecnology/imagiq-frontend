/**
 *  DYNAMIC CONFIG HOOK
 * 
 * Hook que reemplaza todas las configuraciones estáticas con configuraciones dinámicas
 * basadas en los datos de la API.
 */

import { useMemo, useEffect, useState } from 'react';
import { useVisibleCategories } from '@/hooks/useVisibleCategories';
import { useCurrentMenu } from '@/hooks/useCurrentMenu';
import { useSubmenus } from '@/hooks/useSubmenus';
import { menusEndpoints, type Menu } from '@/lib/api';
import type { CategoriaParams } from '../types';
import { 
  generateCategorySliderConfig,
  generateSeriesConfig,
  generateSectionTitle,
  generateFilterConfig,
  generateSeccionToMenuNameMapping,
  generateAvailableSections,
  generateDefaultSection
} from '../utils/dynamicConfigGenerator';

/**
 * Hook principal que proporciona toda la configuración dinámica
 * Ahora carga los menús bajo demanda para la categoría actual
 */
export function useDynamicCategoryConfig(
  categoria: CategoriaParams,
  seccion?: string
) {
  const { visibleCategories, loading: categoriesLoading } = useVisibleCategories();
  const { currentMenu, loading: menuLoading } = useCurrentMenu(categoria, seccion);
  const { submenus, loading: submenusLoading } = useSubmenus(currentMenu?.uuid || null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menusLoading, setMenusLoading] = useState(false);

  // Encontrar la categoría actual en los datos de la API
  const currentCategory = useMemo(() => {
    const categoryCode = getCategoryCode(categoria);
    return visibleCategories.find(cat => cat.nombre === categoryCode);
  }, [visibleCategories, categoria]);

  // Cargar menús bajo demanda para la categoría actual
  useEffect(() => {
    if (!currentCategory?.uuid || categoriesLoading) return;

    let isMounted = true;

    const loadMenus = async () => {
      setMenusLoading(true);
      try {
        const response = await menusEndpoints.getMenusByCategory(currentCategory.uuid);
        if (response.success && response.data && isMounted) {
          setMenus(response.data);
        }
      } catch (error) {
        console.error('Error loading menus:', error);
      } finally {
        if (isMounted) {
          setMenusLoading(false);
        }
      }
    };

    loadMenus();

    return () => {
      isMounted = false;
    };
  }, [currentCategory?.uuid, categoriesLoading]);

  // Generar configuración dinámica
  const dynamicConfig = useMemo(() => {
    if (!menus.length && !menusLoading) {
      return null;
    }

    return {
      sliderConfig: generateCategorySliderConfig(categoria, menus),
      seriesConfig: generateSeriesConfig(categoria, seccion || '', currentMenu, submenus),
      sectionTitle: generateSectionTitle(categoria, seccion || '', currentMenu),
      filterConfig: generateFilterConfig(categoria, seccion || ''),
      seccionToMenuName: generateSeccionToMenuNameMapping(menus),
      availableSections: generateAvailableSections(menus),
      defaultSection: generateDefaultSection(menus)
    };
  }, [categoria, seccion, menus, currentMenu, submenus, menusLoading]);

  // Configuración de slider dinámica
  const sliderConfig = useMemo(() => {
    if (!dynamicConfig) return [];
    return dynamicConfig.sliderConfig;
  }, [dynamicConfig]);

  // Configuración de series dinámica
  const seriesConfig = useMemo(() => {
    if (!dynamicConfig) return null;
    return dynamicConfig.seriesConfig;
  }, [dynamicConfig]);

  // Título de sección dinámico
  const sectionTitle = useMemo(() => {
    if (!dynamicConfig) return seccion || categoria;
    return dynamicConfig.sectionTitle;
  }, [dynamicConfig, seccion, categoria]);

  // Configuración de filtros dinámica
  const filterConfig = useMemo(() => {
    if (!dynamicConfig) return {};
    return dynamicConfig.filterConfig;
  }, [dynamicConfig]);

  // Mapeo de secciones a nombres de menús dinámico
  const seccionToMenuName = useMemo(() => {
    if (!dynamicConfig) return {};
    return dynamicConfig.seccionToMenuName;
  }, [dynamicConfig]);

  // Secciones disponibles dinámicas
  const availableSections = useMemo(() => {
    if (!dynamicConfig) return [];
    return dynamicConfig.availableSections;
  }, [dynamicConfig]);

  // Sección por defecto dinámica
  const defaultSection = useMemo(() => {
    if (!dynamicConfig) return null;
    return dynamicConfig.defaultSection;
  }, [dynamicConfig]);

  return {
    // Configuraciones dinámicas
    sliderConfig,
    seriesConfig,
    sectionTitle,
    filterConfig,
    seccionToMenuName,
    availableSections,
    defaultSection,
    
    // Estados de carga
    loading: categoriesLoading || menuLoading || submenusLoading || menusLoading,
    
    // Datos de la API
    currentCategory,
    currentMenu,
    submenus,
    
    // Configuración completa
    dynamicConfig
  };
}

/**
 * Hook específico para obtener configuración de slider dinámica
 */
export function useDynamicSliderConfig(categoria: CategoriaParams) {
  const { sliderConfig, loading } = useDynamicCategoryConfig(categoria);
  
  return {
    sliderConfig,
    loading
  };
}

/**
 * Hook específico para obtener configuración de series dinámica
 */
export function useDynamicSeriesConfig(categoria: CategoriaParams, seccion: string) {
  const { seriesConfig, loading } = useDynamicCategoryConfig(categoria, seccion);
  
  return {
    seriesConfig,
    loading
  };
}

/**
 * Hook específico para obtener título de sección dinámico
 */
export function useDynamicSectionTitle(categoria: CategoriaParams, seccion: string) {
  const { sectionTitle, loading } = useDynamicCategoryConfig(categoria, seccion);
  
  return {
    sectionTitle,
    loading
  };
}

// Función auxiliar para obtener el código de categoría
function getCategoryCode(categoria: CategoriaParams): string {
  const categoryMapping: Record<CategoriaParams, string> = {
    'dispositivos-moviles': 'IM',
    'electrodomesticos': 'DA',
    'televisores': 'AV',
    'monitores': 'IT',
    'audio': 'AV',
    'ofertas': 'ofertas'
  };
  
  return categoryMapping[categoria] || categoria.toUpperCase();
}
