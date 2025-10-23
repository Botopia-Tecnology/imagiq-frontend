/**
 * @module LoyaltyHero
 * @description Hero section for loyalty page with current level and points
 */

import React from 'react';
import { Crown } from 'lucide-react';
import { LoyaltyProgram } from '../../types';
import { getCurrentLevel, getNextLevel } from './loyaltyConfig';

interface LoyaltyHeroProps {
  loyaltyProgram: LoyaltyProgram;
}

export const LoyaltyHero: React.FC<LoyaltyHeroProps> = ({ loyaltyProgram }) => {
  const currentLevel = getCurrentLevel(loyaltyProgram.points);
  const nextLevel = getNextLevel(loyaltyProgram.points);
  const LevelIcon = currentLevel.icon;

  const progress = nextLevel
    ? ((loyaltyProgram.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;
  const pointsToNext = nextLevel ? nextLevel.minPoints - loyaltyProgram.points : 0;

  return (
    <div className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">Programa de Lealtad</h1>
          <p className="text-gray-400 text-lg md:text-xl">Gana puntos con cada compra</p>
        </div>

        <div className="bg-white text-black rounded-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <LevelIcon className="w-10 h-10" />
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-widest">
                  Nivel Actual
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2">{currentLevel.name}</h2>
              <p className="text-gray-600 text-lg">Miembro desde 2023</p>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-2">
                {loyaltyProgram.points.toLocaleString()}
              </div>
              <div className="text-gray-600 font-semibold text-lg">Puntos</div>
            </div>
          </div>

          {nextLevel && (
            <div className="border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold uppercase tracking-wider">{currentLevel.name}</span>
                <span className="text-sm font-bold uppercase tracking-wider">{nextLevel.name}</span>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-black transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 font-medium">
                {pointsToNext.toLocaleString()} puntos para alcanzar {nextLevel.name}
              </p>
            </div>
          )}

          {!nextLevel && (
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-2 text-black">
                <Crown className="w-6 h-6" />
                <span className="font-bold text-lg">Nivel máximo alcanzado</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LoyaltyHero.displayName = 'LoyaltyHero';

export default LoyaltyHero;
