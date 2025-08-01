/**
 * Tipos TypeScript para Analytics y PostHog
 * - Eventos de tracking
 * - Métricas de negocio
 * - Datos de comportamiento de usuario
 * - KPIs y reportes
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  distinctId?: string;
}

export interface UserBehaviorEvent extends AnalyticsEvent {
  event:
    | "page_view"
    | "product_view"
    | "search"
    | "filter_applied"
    | "sort_changed"
    | "add_to_cart"
    | "remove_from_cart"
    | "wishlist_add"
    | "wishlist_remove"
    | "checkout_started"
    | "checkout_completed"
    | "checkout_abandoned"
    | "review_submitted"
    | "support_contacted"
    | "newsletter_signup";
}

export interface EcommerceEvent extends AnalyticsEvent {
  event:
    | "purchase"
    | "refund"
    | "add_payment_info"
    | "add_shipping_info"
    | "begin_checkout"
    | "purchase_complete";
  properties: {
    revenue?: number;
    currency?: string;
    items?: Array<{
      productId: string;
      productName: string;
      category: string;
      price: number;
      quantity: number;
    }>;
    orderId?: string;
    paymentMethod?: string;
    shippingMethod?: string;
  };
}

export interface SalesMetrics {
  period: "day" | "week" | "month" | "quarter" | "year";
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  returnRate: number;
  byRegion: Array<{
    region: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  byCategory: Array<{
    category: string;
    revenue: number;
    orders: number;
    items: number;
  }>;
  byTimeOfDay: Array<{
    hour: number;
    revenue: number;
    orders: number;
  }>;
}

export interface UserSegmentMetrics {
  segmentId: string;
  segmentName: string;
  userCount: number;
  characteristics: {
    averageAge?: number;
    genderDistribution?: Record<string, number>;
    locationDistribution?: Record<string, number>;
    deviceDistribution?: Record<string, number>;
  };
  behavior: {
    averageSessionDuration: number;
    averagePageViews: number;
    bounceRate: number;
    conversionRate: number;
    averageOrderValue: number;
    purchaseFrequency: number;
  };
  preferences: {
    topCategories: string[];
    preferredBrands: string[];
    priceRange: {
      min: number;
      max: number;
      average: number;
    };
  };
}

export interface HeatmapData {
  pageUrl: string;
  elementSelector: string;
  eventType: "click" | "hover" | "scroll" | "form_interaction";
  coordinates: {
    x: number;
    y: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  timestamp: string;
  sessionId: string;
  userId?: string;
  deviceType: "desktop" | "mobile" | "tablet";
}

export interface SEOMetrics {
  page: string;
  date: string;
  organicTraffic: number;
  bounceRate: number;
  averageSessionDuration: number;
  pageLoadTime: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  keywords: Array<{
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
  }>;
  backlinks: number;
  indexedPages: number;
}

export interface ConversionFunnel {
  name: string;
  steps: Array<{
    name: string;
    totalUsers: number;
    completedUsers: number;
    conversionRate: number;
    averageTimeToComplete: number;
    dropOffReasons?: string[];
  }>;
  overallConversionRate: number;
  totalUsers: number;
  completedUsers: number;
}

export interface SessionReplayData {
  sessionId: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  pageViews: number;
  events: Array<{
    type: string;
    timestamp: string;
    data: Record<string, any>;
  }>;
  device: {
    type: "desktop" | "mobile" | "tablet";
    os: string;
    browser: string;
    screenResolution: string;
  };
  location: {
    country: string;
    city: string;
  };
  hasErrors: boolean;
  conversionEvents: string[];
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  trafficAllocation: number;
  isControl: boolean;
  changes: Record<string, any>;
}

export interface ABTestResult {
  testId: string;
  testName: string;
  startDate: string;
  endDate?: string;
  status: "draft" | "running" | "completed" | "paused";
  variants: Array<
    ABTestVariant & {
      participants: number;
      conversions: number;
      conversionRate: number;
      statisticalSignificance: number;
      uplift: number;
    }
  >;
  primaryMetric: string;
  secondaryMetrics?: string[];
  winningVariant?: string;
}

export interface DashboardWidget {
  id: string;
  type: "metric" | "chart" | "table" | "heatmap" | "funnel";
  title: string;
  data: any;
  config: {
    chartType?: "line" | "bar" | "pie" | "area";
    timeRange?: string;
    filters?: Record<string, any>;
    refreshInterval?: number;
  };
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
