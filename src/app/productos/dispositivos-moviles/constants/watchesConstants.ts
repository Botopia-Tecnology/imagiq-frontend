/** *
 * Configuraciones y constantes para la sección Relojes
 */

import type { FilterConfig } from "../../components/FilterSidebar";
import { deviceCategories } from "./sharedCategories";

// Categorías del slider (importadas desde archivo centralizado)
export const watchCategories = deviceCategories;

// Configuración de filtros específica para relojes
export const watchFilters: FilterConfig = {
  serie: ["Galaxy Watch", "Galaxy Watch Active", "Galaxy Watch Classic"],
  tamaño: ["40mm", "42mm", "43mm", "44mm", "45mm", "46mm", "47mm"],
  //resistenciaAgua: ["5ATM", "10ATM", "IP68", "MIL-STD-810G"],
  //conectividad: ["Bluetooth", "LTE", "Wi-Fi"],
  /*
  caracteristicas: [
    "GPS",
    "Monitor de frecuencia cardíaca",
    "Monitor de sueño",
    "Resistente al agua",
    "Carga inalámbrica",
  ],
  */
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  //material: ["Aluminio", "Acero inoxidable", "Titanio"],
  color: ["Negro", "Plata", "Dorado", "Rosa", "Azul", "Morado"],
};
