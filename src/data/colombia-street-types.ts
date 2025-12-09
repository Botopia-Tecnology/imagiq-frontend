/**
 * Tipos de vías en Colombia según la nomenclatura urbana
 */

export interface StreetType {
  codigo: string;
  nombre: string;
}

export const COLOMBIA_STREET_TYPES: StreetType[] = [
  { codigo: "AC", nombre: "Avenida Calle" },
  { codigo: "AK", nombre: "Avenida Carrera" },
  { codigo: "AN", nombre: "Anillo" },
  { codigo: "AP", nombre: "Autopista" },
  { codigo: "AV", nombre: "Avenida" },
  { codigo: "BL", nombre: "Bulevar" },
  { codigo: "CA", nombre: "Calle" },
  { codigo: "CL", nombre: "Callejón" },
  { codigo: "CM", nombre: "Camino" },
  { codigo: "CR", nombre: "Carrera" },
  { codigo: "CT", nombre: "Carretera" },
  { codigo: "DG", nombre: "Diagonal" },
  { codigo: "KM", nombre: "Kilómetro" },
  { codigo: "PA", nombre: "Pasaje" },
  { codigo: "PS", nombre: "Paseo" },
  { codigo: "TV", nombre: "Transversal" },
  { codigo: "VI", nombre: "Vía" },
];
