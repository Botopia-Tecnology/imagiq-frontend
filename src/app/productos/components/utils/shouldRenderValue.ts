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
