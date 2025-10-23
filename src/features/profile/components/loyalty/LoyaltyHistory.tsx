/**
 * @module LoyaltyHistory
 * @description Transaction history for loyalty points
 */

import React from 'react';
import { Gift, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HISTORY } from './loyaltyConfig';

export const LoyaltyHistory: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Historial</h2>
        <div className="bg-white rounded-2xl border-2 border-gray-200 divide-y-2 divide-gray-100">
          {HISTORY.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-8">
              <div className="flex items-center gap-6">
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center',
                    item.type === 'earned' ? 'bg-black text-white' : 'bg-gray-100'
                  )}
                >
                  {item.type === 'earned' ? (
                    <TrendingUp className="w-7 h-7" />
                  ) : (
                    <Gift className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg mb-1">{item.description}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {item.date.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'text-3xl font-bold',
                  item.points > 0 ? 'text-black' : 'text-gray-500'
                )}
              >
                {item.points > 0 ? '+' : ''}{item.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

LoyaltyHistory.displayName = 'LoyaltyHistory';

export default LoyaltyHistory;
