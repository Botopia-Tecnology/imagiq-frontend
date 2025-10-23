/**
 * @module Formatters
 * @description Utility functions for formatting dates, currencies, etc.
 */

/**
 * Formatea una fecha a string legible
 */
export const formatDate = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formatea un monto a formato de moneda
 */
export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea un número de teléfono
 */
export const formatPhoneNumber = (phone: string): string => {
  // Eliminar caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Formato: (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

/**
 * Trunca un texto a un máximo de caracteres
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
