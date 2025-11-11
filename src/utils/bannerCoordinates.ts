/**
 * Utilidades para el Sistema de Coordenadas 9x9
 *
 * Convierte coordenadas del formato "x-y" del API a estilos CSS
 * para posicionar contenido en los banners.
 */

import type { BannerCoordinates } from '@/types/banner';

/**
 * Parsea una cadena de coordenadas en formato "x-y" a objeto BannerCoordinates
 *
 * @param coordinates - String en formato "x-y" donde x,y van de 0-8
 * @returns Objeto con coordenadas x,y. Usa (4,4) como fallback si es inválido
 *
 * @example
 * parseCoordinates("2-5") // { x: 2, y: 5 }
 * parseCoordinates("invalid") // { x: 4, y: 4 } + console.warn
 */
export function parseCoordinates(coordinates: string): BannerCoordinates {
  const fallback: BannerCoordinates = { x: 4, y: 4 }; // Centro

  if (!coordinates || typeof coordinates !== 'string') {
    console.warn('[BannerCoordinates] Invalid coordinates:', coordinates, '- Using center fallback');
    return fallback;
  }

  const parts = coordinates.split('-');
  if (parts.length !== 2) {
    console.warn('[BannerCoordinates] Invalid format:', coordinates, '- Expected "x-y" format');
    return fallback;
  }

  const x = Number.parseInt(parts[0], 10);
  const y = Number.parseInt(parts[1], 10);

  // Validar que estén en el rango 0-8
  if (Number.isNaN(x) || Number.isNaN(y) || x < 0 || x > 8 || y < 0 || y > 8) {
    console.warn('[BannerCoordinates] Out of range:', { x, y }, '- Expected 0-8');
    return fallback;
  }

  return { x, y };
}

/**
 * Convierte coordenadas "x-y" a estilos CSS para posicionamiento absoluto
 *
 * @param coordinates - String en formato "x-y" donde x,y van de 0-8
 * @returns Objeto con propiedades left, top y transform para CSS
 *
 * @example
 * coordinatesToCSS("2-5")
 * // { left: "25%", top: "62.5%", transform: "translate(-50%, -50%)" }
 */
export function coordinatesToCSS(coordinates: string): {
  left: string;
  top: string;
  transform: string;
} {
  const { x, y } = parseCoordinates(coordinates);

  // Convertir coordenadas 0-8 a porcentajes
  const leftPercent = (x / 8) * 100;
  const topPercent = (y / 8) * 100;

  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    transform: 'translate(-50%, -50%)', // Centrar desde el punto de anclaje
  };
}
