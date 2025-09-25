/** *
 * Configuraciones y constantes para la sección Tablets
 */

import type { FilterConfig } from "../../components/FilterSidebar";
import { deviceCategories } from "./sharedCategories";

// Categorías del slider (importadas desde archivo centralizado)
export const tabletCategories = deviceCategories;

// Configuración de filtros específica para tabletas
export const tabletFilters: FilterConfig = {
  serie: ["Galaxy Tab S", "Galaxy Tab A", "Galaxy Tab Active"],
  //pantalla: ['8"', '10.1"', '10.4"', '11"', '12.4"'],
  almacenamiento: ["32GB", "64GB", "128GB", "256GB", "512GB"],
  conectividad: ["Wi-Fi", "LTE", "5G"],
  caracteristicas: [
    "S Pen",
    "Carga rápida",
    // "Resistente al agua",
    "Carga inalámbrica",
    // "Dual SIM",
  ],
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  color: ["Negro", "Blanco", "Azul", "Rosa", "Verde", "Morado", "Dorado", "Plateado"],
  //uso: ["Productividad", "Gaming", "Educación", "Entretenimiento"],
};
