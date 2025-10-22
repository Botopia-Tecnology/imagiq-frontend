/**
 * @module BenefitsSection
 * @description Benefits section for profile page - Samsung style
 */

import React from "react";
import { Gift, Star } from "lucide-react";
import MenuItem from "./MenuItem";
import { LoyaltyProgram } from "../../types";

interface BenefitsSectionProps {
  couponsCount: number;
  loyaltyProgram?: LoyaltyProgram;
  onCouponsClick: () => void;
  onLoyaltyClick: () => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  couponsCount,
  loyaltyProgram,
  onCouponsClick,
  onLoyaltyClick,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">
        Beneficios
      </h2>
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
        <MenuItem
          icon={Gift}
          label="Cupones"
          badge={couponsCount}
          onClick={onCouponsClick}
        />
        {loyaltyProgram && (
          <MenuItem
            icon={Star}
            label="Programa de Lealtad"
            badge={`${loyaltyProgram.points} pts`}
            onClick={onLoyaltyClick}
          />
        )}
      </div>
    </div>
  );
};

BenefitsSection.displayName = "BenefitsSection";

export default BenefitsSection;
