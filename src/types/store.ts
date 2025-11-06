/**
 * Store types for Samsung physical locations
 * Matches backend API response from GET /api/stores
 */

export interface Store {
  codigo: number;                    // Código único de la tienda
  descripcion: string;               // Nombre de la tienda (ej: "Ses Bogotá C.C. Andino")
  departamento: string;              // Departamento (ej: "Cundinamarca")
  ciudad: string;                    // Ciudad (ej: "Bogotá")
  direccion: string;                 // Dirección física completa
  place_ID: string;                  // Google Place ID para integrar con Maps
  ubicacion_cc: string;              // Ubicación dentro del centro comercial
  horario: string;                   // Horarios de atención
  telefono: string;                  // Teléfono principal
  extension: number | string;        // Extensión telefónica
  email: string;                     // Email de contacto
  codBodega: number | string;        // Código de bodega
  codDane: number;                   // Código DANE de la ciudad
  latitud: number | string;          // Latitud para Google Maps
  longitud: number | string;         // Longitud para Google Maps
}

/**
 * Formatted store for use in the UI (with parsed coordinates)
 */
export interface FormattedStore extends Omit<Store, 'latitud' | 'longitud'> {
  latitud: number;
  longitud: number;
  position: [number, number];  // [latitud, longitud] for map compatibility
}

/**
 * API Response for stores endpoint
 */
export type StoresApiResponse = Store[];
