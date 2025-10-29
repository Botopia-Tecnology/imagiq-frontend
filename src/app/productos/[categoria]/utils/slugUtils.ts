/**
 * Utilidades para generación de slugs dinámicos desde nombres de API
 */

import type { VisibleCategory, Menu } from '@/lib/api';

/**
 * Convierte un nombre a slug URL-friendly
 * Ejemplo: "Dispositivos móviles" → "dispositivos-moviles"
 * "Hornos Microondas" → "hornos-microondas"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/[^a-z0-9-]/g, '') // Solo alfanuméricos y guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Sin guiones al inicio/final
}

/**
 * Encuentra una categoría por slug en la lista de categorías visibles
 */
export function findCategoryBySlug(categories: VisibleCategory[], slug: string): VisibleCategory | undefined {
  return categories.find(cat => {
    const categorySlug = toSlug(cat.nombreVisible || cat.nombre);
    return categorySlug === slug;
  });
}

/**
 * Encuentra un menú por slug en la lista de menús de una categoría
 */
export function findMenuBySlug(menus: Menu[], slug: string): Menu | undefined {
  return menus.find(menu => {
    const menuSlug = toSlug(menu.nombreVisible || menu.nombre);
    return menuSlug === slug;
  });
}
