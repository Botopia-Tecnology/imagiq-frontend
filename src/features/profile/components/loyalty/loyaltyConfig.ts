/**
 * @module LoyaltyConfig
 * @description Configuration and constants for loyalty program
 */

import { Star, Award, Crown, Gift, ShoppingBag, Zap, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface LoyaltyLevel {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: LucideIcon;
  benefits: string[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: LucideIcon;
}

export interface HistoryItem {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: Date;
}

export const LOYALTY_LEVELS: LoyaltyLevel[] = [
  {
    name: 'Bronce',
    minPoints: 0,
    maxPoints: 999,
    icon: Award,
    benefits: [
      'Acumula 1 punto por cada $100',
      'Acceso a ofertas exclusivas',
      'Envío gratis sobre $50,000'
    ]
  },
  {
    name: 'Plata',
    minPoints: 1000,
    maxPoints: 4999,
    icon: Star,
    benefits: [
      'Acumula 1.5 puntos por cada $100',
      '5% descuento en seleccionados',
      'Envío gratis sobre $30,000',
      'Acceso anticipado a ventas'
    ]
  },
  {
    name: 'Oro',
    minPoints: 5000,
    maxPoints: 9999,
    icon: Award,
    benefits: [
      'Acumula 2 puntos por cada $100',
      '10% descuento en seleccionados',
      'Envío gratis sin mínimo',
      'Soporte prioritario',
      'Regalo de cumpleaños'
    ]
  },
  {
    name: 'Platino',
    minPoints: 10000,
    maxPoints: Infinity,
    icon: Crown,
    benefits: [
      'Acumula 3 puntos por cada $100',
      '15% descuento total',
      'Envío express gratis',
      'Soporte VIP 24/7',
      'Productos exclusivos',
      'Evento anual VIP'
    ]
  }
];

export const REWARDS: Reward[] = [
  { id: '1', name: 'Cupón $10,000', description: 'Descuento inmediato', points: 500, icon: Gift },
  { id: '2', name: 'Envío Gratis', description: '3 envíos sin costo', points: 800, icon: Zap },
  { id: '3', name: 'Cupón $25,000', description: 'En compras sobre $100K', points: 1200, icon: Gift },
  { id: '4', name: '20% Descuento', description: 'Próxima compra', points: 1500, icon: Star },
  { id: '5', name: 'Producto Gratis', description: 'Hasta $50,000', points: 2500, icon: ShoppingBag },
  { id: '6', name: 'Cupón $50,000', description: 'En compras sobre $200K', points: 3000, icon: Crown }
];

export const HISTORY: HistoryItem[] = [
  { id: '1', type: 'earned', points: 150, description: 'Compra Galaxy S23 Ultra', date: new Date('2024-01-10') },
  { id: '2', type: 'redeemed', points: -500, description: 'Cupón $10,000', date: new Date('2024-01-05') },
  { id: '3', type: 'earned', points: 80, description: 'Compra Galaxy Buds', date: new Date('2024-01-02') }
];

export const getCurrentLevel = (points: number): LoyaltyLevel => {
  return LOYALTY_LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) || LOYALTY_LEVELS[0];
};

export const getNextLevel = (points: number): LoyaltyLevel | null => {
  const idx = LOYALTY_LEVELS.findIndex(l => points >= l.minPoints && points <= l.maxPoints);
  return idx < LOYALTY_LEVELS.length - 1 ? LOYALTY_LEVELS[idx + 1] : null;
};
