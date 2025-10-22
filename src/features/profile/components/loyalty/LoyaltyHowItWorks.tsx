/**
 * @module LoyaltyHowItWorks
 * @description How the loyalty program works section
 */

import React from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { number: '01', title: 'Compra', description: 'Acumula puntos con cada compra en nuestra tienda' },
  { number: '02', title: 'Acumula', description: 'Sube de nivel y desbloquea beneficios exclusivos' },
  { number: '03', title: 'Canjea', description: 'Usa tus puntos en descuentos y productos' }
];

export const LoyaltyHowItWorks: React.FC = () => {
  return (
    <div className="bg-white py-16 md:py-24 border-t-2 border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">¿Cómo Funciona?</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step) => (
            <div key={step.number}>
              <div className="text-7xl font-bold text-gray-100 mb-6">{step.number}</div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

LoyaltyHowItWorks.displayName = 'LoyaltyHowItWorks';

export default LoyaltyHowItWorks;
