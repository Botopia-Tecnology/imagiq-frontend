/**
 * Tipos TypeScript para Productos
 * - Interfaces de productos y catálogo
 * - Variantes y opciones
 * - Inventario y pricing
 * - Reviews y ratings
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  brand: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes: ProductAttribute[];
  pricing: ProductPricing;
  inventory: ProductInventory;
  seo: ProductSEO;
  ratings: ProductRatings;
  tags: string[];
  status: "active" | "inactive" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
}

export interface ProductSubcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  sortOrder: number;
  isMain: boolean;
  size?: {
    width: number;
    height: number;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  type: "color" | "size" | "material" | "style";
  value: string;
  price?: number; // Additional price
  sku?: string;
  inventory?: number;
  images?: string[];
  isDefault?: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string | number | boolean;
  type: "text" | "number" | "boolean" | "select" | "multiselect";
  isFilterable: boolean;
  isRequired: boolean;
  sortOrder: number;
}

export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  discountPercentage?: number;
  currency: string;
  taxIncluded: boolean;
  priceHistory?: Array<{
    price: number;
    date: string;
    reason: string;
  }>;
}

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  location?: string;
  reservedQuantity?: number;
  lastUpdated: string;
}

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

export interface ProductRatings {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: string;
  };
}

export interface ProductSearchFilters {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  brand?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  attributes?: Record<string, any>;
  sortBy?:
    | "relevance"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "created_desc"
    | "popularity";
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    availableFilters: Record<string, any>;
    appliedFilters: ProductSearchFilters;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  totalPrice: number;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  addedAt: string;
  notes?: string;
}
