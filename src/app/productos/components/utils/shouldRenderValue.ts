/**
 * Valida si un valor debe renderizarse o no
 * Retorna false si el valor es:
 * - null
 * - undefined
 * - string vacío
 * - "No aplica" (case insensitive)
 * - "-"
 * - "N/A" (case insensitive)
 * - solo espacios en blanco
 */
export function shouldRenderValue(value: string | number | null | undefined): boolean {
  // Si es null o undefined, no renderizar
  if (value === null || value === undefined) {
    return false;
  }

  // Si es número, renderizar siempre (incluso 0)
  if (typeof value === 'number') {
    return true;
  }

  // Si es string, validar contenido
  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    // String vacío o solo espacios
    if (trimmedValue === '') {
      return false;
    }

    // Lista de valores que no deben renderizarse (case insensitive)
    const invalidValues = [
      'no aplica',
      'n/a',
      '-',
      'null',
      'undefined',
      'no disponible',
      'sin datos',
      'sin información',
    ];

    const lowerValue = trimmedValue.toLowerCase();
    if (invalidValues.includes(lowerValue)) {
      return false;
    }

    return true;
  }

  // Por defecto, renderizar
  return true;
}

/**
 * Renderiza condicionalmente un componente si el valor es válido
 */
export function renderIfValid<T>(
  value: string | number | null | undefined,
  renderFn: (value: NonNullable<T>) => React.ReactNode
): React.ReactNode | null {
  if (!shouldRenderValue(value)) {
    return null;
  }
  return renderFn(value as NonNullable<T>);
}

/**
 * Valida si un valor de color hex es válido para renderizar
 * @param hex - Código de color hex (ej: "#000000")
 * @returns true si es un hex válido (#RGB o #RRGGBB)
 */
export function isValidHexColor(hex: string | null | undefined): boolean {
  if (!hex || typeof hex !== 'string') return false;

  const trimmed = hex.trim();

  // Debe empezar con # y tener 7 caracteres (#RRGGBB) o 4 caracteres (#RGB)
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(trimmed);
}

/**
 * Valida si un color (hex + nombre) debe mostrarse
 * @param hex - Código hex del color
 * @param colorName - Nombre del color
 * @returns true si ambos valores son válidos para mostrar
 */
export function shouldRenderColor(
  hex: string | null | undefined,
  colorName: string | null | undefined
): boolean {
  // El hex debe ser válido
  if (!isValidHexColor(hex)) return false;

  // El nombre debe pasar la validación estándar
  if (!shouldRenderValue(colorName)) return false;

  return true;
}
