/** *
 * Configuraciones y constantes para la sección Accesorios
 */

import type { FilterConfig } from "../../components/FilterSidebar";
import { deviceCategories } from "./sharedCategories";

// Categorías del slider (importadas desde archivo centralizado)
export const accessoryCategories = deviceCategories;

// Configuración de filtros específica para accesorios
export const accessoryFilters: FilterConfig = {
  tipoAccesorio: [
    "Cargadores",
    "Cables",
    "Fundas",
    "Protectores de pantalla",
    "Correas",
    "Soportes",
    "PowerBank",
  ],
  compatibilidad: [
    "Galaxy S Series",
    "Galaxy A Series",
    "Galaxy Note",
    "Galaxy Tab",
    "Galaxy Watch",
    "Universal",
  ],
  material: [
    "Silicona",
    "Cuero",
    "Metal",
    "Plástico",
    "Cristal templado",
    "TPU",
  ],
  color: ["Negro", "Blanco", "Transparente", "Azul", "Rojo", "Rosa", "Morado", "Gris"],
  caracteristicas: [
    "Carga rápida",
    "Inalámbrico",
    "Magnético",
    "Resistente al agua",
    "Anti-golpes",
    "Ultra delgado",
  ],
  rangoPrecio: [
    { label: "Menos de $50.000", min: 0, max: 50000 },
    { label: "$50.000 - $100.000", min: 50000, max: 100000 },
    { label: "$100.000 - $200.000", min: 100000, max: 200000 },
    { label: "Más de $200.000", min: 200000, max: Infinity },
  ],
  marca: ["Samsung", "Spigen", "OtterBox", "Belkin", "Anker", "UAG"],
  tipoConector: ["USB-C", "Lightning", "Micro USB", "Wireless", "Magnético"],
};

// Mapeo de tipos de accesorio a palabras clave para búsqueda
export const keywordMap: Record<string, string[]> = {
  Cargadores: ["charger", "cargador", "carga", "power", "adaptador"],
  Cables: ["cable", "usb", "c-type", "lightning", "conector"],
  Fundas: ["case", "funda", "cover", "protector", "silicone"],
  "Protectores de pantalla": [
    "protector",
    "screen",
    "pantalla",
    "vidrio",
    "tempered",
    "glass",
  ],
  Correas: ["strap", "correa", "band", "banda", "pulsera", "bracelet"],
};
