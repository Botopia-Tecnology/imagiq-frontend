/**
 * Utilidades para detectar la serie de un producto basado en su nombre
 */

/**
 * Extrae la serie de un producto según su nombre
 * @param productName - Nombre del producto (ej: "Samsung Galaxy S25 Ultra")
 * @returns Serie del producto (ej: "Galaxy S")
 */
export function getProductSeries(productName: string): string {
  if (!productName) return "Galaxy";

  const nameLower = productName.toLowerCase();

  // Galaxy Z (Flip, Fold)
  if (nameLower.includes("flip") || nameLower.includes("fold") || nameLower.includes("galaxy z")) {
    return "Galaxy Z";
  }

  // Galaxy S
  if (nameLower.includes("galaxy s")) {
    return "Galaxy S";
  }

  // Galaxy A
  if (nameLower.includes("galaxy a")) {
    return "Galaxy-A";
  }

  // Galaxy M
  if (nameLower.includes("galaxy m")) {
    return "Galaxy M";
  }

  // Galaxy Note
  if (nameLower.includes("note")) {
    return "Galaxy Note";
  }

  // Galaxy Tab
  if (nameLower.includes("tab")) {
    return "Galaxy Tab";
  }

  // Galaxy Watch
  if (nameLower.includes("watch")) {
    return "Galaxy Watch";
  }

  // Galaxy Buds
  if (nameLower.includes("buds")) {
    return "Galaxy Buds";
  }

  // Default
  return "Galaxy Smartphone";
}

/**
 * Obtiene el href de la sección basado en la serie
 * @param series - Serie del producto
 * @returns URL de la sección
 */
export function getSeriesHref(series: string): string {
  const seriesMap: Record<string, string> = {
    "Galaxy Z": "/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy%20Z",
    "Galaxy S": "/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy%20S",
    "Galaxy A": "/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy%20A",
    "Galaxy M": "/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy%20M",
    "Galaxy Note": "/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy%20Note",
    "Galaxy Tab": "/productos/dispositivos-moviles?seccion=tabletas",
    "Galaxy Watch": "/productos/dispositivos-moviles?seccion=relojes",
    "Galaxy Buds": "/productos/dispositivos-moviles?seccion=buds",
  };

  return seriesMap[series] || "/productos/dispositivos-moviles";
}
