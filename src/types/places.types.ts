/**
 * @module places.types
 * @description Tipos e interfaces para el sistema de autocompletado de direcciones con Google Places
 * Optimizado para el mercado colombiano
 * Siguiendo el Interface Segregation Principle (ISP) de SOLID
 */

/**
 * Estructura de una predicción de lugar de Google Places
 */
export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  structuredFormatting?: {
    mainText: string;
    secondaryText: string;
    mainTextMatchedSubstrings?: Array<{
      offset: number;
      length: number;
    }>;
  };
  types: string[];
  terms: Array<{
    offset: number;
    value: string;
  }>;
}

/**
 * Detalles completos de un lugar en Colombia
 */
export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  name?: string;
  latitude: number;
  longitude: number;
  addressComponents: AddressComponent[];
  types: string[];
  url?: string;
  vicinity?: string;

  // Campos específicos para direcciones colombianas
  postalCode?: string;
  department?: string; // Departamento (ej: Cundinamarca, Antioquia)
  city?: string; // Ciudad o municipio
  locality?: string; // Localidad o comuna
  neighborhood?: string; // Barrio
  streetNumber?: string; // Número de calle/carrera
  streetName?: string; // Nombre de calle
  nomenclature?: ColombianNomenclature; // Nomenclatura colombiana
}

/**
 * Nomenclatura colombiana para direcciones
 */
export interface ColombianNomenclature {
  type: 'Calle' | 'Carrera' | 'Diagonal' | 'Transversal' | 'Avenida' | 'Circular' | 'Vía';
  number: string;
  additionalNumber?: string; // Para direcciones como Cra 15 # 80-25
  bis?: boolean; // Para direcciones con "bis"
  complement?: string; // Apartamento, oficina, local, etc.
}

/**
 * Componente de dirección
 */
export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

/**
 * Opciones de configuración para el autocompletado en Colombia
 */
export interface AutocompleteOptions {
  /**
   * Restricción de país - Por defecto Colombia
   */
  countryRestriction?: string | string[];

  /**
   * Radio en metros para sesgar los resultados
   */
  radius?: number;

  /**
   * Coordenadas del centro para sesgar los resultados
   * Por defecto: Centro de Colombia
   */
  location?: {
    lat: number;
    lng: number;
  };

  /**
   * Ciudad colombiana para filtrar resultados
   */
  cityFilter?: ColombianCity;

  /**
   * Departamento colombiano para filtrar resultados
   */
  departmentFilter?: ColombianDepartment;

  /**
   * Tipos de lugares a buscar
   */
  types?: PlaceType[];

  /**
   * Idioma de los resultados - Por defecto español
   */
  language?: string;

  /**
   * Número mínimo de caracteres antes de buscar
   */
  minLength?: number;

  /**
   * Tiempo de espera en ms antes de realizar la búsqueda (debounce)
   */
  debounceTime?: number;

  /**
   * Número máximo de predicciones a mostrar
   */
  maxResults?: number;

  /**
   * Campos específicos a retornar (para optimizar costos)
   */
  fields?: PlaceField[];

  /**
   * Si debe incluir solo direcciones dentro de las zonas de cobertura
   */
  onlyCoverageZones?: boolean;
}

/**
 * Ciudades principales de Colombia
 */
export enum ColombianCity {
  BOGOTA = 'Bogotá',
  MEDELLIN = 'Medellín',
  CALI = 'Cali',
  BARRANQUILLA = 'Barranquilla',
  CARTAGENA = 'Cartagena',
  CUCUTA = 'Cúcuta',
  BUCARAMANGA = 'Bucaramanga',
  IBAGUE = 'Ibagué',
  SOLEDAD = 'Soledad',
  SOACHA = 'Soacha',
  VILLAVICENCIO = 'Villavicencio',
  SANTA_MARTA = 'Santa Marta',
  VALLEDUPAR = 'Valledupar',
  MONTERIA = 'Montería',
  PEREIRA = 'Pereira'
}

/**
 * Departamentos de Colombia
 */
