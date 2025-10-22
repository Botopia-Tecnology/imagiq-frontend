/**
 * @module LoyaltyBenefits
 * @description Benefits section showing current and all available levels
 */

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoyaltyProgram } from '../../types';
import { getCurrentLevel, LOYALTY_LEVELS } from './loyaltyConfig';

interface LoyaltyBenefitsProps {
  loyaltyProgram: LoyaltyProgram;
}

export const LoyaltyBenefits: React.FC<LoyaltyBenefitsProps> = ({ loyaltyProgram }) => {
  const currentLevel = getCurrentLevel(loyaltyProgram.points);

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Tus Beneficios</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {currentLevel.benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-black transition-colors"
            >
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-16 border-t-2 border-gray-100">
          <h3 className="text-2xl font-bold mb-8">Todos los Niveles</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOYALTY_LEVELS.map((level) => {
              const Icon = level.icon;
              const isActive = loyaltyProgram.points >= level.minPoints && loyaltyProgram.points <= level.maxPoints;
              const isUnlocked = loyaltyProgram.points >= level.minPoints;

              return (
                <div
                  key={level.name}
                  className={cn(
                    'p-8 rounded-2xl border-2 transition-all',
                    isActive
                      ? 'border-black bg-black text-white'
                      : isUnlocked
                        ? 'border-gray-300'
                        : 'border-gray-200 opacity-50'
                  )}
                >
                  <Icon className="w-10 h-10 mb-4" />
                  <h4 className="text-xl font-bold mb-2">{level.name}</h4>
                  <p className={cn('text-sm font-medium', isActive ? 'text-gray-300' : 'text-gray-600')}>
                    {level.minPoints.toLocaleString()}+ pts
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

LoyaltyBenefits.displayName = 'LoyaltyBenefits';

export default LoyaltyBenefits;
