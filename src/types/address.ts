/**
 * Tipos de dirección física
 */
export type TipoDireccionFisica = 'CASA' | 'APARTAMENTO' | 'OFICINA' | 'OTRO';

/**
 * Tipo de uso de la dirección
 */
export type TipoUsoDireccion = 'ENVIO' | 'FACTURACION' | 'AMBOS';

/**
 * Interface principal de dirección
 * Unifica DefaultAddress, DBAddress y Direccion en una sola estructura
 */
export interface Address {
  id: string;
  usuarioId: string;
  nombreDireccion: string;
  tipoDireccion: TipoDireccionFisica;
  tipo: TipoUsoDireccion;
  esPredeterminada: boolean;
  activa: boolean;

  // Ubicación
  googlePlaceId: string;
  direccionFormateada: string;
  lineaUno: string;
  ciudad: string;
  departamento?: string;
  pais: string;
  codigoPostal?: string;
  localidad?: string;
  barrio?: string;

  // Coordenadas
  latitud: number;
  longitud: number;

  // Detalles adicionales
  complemento?: string;
  instruccionesEntrega?: string;
  puntoReferencia?: string;

  // Cobertura
  enZonaCobertura: boolean;
  zonaCobertura?: string;

  // Metadatos
  fechaCreacion: string;
  fechaUltimaActualizacion?: string;
  fechaUltimaValidacion?: string;
  validadaGoogle?: boolean;

  // URLs adicionales
  googleUrl?: string;
  vicinity?: string;
}

/**
 * Input para crear una dirección
 */
export interface CreateAddressInput {
  nombreDireccion: string;
  tipoDireccion: TipoDireccionFisica;
  tipo: TipoUsoDireccion;
  esPredeterminada?: boolean;
  googlePlaceId: string;
  direccionFormateada: string;
  latitud: number;
  longitud: number;
  ciudad: string;
  departamento?: string;
  pais: string;
  complemento?: string;
  instruccionesEntrega?: string;
  puntoReferencia?: string;
}

/**
 * Response del backend para direcciones
 */
export interface AddressResponse {
  id: string;
  usuarioId: string;
  nombreDireccion: string;
  tipoDireccion: string;
  tipo: string;
  esPredeterminada: boolean;
  googlePlaceId: string;
  direccionFormateada: string;
  latitud: number;
  longitud: number;
  ciudad: string;
  departamento?: string;
  codigoPostal?: string;
  pais: string;
  complemento?: string;
  instruccionesEntrega?: string;
  puntoReferencia?: string;
  googleUrl?: string;
  vicinity?: string;
  localidad?: string;
  barrio?: string;
  lineaUno: string;
  activa: boolean;
  zonaCobertura?: string;
  fechaCreacion: string;
  fechaUltimaActualizacion?: string;
  fechaUltimaValidacion?: string;
  validadaGoogle?: boolean;
  enZonaCobertura: boolean;
}