export enum ColombianDepartment {
  AMAZONAS = 'Amazonas',
  ANTIOQUIA = 'Antioquia',
  ARAUCA = 'Arauca',
  ATLANTICO = 'Atlántico',
  BOLIVAR = 'Bolívar',
  BOYACA = 'Boyacá',
  CALDAS = 'Caldas',
  CAQUETA = 'Caquetá',
  CASANARE = 'Casanare',
  CAUCA = 'Cauca',
  CESAR = 'Cesar',
  CHOCO = 'Chocó',
  CORDOBA = 'Córdoba',
  CUNDINAMARCA = 'Cundinamarca',
  GUAINIA = 'Guainía',
  GUAVIARE = 'Guaviare',
  HUILA = 'Huila',
  LA_GUAJIRA = 'La Guajira',
  MAGDALENA = 'Magdalena',
  META = 'Meta',
  NARINO = 'Nariño',
  NORTE_DE_SANTANDER = 'Norte de Santander',
  PUTUMAYO = 'Putumayo',
  QUINDIO = 'Quindío',
  RISARALDA = 'Risaralda',
  SAN_ANDRES = 'San Andrés y Providencia',
  SANTANDER = 'Santander',
  SUCRE = 'Sucre',
  TOLIMA = 'Tolima',
  VALLE_DEL_CAUCA = 'Valle del Cauca',
  VAUPES = 'Vaupés',
  VICHADA = 'Vichada'
}

/**
 * Tipos de lugares disponibles
 */
export enum PlaceType {
  GEOCODE = 'geocode',
  ADDRESS = 'address',
  ESTABLISHMENT = 'establishment',
  REGIONS = '(regions)',
  CITIES = '(cities)'
}

/**
 * Campos disponibles para obtener de un lugar
 */
export enum PlaceField {
  ADDRESS_COMPONENTS = 'address_components',
  FORMATTED_ADDRESS = 'formatted_address',
  GEOMETRY = 'geometry',
  NAME = 'name',
  PLACE_ID = 'place_id',
  TYPES = 'types',
  URL = 'url',
  VICINITY = 'vicinity'
}

/**
 * Estado del componente de autocompletado
 */
export interface AutocompleteState {
  isLoading: boolean;
  predictions: PlacePrediction[];
  selectedPlace: PlaceDetails | null;
  error: string | null;
  sessionToken: string | null;
}

/**
 * Props del componente de autocompletado
 */
export interface AddressAutocompleteProps {
  /**
   * Valor inicial del input
   */
  value?: string;

  /**
   * Tipo de dirección (para compatibilidad con componentes antiguos)
   * @deprecated - La lógica de cobertura se maneja con validateCoverage
   */
  addressType?: 'shipping' | 'billing';

  /**
   * Callback cuando se selecciona un lugar
   */
  onPlaceSelect?: (place: PlaceDetails) => void;

  /**
   * Callback cuando cambia el texto del input
   */
  onChange?: (value: string) => void;

  /**
   * Placeholder del input
   */
  placeholder?: string;

  /**
   * Clases CSS adicionales
   */
  className?: string;

  /**
   * Si el campo es requerido
   */
  required?: boolean;

  /**
   * Si el campo está deshabilitado
   */
  disabled?: boolean;

  /**
   * Mensaje de error a mostrar
   */
  error?: string;

  /**
   * Label del campo
   */
  label?: string;

  /**
   * Opciones de configuración
   */
  options?: AutocompleteOptions;

  /**
   * Si debe limpiar el input después de seleccionar
   */
  clearOnSelect?: boolean;

  /**
   * Si debe mostrar el ícono de búsqueda
   */
  showSearchIcon?: boolean;

  /**
   * Si debe validar que la dirección esté en zona de cobertura
   */
  validateCoverage?: boolean;
}

/**
 * Respuesta del servicio de autocompletado
 */
export interface AutocompleteResponse {
  predictions: PlacePrediction[];
  sessionToken?: string;
  status: 'OK' | 'ZERO_RESULTS' | 'ERROR';
  errorMessage?: string;
}

/**
 * Respuesta del servicio de detalles del lugar
 */
export interface PlaceDetailsResponse {
  place: PlaceDetails;
  status: 'OK' | 'NOT_FOUND' | 'ERROR';
  errorMessage?: string;
}

/**
 * Zona de cobertura para entregas
 */
export interface CoverageZone {
  id: string;
  name: string;
  department: ColombianDepartment;
  city: ColombianCity;
  neighborhoods?: string[];
  polygon?: Array<{ lat: number; lng: number }>;
  deliveryTime?: string; // Ej: "24-48 horas"
  deliveryCost?: number;
  isActive: boolean;
}