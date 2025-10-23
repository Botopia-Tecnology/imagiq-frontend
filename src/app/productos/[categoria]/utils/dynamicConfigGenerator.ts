/**
 * DYNAMIC CONFIG GENERATOR
 * 
 * Genera automáticamente toda la configuración estática basándose en los datos de la API.
 * Esto elimina la necesidad de mantener configuraciones hardcodeadas.
 */

import type { Menu, Submenu } from '@/lib/api';
import type { CategoriaParams } from '../types';

// Interfaces para la configuración dinámica
export interface DynamicCategory {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface DynamicSectionConfig {
  title: string;
  breadcrumbCategory: string;
  breadcrumbSection: string;
  series: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
}

export interface DynamicFilterConfig {
  [key: string]: {
    label: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  };
}

/**
 * Genera la configuración de slider para una categoría basándose en los menús de la API
 */
export function generateCategorySliderConfig(
  categoria: CategoriaParams,
  menus: Menu[]
): DynamicCategory[] {
  return menus
    .filter(menu => menu.activo)
    .map(menu => ({
      id: menu.uuid,
      name: menu.nombreVisible || menu.nombre,
      subtitle: categoria === 'dispositivos-moviles' ? 'Móviles' : 
                categoria === 'electrodomesticos' ? 'Hogar' :
                categoria === 'televisores' ? 'TV' :
                categoria === 'monitores' ? 'Monitores' : '',
      image: menu.imagen || getDefaultImageForCategory(categoria),
      href: `/productos/${categoria}?seccion=${menu.uuid}`
    }));
}

/**
 * Genera la configuración de series para una sección basándose en los submenús de la API
 */
export function generateSeriesConfig(
  categoria: CategoriaParams,
  seccion: string,
  menu: Menu | null,
  submenus: Submenu[]
): DynamicSectionConfig | null {
  if (!menu || submenus.length === 0) {
    return null;
  }

  return {
    title: menu.nombreVisible || menu.nombre,
    breadcrumbCategory: getCategoryDisplayName(categoria),
    breadcrumbSection: menu.nombreVisible || menu.nombre,
    series: submenus
      .filter(submenu => submenu.activo)
      .map(submenu => ({
        id: submenu.uuid,
        name: submenu.nombreVisible || submenu.nombre,
        image: submenu.imagen || getDefaultImageForCategory(categoria)
      }))
  };
}

/**
 * Genera el título de una sección basándose en el menú de la API
 */
export function generateSectionTitle(
  categoria: CategoriaParams,
  seccion: string,
  menu: Menu | null
): string {
  if (menu) {
    return menu.nombreVisible || menu.nombre;
  }
  
  // Fallback basado en la sección
  return getDefaultSectionTitle(categoria, seccion);
}

/**
 * Genera la configuración de filtros dinámicamente
 * Por ahora mantiene la estructura existente pero puede expandirse
 */
export function generateFilterConfig(
  categoria: CategoriaParams,
  seccion: string
): DynamicFilterConfig {
  // Por ahora retornamos una configuración básica
  // Esto puede expandirse para incluir filtros dinámicos basados en la API
  return {
    precio: {
      label: 'Precio',
      options: [
        { value: '0-100000', label: 'Hasta $100,000' },
        { value: '100000-300000', label: '$100,000 - $300,000' },
        { value: '300000-500000', label: '$300,000 - $500,000' },
        { value: '500000+', label: 'Más de $500,000' }
      ]
    },
    marca: {
      label: 'Marca',
      options: [
        { value: 'samsung', label: 'Samsung' }
      ]
    }
  };
}

/**
 * Genera el mapeo de secciones a nombres de menús dinámicamente
 */
export function generateSeccionToMenuNameMapping(
  menus: Menu[]
): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  menus.forEach(menu => {
    if (menu.activo) {
      // Usar el UUID del menú como clave
      mapping[menu.uuid] = menu.nombreVisible || menu.nombre;
      
      // También mapear por nombre para compatibilidad
      const menuName = (menu.nombreVisible || menu.nombre).toLowerCase();
      mapping[menuName] = menu.nombreVisible || menu.nombre;
    }
  });
  
  return mapping;
}

/**
 * Genera las secciones disponibles para una categoría basándose en los menús
 */
export function generateAvailableSections(menus: Menu[]): string[] {
  return menus
    .filter(menu => menu.activo)
    .map(menu => menu.uuid);
}

/**
 * Genera la sección por defecto para una categoría
 */
export function generateDefaultSection(menus: Menu[]): string | null {
  const activeMenus = menus.filter(menu => menu.activo);
  if (activeMenus.length === 0) return null;
  
  // Retornar el primer menú activo ordenado
  return activeMenus.sort((a, b) => a.orden - b.orden)[0].uuid;
}

// Funciones auxiliares
function getCategoryDisplayName(categoria: CategoriaParams): string {
  const displayNames: Record<CategoriaParams, string> = {
    'dispositivos-moviles': 'Dispositivos Móviles',
    'electrodomesticos': 'Electrodomésticos',
    'televisores': 'Televisores',
    'monitores': 'Monitores',
    'audio': 'Audio',
    'ofertas': 'Ofertas'
  };
  
  return displayNames[categoria] || categoria;
}

function getDefaultSectionTitle(categoria: CategoriaParams, seccion: string): string {
  // Títulos por defecto si no hay datos de API
  const defaultTitles: Record<string, string> = {
    'smartphones': 'Smartphones',
    'tabletas': 'Tabletas',
    'relojes': 'Relojes Inteligentes',
    'buds': 'Audífonos',
    'accesorios': 'Accesorios',
    'refrigeradores': 'Refrigeradores',
    'lavadoras': 'Lavadoras',
    'microondas': 'Microondas',
    'aire-acondicionado': 'Aire Acondicionado'
  };
  
  return defaultTitles[seccion] || seccion;
}

function getDefaultImageForCategory(categoria: CategoriaParams): string {
  // Imágenes por defecto para cada categoría
  const defaultImages: Record<CategoriaParams, string> = {
    'dispositivos-moviles': '/img/categorias/smartphones.png',
    'electrodomesticos': '/img/categorias/electrodomesticos.png',
    'televisores': '/img/categorias/televisores.png',
    'monitores': '/img/categorias/monitores.png',
    'audio': '/img/categorias/audio.png',
    'ofertas': '/img/categorias/ofertas.png'
  };
  
  return defaultImages[categoria] || '/img/categorias/default.png';
}

/**
 * Hook para obtener configuración dinámica completa
 */
export function useDynamicConfig(
  categoria: CategoriaParams,
  seccion: string,
  menus: Menu[],
  currentMenu: Menu | null,
  submenus: Submenu[]
) {
  return {
    sliderConfig: generateCategorySliderConfig(categoria, menus),
    seriesConfig: generateSeriesConfig(categoria, seccion, currentMenu, submenus),
    sectionTitle: generateSectionTitle(categoria, seccion, currentMenu),
    filterConfig: generateFilterConfig(categoria, seccion),
    seccionToMenuName: generateSeccionToMenuNameMapping(menus),
    availableSections: generateAvailableSections(menus),
    defaultSection: generateDefaultSection(menus)
  };
}
