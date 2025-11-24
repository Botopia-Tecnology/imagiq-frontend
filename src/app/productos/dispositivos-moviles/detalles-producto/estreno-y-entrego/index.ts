// Export all trade-in related components
export { default as TradeInModal } from './TradeInModal';
export { default as TradeInSelector } from './TradeInSelector';
export { default as TradeInCompletedSummary } from './TradeInCompletedSummary';
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

// Export hooks
export { useTradeInForm } from './hooks/useTradeInForm';
export { useTradeInFlow } from './hooks/useTradeInFlow';
export { useTradeInData, extractCodMarca, extractCodModelo } from './hooks/useTradeInData';
export { useTradeInPrefetch, useTradeInDataFromCache, clearTradeInCache } from '@/hooks/useTradeInPrefetch';

// Export constants
export {
  INITIAL_ELIGIBILITY_QUESTIONS,
  DAMAGE_FREE_QUESTION,
  GOOD_CONDITION_DETAILED_QUESTION,
  DeviceState,
} from './constants/tradeInQuestions';
export type { QuestionData } from './constants/tradeInQuestions';
