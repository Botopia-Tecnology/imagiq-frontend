// Export all trade-in related components
export { default as TradeInModal } from './TradeInModal';
export { default as TradeInSelector } from './TradeInSelector';
export { default as BrandDropdown } from './BrandDropdown';
export { default as DeviceCategorySelector } from './DeviceCategorySelector';
export { default as SimpleDropdown } from './SimpleDropdown';
export { default as TradeInInformation } from './TradeInInformation';
export * from './DeviceIcons';

// Export types
export type {
  DeviceCategory,
  Brand,
  DeviceModel,
  DeviceCapacity,
  TradeInData,
  TradeInSelection,
} from './types';

// Export data and helper functions
export {
  mockTradeInData,
  getAvailableBrands,
  getAvailableModels,
  getAvailableCapacities,
} from './mockData';

// Export hooks
export { useTradeInForm } from './hooks/useTradeInForm';

// Export constants
export { CONDITION_QUESTIONS } from './constants/tradeInQuestions';
export type { ConditionQuestionData } from './constants/tradeInQuestions';
