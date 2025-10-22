// Trade-in data types and interfaces

export interface DeviceCategory {
  id: string;
  name: string;
  icon: 'watch' | 'smartphone' | 'tablet';
  maxPrice: number;
}

export interface Brand {
  id: string;
  name: string;
  maxDiscount: number;
}

export interface DeviceModel {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
}

export interface DeviceCapacity {
  id: string;
  name: string;
  modelId: string;
  tradeInValue: number;
}

export interface TradeInData {
  categories: DeviceCategory[];
  brands: Brand[];
  models: DeviceModel[];
  capacities: DeviceCapacity[];
}

export interface TradeInSelection {
  category: DeviceCategory | null;
  brand: Brand | null;
  model: DeviceModel | null;
  capacity: DeviceCapacity | null;
}
