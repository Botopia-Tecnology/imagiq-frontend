/**
 * Color naming utility using ntc.js (Name That Color)
 * Converts hexadecimal color codes to human-readable color names
 */

import ntc from 'ntcjs';

/**
 * Convierte un código hexadecimal a un nombre de color legible
 * @param hex - Código hexadecimal del color (ej: "#1E40AF")
 * @returns Nombre del color en español (ej: "Azul")
 */
export function getColorName(hex: string): string {
  // Validar que sea un hex válido
  if (!/^#[0-9A-F]{6}$/i.test(hex.trim())) {
    return 'Color';
  }

  try {
    // ntc.name retorna un array: [nombre exacto, nombre aproximado, es exacto (bool), código hex]
    const result = ntc.name(hex);
    const colorName = result[1]; // Usar el nombre aproximado (más descriptivo)

    // Traducir nombres comunes al español
    return translateColorName(colorName);
  } catch (error) {
    console.error('Error getting color name:', error);
    return 'Color';
  }
}

/**
 * Traduce nombres de colores del inglés al español
 * @param englishName - Nombre del color en inglés
 * @returns Nombre del color en español
 */
function translateColorName(englishName: string): string {
  const translations: Record<string, string> = {
    // Negros y grises
    'Black': 'Negro',
    'Gray': 'Gris',
    'Grey': 'Gris',
    'White': 'Blanco',
    'Silver': 'Plateado',
    'Charcoal': 'Carbón',
    'Slate': 'Pizarra',

    // Azules
    'Blue': 'Azul',
    'Navy': 'Azul Marino',
    'Royal Blue': 'Azul Real',
    'Sky Blue': 'Azul Cielo',
    'Midnight Blue': 'Azul Medianoche',
    'Azure': 'Azur',
    'Cobalt': 'Cobalto',
    'Sapphire': 'Zafiro',
    'Indigo': 'Índigo',
    'Cerulean': 'Cerúleo',

    // Verdes
    'Green': 'Verde',
    'Mint': 'Menta',
    'Lime': 'Lima',
    'Olive': 'Oliva',
    'Emerald': 'Esmeralda',
    'Jade': 'Jade',
    'Forest Green': 'Verde Bosque',
    'Sea Green': 'Verde Mar',
    'Teal': 'Verde Azulado',

    // Rojos y rosas
    'Red': 'Rojo',
    'Pink': 'Rosa',
    'Rose': 'Rosa',
    'Crimson': 'Carmesí',
    'Scarlet': 'Escarlata',
    'Burgundy': 'Borgoña',
    'Coral': 'Coral',
    'Salmon': 'Salmón',
    'Ruby': 'Rubí',

    // Amarillos y naranjas
    'Yellow': 'Amarillo',
    'Gold': 'Dorado',
    'Orange': 'Naranja',
    'Amber': 'Ámbar',
    'Peach': 'Durazno',
    'Apricot': 'Albaricoque',

    // Morados
    'Purple': 'Morado',
    'Violet': 'Violeta',
    'Lavender': 'Lavanda',
    'Lilac': 'Lila',
    'Plum': 'Ciruela',
    'Magenta': 'Magenta',

    // Marrones y beiges
    'Brown': 'Marrón',
    'Beige': 'Beige',
    'Tan': 'Bronceado',
    'Cream': 'Crema',
    'Khaki': 'Caqui',
    'Coffee': 'Café',
    'Chocolate': 'Chocolate',
    'Sand': 'Arena',
  };

  // Buscar traducción exacta
  if (translations[englishName]) {
    return translations[englishName];
  }

  // Buscar traducción parcial (ej: "Dark Blue" -> "Azul Oscuro")
  for (const [english, spanish] of Object.entries(translations)) {
    if (englishName.includes(english)) {
      let translated = englishName.replace(english, spanish);

      // Traducir modificadores comunes
      translated = translated
        .replace('Dark', 'Oscuro')
        .replace('Light', 'Claro')
        .replace('Pale', 'Pálido')
        .replace('Deep', 'Profundo')
        .replace('Bright', 'Brillante')
        .replace('Dim', 'Tenue');

      return translated;
    }
  }

  // Si no hay traducción, devolver el nombre original
  return englishName;
}

/**
 * Obtiene información completa del color
 * @param hex - Código hexadecimal del color
 * @returns Objeto con nombre y hex del color
 */
export function getColorInfo(hex: string): { name: string; hex: string } {
  return {
    name: getColorName(hex),
    hex: hex.trim().toUpperCase()
  };
}
