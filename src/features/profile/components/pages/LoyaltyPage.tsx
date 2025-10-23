/**
 * @module LoyaltyPage
 * @description Loyalty program page with Samsung-inspired minimalist design
 */

import React from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import LoyaltyHero from "../loyalty/LoyaltyHero";
import LoyaltyBenefits from "../loyalty/LoyaltyBenefits";
import LoyaltyRewards from "../loyalty/LoyaltyRewards";
import LoyaltyHowItWorks from "../loyalty/LoyaltyHowItWorks";
import LoyaltyHistory from "../loyalty/LoyaltyHistory";
import LoyaltyEmptyState from "../loyalty/LoyaltyEmptyState";

interface LoyaltyPageProps {
  onBack?: () => void;
  className?: string;
}

export const LoyaltyPage: React.FC<LoyaltyPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();

  const handleRedeemReward = (rewardId: string): void => {
    console.log("Redeem:", rewardId);
    alert("Recompensa canjeada");
  };

  if (!state.loyaltyProgram) {
    return (
      <div className={className}>
        <PageHeader
          title="Programa de Lealtad"
          subtitle="Acumula y canjea"
          onBack={onBack}
        />
        <LoyaltyEmptyState />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Programa de Lealtad"
        subtitle={`${state.loyaltyProgram.points.toLocaleString()} puntos`}
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              globalThis.location.href = "/productos";
            }}
            className="hidden sm:flex font-bold"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Comprar
          </Button>
        }
      />

      <LoyaltyHero loyaltyProgram={state.loyaltyProgram} />
      <LoyaltyBenefits loyaltyProgram={state.loyaltyProgram} />
      <LoyaltyRewards
        userPoints={state.loyaltyProgram.points}
        onRedeem={handleRedeemReward}
      />
      <LoyaltyHowItWorks />
      <LoyaltyHistory />
    </div>
  );
};

LoyaltyPage.displayName = "LoyaltyPage";

export default LoyaltyPage;
