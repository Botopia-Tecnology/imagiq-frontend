import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Limpia el texto "No aplica" del nombre del producto (case insensitive)
 * @param name - Nombre del producto
 * @returns Nombre limpio sin "No aplica"
 */
export function cleanProductName(name: string): string {
  return name
    .replace(/\s*-?\s*no\s+aplica\s*/gi, ' ') // Elimina "No aplica" con guiones opcionales (case insensitive)
    .replace(/\s+/g, ' ') // Normaliza espacios múltiples
    .replace(/\s*-\s*$/, '') // Elimina guión final si quedó solo
    .trim(); // Limpia espacios al inicio/final
}
