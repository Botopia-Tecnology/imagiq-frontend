/**
 * @module LoyaltyEmptyState
 * @description Empty state when user is not enrolled in loyalty program
 */

import React from "react";
import { Star } from "lucide-react";
import Button from "@/components/Button";

export const LoyaltyEmptyState: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="max-w-lg text-center">
      <div className="w-24 h-24 mx-auto mb-8 bg-black rounded-full flex items-center justify-center">
        <Star className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Únete al Programa</h2>
      <p className="text-gray-600 text-lg mb-10">
        Acumula puntos con cada compra y disfruta de beneficios exclusivos
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          globalThis.location.href = "/productos";
        }}
        className="font-bold px-12"
      >
        Comenzar
      </Button>
    </div>
  </div>
);

LoyaltyEmptyState.displayName = "LoyaltyEmptyState";

export default LoyaltyEmptyState;
