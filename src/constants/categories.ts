/**
 * Categorías de productos y taxonomía
 * - Jerarquía de categorías
 * - Filtros disponibles
 * - Etiquetas y tags
 * - Configuración de faceted search
 */

// Main product categories
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: {
    id: "electronics",
    name: "Electrónicos",
    slug: "electronics",
    subcategories: {
      SMARTPHONES: {
        id: "smartphones",
        name: "Smartphones",
        slug: "smartphones",
      },
      LAPTOPS: { id: "laptops", name: "Laptops", slug: "laptops" },
      TABLETS: { id: "tablets", name: "Tablets", slug: "tablets" },
      ACCESSORIES: {
        id: "accessories",
        name: "Accesorios",
        slug: "accessories",
      },
    },
  },
  CLOTHING: {
    id: "clothing",
    name: "Ropa",
    slug: "clothing",
    subcategories: {
      MEN: { id: "men-clothing", name: "Hombre", slug: "men" },
      WOMEN: { id: "women-clothing", name: "Mujer", slug: "women" },
      KIDS: { id: "kids-clothing", name: "Niños", slug: "kids" },
    },
  },
  HOME: {
    id: "home",
    name: "Hogar",
    slug: "home",
    subcategories: {
      FURNITURE: { id: "furniture", name: "Muebles", slug: "furniture" },
      DECORATION: { id: "decoration", name: "Decoración", slug: "decoration" },
      KITCHEN: { id: "kitchen", name: "Cocina", slug: "kitchen" },
    },
  },
} as const;

// Product filters
export const PRODUCT_FILTERS = {
  PRICE_RANGES: [
    { id: "under-50", label: "Menos de $50", min: 0, max: 50 },
    { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
    { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
    { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
    { id: "over-500", label: "Más de $500", min: 500, max: null },
  ],
  BRANDS: ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Zara", "H&M", "IKEA"],
  RATINGS: [
    { id: "4-plus", label: "4 estrellas y más", value: 4 },
    { id: "3-plus", label: "3 estrellas y más", value: 3 },
    { id: "2-plus", label: "2 estrellas y más", value: 2 },
    { id: "1-plus", label: "1 estrella y más", value: 1 },
  ],
  AVAILABILITY: [
    { id: "in-stock", label: "En stock", value: true },
    { id: "out-of-stock", label: "Agotado", value: false },
  ],
} as const;

// Sort options
export const SORT_OPTIONS = [
  { id: "relevance", label: "Relevancia", value: "relevance", default: true },
  { id: "price-low-high", label: "Precio: Menor a Mayor", value: "price_asc" },
  { id: "price-high-low", label: "Precio: Mayor a Menor", value: "price_desc" },
  { id: "rating", label: "Mejor Calificación", value: "rating_desc" },
  { id: "newest", label: "Más Recientes", value: "created_desc" },
  { id: "popularity", label: "Más Populares", value: "popularity_desc" },
] as const;

// Product tags for better categorization
export const PRODUCT_TAGS = {
  FEATURES: [
    "nuevo",
    "oferta",
    "bestseller",
    "premium",
    "eco-friendly",
    "limitado",
    "exclusivo",
    "descuento",
    "envio-gratis",
  ],
  OCCASIONS: [
    "trabajo",
    "casual",
    "formal",
    "deporte",
    "fiesta",
    "verano",
    "invierno",
    "regalo",
  ],
  TARGET_AUDIENCE: [
    "hombres",
    "mujeres",
    "niños",
    "adolescentes",
    "adultos-mayores",
    "profesionales",
    "estudiantes",
    "gamers",
    "fitness",
  ],
} as const;

// User preference categories for personalization
export const USER_PREFERENCE_CATEGORIES = [
  "electronics",
  "fashion",
  "home-garden",
  "sports-outdoors",
  "books-media",
  "health-beauty",
  "automotive",
  "food-beverages",
] as const;
