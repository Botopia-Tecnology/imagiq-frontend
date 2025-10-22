/**
 * @module LoyaltyRewards
 * @description Rewards section for redeeming points
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { REWARDS } from './loyaltyConfig';

interface LoyaltyRewardsProps {
  userPoints: number;
  onRedeem: (rewardId: string) => void;
}

export const LoyaltyRewards: React.FC<LoyaltyRewardsProps> = ({ userPoints, onRedeem }) => {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Canjea tus Puntos</h2>
          <button className="text-sm font-bold hover:underline flex items-center gap-1 uppercase tracking-wider">
            Ver Todo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REWARDS.map((reward) => {
            const Icon = reward.icon;
            const canRedeem = userPoints >= reward.points;

            return (
              <div
                key={reward.id}
                className={cn(
                  'bg-white rounded-2xl border-2 overflow-hidden transition-all',
                  canRedeem
                    ? 'border-gray-300 hover:border-black hover:shadow-xl'
                    : 'border-gray-200 opacity-60'
                )}
              >
                <div className="p-8">
                  <Icon className="w-12 h-12 mb-6" />
                  <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                  <p className="text-sm text-gray-600 mb-6">{reward.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <div className="text-3xl font-bold">{reward.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 font-medium">puntos</div>
                  </div>

                  <Button
                    variant={canRedeem ? "primary" : "outline"}
                    size="md"
                    onClick={() => onRedeem(reward.id)}
                    disabled={!canRedeem}
                    className="w-full font-bold"
                  >
                    {canRedeem ? 'Canjear' : `Faltan ${(reward.points - userPoints).toLocaleString()} pts`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

LoyaltyRewards.displayName = 'LoyaltyRewards';

export default LoyaltyRewards;
