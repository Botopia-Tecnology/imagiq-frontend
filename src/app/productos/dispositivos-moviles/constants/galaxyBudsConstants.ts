/** *
 * Configuraciones y constantes para la sección Galaxy Buds
 */

import type { FilterConfig } from "../../components/FilterSidebar";
import { deviceCategories } from "./sharedCategories";

// Categorías del slider (importadas desde archivo centralizado)
export const budsCategories = deviceCategories;

// Configuración de filtros específica para Galaxy Buds
export const budsFilters: FilterConfig = {
  serie: [
    "Galaxy Buds Pro",
    "Galaxy Buds 2",
    "Galaxy Buds 2 Pro",
    "Galaxy Buds FE",
    "Galaxy Buds Live",
  ],
  //tipoAjuste: ["In-ear", "Semi abierto", "Abierto"],
  //cancelacionRuido: ["ANC Activa", "ANC Pasiva", "Sin ANC"],
  //resistenciaAgua: ["IPX4", "IPX5", "IPX7", "Sin resistencia"],
  /*
  conectividad: [
    "Bluetooth 5.0",
    "Bluetooth 5.1",
    "Bluetooth 5.2",
    "Bluetooth 5.3",
  ],}
  
  caracteristicas: [
    "Carga inalámbrica",
    "Detección de uso",
    "Ecualización adaptable",
    "Audio 360",
    "Control táctil",
  ],
  */
  rangoPrecio: [
    { label: "Menos de $200.000", min: 0, max: 200000 },
    { label: "$200.000 - $400.000", min: 200000, max: 400000 },
    { label: "$400.000 - $600.000", min: 400000, max: 600000 },
    { label: "Más de $600.000", min: 600000, max: Infinity },
  ],
  color: ["Negro", "Blanco", "Gris", "Azul", "Rosa", "Verde", "Morado", "Dorado", "Plateado", "Oro Rosa"],
  //autonomiaBateria: ["4-6 horas", "6-8 horas", "8+ horas"],
  //controlVoz: ["Bixby", "Google Assistant", "Alexa", "Múltiples"],
};
