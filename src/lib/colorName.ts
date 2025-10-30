// Utilidad para convertir un código HEX a un nombre amigable en español

function clamp(value: number, min: number, max: number): number {   
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().toLowerCase();
  const match = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  let r = 0, g = 0, b = 0;
  if (normalized.length === 4) {
    r = parseInt(normalized[1] + normalized[1], 16);
    g = parseInt(normalized[2] + normalized[2], 16);
    b = parseInt(normalized[3] + normalized[3], 16);
  } else {
    r = parseInt(normalized.slice(1, 3), 16);
    g = parseInt(normalized.slice(3, 5), 16);
    b = parseInt(normalized.slice(5, 7), 16);
  }
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0; s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

const EXACT_HEX_TO_NAME: Record<string, string> = {
  // Negros y blancos
  "#000000": "Negro",
  "#ffffff": "Blanco",
  "#f5f5f5": "Blanco Fantasma",
  "#f8f8f8": "Blanco Perla",
  // Grises
  "#808080": "Gris",
  "#9e9e9e": "Gris Fantasma",
  "#6b6b6b": "Gris Titanio",
  "#595959": "Gris Grafito",
  "#b8b8b8": "Gris Plata",
  "#c4c4c4": "Gris Místico",
  // Azules
  "#1e40af": "Azul",
  "#003366": "Azul Medianoche",
  "#000080": "Azul Marino",
  "#006994": "Azul Océano",
  "#87ceeb": "Azul Cielo",
  // Verdes
  "#10b981": "Verde",
  "#98ff98": "Verde Menta",
  "#808000": "Verde Oliva",
  // Rosas y rojos
  "#ffc0cb": "Rosa",
  "#dc2626": "Rojo",
  "#ff2400": "Rojo Escarlata",
  "#dc143c": "Rojo Carmesí",
  // Morados
  "#7c3aed": "Morado",
  "#b19cd9": "Lavanda",
  // Amarillos / dorados / naranjas
  "#fbbf24": "Amarillo",
  "#d4af37": "Dorado",
  "#f97316": "Naranja",
  // Marrones / beige
  "#8b4513": "Marrón",
  "#f5f5dc": "Beige",
  // Plateado / transparente genérico
  "#c0c0c0": "Plateado",
  "#f3f4f6": "Transparente",
};

function classifyByHsl(h: number, s: number, l: number): string {
  const lightness = l;
  const saturation = s;

  // Descriptores de luminosidad
  const tone = lightness < 25 ? "oscuro" : lightness > 75 ? "claro" : "medio";

  // Casi blanco o casi negro
  if (lightness >= 92 && saturation <= 10) return "Blanco";
  if (lightness <= 8 && saturation <= 15) return "Negro";
  if (saturation <= 12) return `Gris ${tone}`.trim();

  // Familias por tono
  // Rangos de h (0-360)
  if (h < 15 || h >= 345) return `Rojo ${tone}`.trim();
  if (h < 45) return `Naranja ${tone}`.trim();
  if (h < 65) return `Amarillo ${tone}`.trim();
  if (h < 170) return `Verde ${tone}`.trim();
  if (h < 200) return `Cian ${tone}`.trim();
  if (h < 255) return `Azul ${tone}`.trim();
  if (h < 290) return `Índigo ${tone}`.trim();
  if (h < 330) return `Morado ${tone}`.trim();
  return `Rosa ${tone}`.trim();
}

export function getColorNameFromHex(hex: string): string {
  if (!hex || typeof hex !== "string") return "Color";
  const normalized = hex.trim().toLowerCase();

  // Match exacto primero
  if (EXACT_HEX_TO_NAME[normalized]) return EXACT_HEX_TO_NAME[normalized];

  // Convertir y clasificar
  const rgb = hexToRgb(normalized);
  if (!rgb) return "Color";
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const name = classifyByHsl(clamp(h, 0, 360), clamp(s, 0, 100), clamp(l, 0, 100));
  // Capitalizar adecuadamente (ya viene capitalizado en reglas)
  return name;
}

export default getColorNameFromHex;


