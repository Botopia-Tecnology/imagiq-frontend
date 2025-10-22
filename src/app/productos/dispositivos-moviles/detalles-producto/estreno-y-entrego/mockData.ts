import type { TradeInData } from "./types";

/**
 * Mock data for trade-in feature
 * This structure should be replaced with API calls to the dashboard in the future
 *
 * TODO: Replace with API endpoints:
 * - GET /api/trade-in/categories
 * - GET /api/trade-in/brands
 * - GET /api/trade-in/models?brandId=xxx&categoryId=xxx
 * - GET /api/trade-in/capacities?modelId=xxx
 */

export const mockTradeInData: TradeInData = {
  categories: [
    {
      id: "watch",
      name: "WATCH",
      icon: "watch" as const,
      maxPrice: 550000,
    },
    {
      id: "smartphone",
      name: "SMARTPHONE",
      icon: "smartphone" as const,
      maxPrice: 2518500,
    },
    {
      id: "tablet",
      name: "TABLET",
      icon: "tablet" as const,
      maxPrice: 2247500,
    },
  ],

  brands: [
    {
      id: "samsung",
      name: "Samsung",
      maxDiscount: 230000,
    },
    {
      id: "apple",
      name: "Apple",
      maxDiscount: 551900,
    },
    {
      id: "xiaomi",
      name: "Xiaomi",
      maxDiscount: 87700,
    },
    {
      id: "redmi",
      name: "Redmi",
      maxDiscount: 4900,
    },
  ],

  models: [
    // Samsung Smartphones
    {
      id: "samsung-galaxy-s23-ultra",
      name: "Galaxy S23 Ultra",
      brandId: "samsung",
      categoryId: "smartphone",
    },
    {
      id: "samsung-galaxy-s23-plus",
      name: "Galaxy S23+",
      brandId: "samsung",
      categoryId: "smartphone",
    },
    {
      id: "samsung-galaxy-s23",
      name: "Galaxy S23",
      brandId: "samsung",
      categoryId: "smartphone",
    },

    // Apple Smartphones
    {
      id: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max",
      brandId: "apple",
      categoryId: "smartphone",
    },
    {
      id: "iphone-15-pro",
      name: "iPhone 15 Pro",
      brandId: "apple",
      categoryId: "smartphone",
    },
    {
      id: "iphone-15",
      name: "iPhone 15",
      brandId: "apple",
      categoryId: "smartphone",
    },
    {
      id: "iphone-14-pro-max",
      name: "iPhone 14 Pro Max",
      brandId: "apple",
      categoryId: "smartphone",
    },

    // Xiaomi Smartphones
    {
      id: "xiaomi-13-pro",
      name: "Xiaomi 13 Pro",
      brandId: "xiaomi",
      categoryId: "smartphone",
    },
    {
      id: "xiaomi-13",
      name: "Xiaomi 13",
      brandId: "xiaomi",
      categoryId: "smartphone",
    },
    {
      id: "xiaomi-12-pro",
      name: "Xiaomi 12 Pro",
      brandId: "xiaomi",
      categoryId: "smartphone",
    },

    // Redmi Smartphones
    {
      id: "redmi-note-13-pro",
      name: "Redmi Note 13 Pro",
      brandId: "redmi",
      categoryId: "smartphone",
    },
    {
      id: "redmi-note-13",
      name: "Redmi Note 13",
      brandId: "redmi",
      categoryId: "smartphone",
    },
    {
      id: "redmi-note-12",
      name: "Redmi Note 12",
      brandId: "redmi",
      categoryId: "smartphone",
    },

    // Apple Watches
    {
      id: "apple-watch-series-9",
      name: "Apple Watch Series 9",
      brandId: "apple",
      categoryId: "watch",
    },
    {
      id: "apple-watch-ultra-2",
      name: "Apple Watch Ultra 2",
      brandId: "apple",
      categoryId: "watch",
    },

    // Samsung Watches
    {
      id: "samsung-galaxy-watch-6",
      name: "Galaxy Watch 6",
      brandId: "samsung",
      categoryId: "watch",
    },
    {
      id: "samsung-galaxy-watch-5",
      name: "Galaxy Watch 5",
      brandId: "samsung",
      categoryId: "watch",
    },

    // Xiaomi Watches
    {
      id: "xiaomi-watch-s1",
      name: "Xiaomi Watch S1",
      brandId: "xiaomi",
      categoryId: "watch",
    },

    // Apple Tablets
    {
      id: "ipad-pro-12-9",
      name: "iPad Pro 12.9\"",
      brandId: "apple",
      categoryId: "tablet",
    },
    {
      id: "ipad-air",
      name: "iPad Air",
      brandId: "apple",
      categoryId: "tablet",
    },

    // Samsung Tablets
    {
      id: "samsung-galaxy-tab-s9",
      name: "Galaxy Tab S9",
      brandId: "samsung",
      categoryId: "tablet",
    },
    {
      id: "samsung-galaxy-tab-s8",
      name: "Galaxy Tab S8",
      brandId: "samsung",
      categoryId: "tablet",
    },

    // Xiaomi Tablets
    {
      id: "xiaomi-pad-6",
      name: "Xiaomi Pad 6",
      brandId: "xiaomi",
      categoryId: "tablet",
    },
  ],

  capacities: [
    // iPhone 15 Pro Max capacities
    {
      id: "iphone-15-pro-max-256gb",
      name: "256GB",
      modelId: "iphone-15-pro-max",
      tradeInValue: 2400000,
    },
    {
      id: "iphone-15-pro-max-512gb",
      name: "512GB",
      modelId: "iphone-15-pro-max",
      tradeInValue: 2600000,
    },
    {
      id: "iphone-15-pro-max-1tb",
      name: "1TB",
      modelId: "iphone-15-pro-max",
      tradeInValue: 2800000,
    },

    // iPhone 15 Pro capacities
    {
      id: "iphone-15-pro-128gb",
      name: "128GB",
      modelId: "iphone-15-pro",
      tradeInValue: 2000000,
    },
    {
      id: "iphone-15-pro-256gb",
      name: "256GB",
      modelId: "iphone-15-pro",
      tradeInValue: 2200000,
    },
    {
      id: "iphone-15-pro-512gb",
      name: "512GB",
      modelId: "iphone-15-pro",
      tradeInValue: 2400000,
    },

    // iPhone 15 capacities
    {
      id: "iphone-15-128gb",
      name: "128GB",
      modelId: "iphone-15",
      tradeInValue: 1600000,
    },
    {
      id: "iphone-15-256gb",
      name: "256GB",
      modelId: "iphone-15",
      tradeInValue: 1800000,
    },
    {
      id: "iphone-15-512gb",
      name: "512GB",
      modelId: "iphone-15",
      tradeInValue: 2000000,
    },

    // Samsung Galaxy S23 Ultra capacities
    {
      id: "samsung-s23-ultra-256gb",
      name: "256GB",
      modelId: "samsung-galaxy-s23-ultra",
      tradeInValue: 1800000,
    },
    {
      id: "samsung-s23-ultra-512gb",
      name: "512GB",
      modelId: "samsung-galaxy-s23-ultra",
      tradeInValue: 2000000,
    },
    {
      id: "samsung-s23-ultra-1tb",
      name: "1TB",
      modelId: "samsung-galaxy-s23-ultra",
      tradeInValue: 2200000,
    },

    // Xiaomi 13 Pro capacities
    {
      id: "xiaomi-13-pro-256gb",
      name: "256GB",
      modelId: "xiaomi-13-pro",
      tradeInValue: 800000,
    },
    {
      id: "xiaomi-13-pro-512gb",
      name: "512GB",
      modelId: "xiaomi-13-pro",
      tradeInValue: 900000,
    },

    // Xiaomi 13 capacities
    {
      id: "xiaomi-13-128gb",
      name: "128GB",
      modelId: "xiaomi-13",
      tradeInValue: 600000,
    },
    {
      id: "xiaomi-13-256gb",
      name: "256GB",
      modelId: "xiaomi-13",
      tradeInValue: 700000,
    },

    // Xiaomi 12 Pro capacities
    {
      id: "xiaomi-12-pro-256gb",
      name: "256GB",
      modelId: "xiaomi-12-pro",
      tradeInValue: 650000,
    },
    {
      id: "xiaomi-12-pro-512gb",
      name: "512GB",
      modelId: "xiaomi-12-pro",
      tradeInValue: 750000,
    },

    // Redmi Note 13 Pro capacities
    {
      id: "redmi-note-13-pro-128gb",
      name: "128GB",
      modelId: "redmi-note-13-pro",
      tradeInValue: 250000,
    },
    {
      id: "redmi-note-13-pro-256gb",
      name: "256GB",
      modelId: "redmi-note-13-pro",
      tradeInValue: 300000,
    },

    // Redmi Note 13 capacities
    {
      id: "redmi-note-13-128gb",
      name: "128GB",
      modelId: "redmi-note-13",
      tradeInValue: 200000,
    },
    {
      id: "redmi-note-13-256gb",
      name: "256GB",
      modelId: "redmi-note-13",
      tradeInValue: 250000,
    },

    // Redmi Note 12 capacities
    {
      id: "redmi-note-12-64gb",
      name: "64GB",
      modelId: "redmi-note-12",
      tradeInValue: 150000,
    },
    {
      id: "redmi-note-12-128gb",
      name: "128GB",
      modelId: "redmi-note-12",
      tradeInValue: 180000,
    },

    // Apple Watch Series 9 capacities
    {
      id: "apple-watch-9-41mm",
      name: "41mm",
      modelId: "apple-watch-series-9",
      tradeInValue: 400000,
    },
    {
      id: "apple-watch-9-45mm",
      name: "45mm",
      modelId: "apple-watch-series-9",
      tradeInValue: 450000,
    },

    // Apple Watch Ultra 2 capacities
    {
      id: "apple-watch-ultra-2-49mm",
      name: "49mm",
      modelId: "apple-watch-ultra-2",
      tradeInValue: 550000,
    },

    // Samsung Galaxy Watch 6 capacities
    {
      id: "samsung-watch-6-40mm",
      name: "40mm",
      modelId: "samsung-galaxy-watch-6",
      tradeInValue: 300000,
    },
    {
      id: "samsung-watch-6-44mm",
      name: "44mm",
      modelId: "samsung-galaxy-watch-6",
      tradeInValue: 350000,
    },

    // Samsung Galaxy Watch 5 capacities
    {
      id: "samsung-watch-5-40mm",
      name: "40mm",
      modelId: "samsung-galaxy-watch-5",
      tradeInValue: 250000,
    },
    {
      id: "samsung-watch-5-44mm",
      name: "44mm",
      modelId: "samsung-galaxy-watch-5",
      tradeInValue: 280000,
    },

    // Xiaomi Watch S1 capacities
    {
      id: "xiaomi-watch-s1-standard",
      name: "Standard",
      modelId: "xiaomi-watch-s1",
      tradeInValue: 180000,
    },
    {
      id: "xiaomi-watch-s1-active",
      name: "Active",
      modelId: "xiaomi-watch-s1",
      tradeInValue: 200000,
    },

    // iPad Pro capacities
    {
      id: "ipad-pro-12-9-128gb",
      name: "128GB",
      modelId: "ipad-pro-12-9",
      tradeInValue: 1500000,
    },
    {
      id: "ipad-pro-12-9-256gb",
      name: "256GB",
      modelId: "ipad-pro-12-9",
      tradeInValue: 1700000,
    },
    {
      id: "ipad-pro-12-9-512gb",
      name: "512GB",
      modelId: "ipad-pro-12-9",
      tradeInValue: 1900000,
    },
    {
      id: "ipad-pro-12-9-1tb",
      name: "1TB",
      modelId: "ipad-pro-12-9",
      tradeInValue: 2100000,
    },

    // iPad Air capacities
    {
      id: "ipad-air-64gb",
      name: "64GB",
      modelId: "ipad-air",
      tradeInValue: 900000,
    },
    {
      id: "ipad-air-256gb",
      name: "256GB",
      modelId: "ipad-air",
      tradeInValue: 1100000,
    },

    // Samsung Galaxy Tab S9 capacities
    {
      id: "samsung-tab-s9-128gb",
      name: "128GB",
      modelId: "samsung-galaxy-tab-s9",
      tradeInValue: 1000000,
    },
    {
      id: "samsung-tab-s9-256gb",
      name: "256GB",
      modelId: "samsung-galaxy-tab-s9",
      tradeInValue: 1200000,
    },

    // Samsung Galaxy Tab S8 capacities
    {
      id: "samsung-tab-s8-128gb",
      name: "128GB",
      modelId: "samsung-galaxy-tab-s8",
      tradeInValue: 800000,
    },
    {
      id: "samsung-tab-s8-256gb",
      name: "256GB",
      modelId: "samsung-galaxy-tab-s8",
      tradeInValue: 950000,
    },

    // Xiaomi Pad 6 capacities
    {
      id: "xiaomi-pad-6-128gb",
      name: "128GB",
      modelId: "xiaomi-pad-6",
      tradeInValue: 400000,
    },
    {
      id: "xiaomi-pad-6-256gb",
      name: "256GB",
      modelId: "xiaomi-pad-6",
      tradeInValue: 500000,
    },
  ],
};

/**
 * Helper functions to filter data based on selections
 */

export const getAvailableBrands = (
  data: TradeInData,
  categoryId: string
): typeof data.brands => {
  // Get all models for this category
  const categoryModels = data.models.filter(
    (model) => model.categoryId === categoryId
  );

  // Get unique brand IDs from those models
  const brandIds = new Set(categoryModels.map((model) => model.brandId));

  // Return brands that have models in this category
  return data.brands.filter((brand) => brandIds.has(brand.id));
};

export const getAvailableModels = (
  data: TradeInData,
  brandId: string,
  categoryId: string
): typeof data.models => {
  return data.models.filter(
    (model) => model.brandId === brandId && model.categoryId === categoryId
  );
};

export const getAvailableCapacities = (
  data: TradeInData,
  modelId: string
): typeof data.capacities => {
  return data.capacities.filter((capacity) => capacity.modelId === modelId);
};
