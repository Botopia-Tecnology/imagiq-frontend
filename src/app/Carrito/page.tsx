"use client";
/**
 * Página principal del carrito y checkout
 * Renderiza el paso 1 del carrito (productos y resumen)
 * Código limpio, escalable y documentado
 */

import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "../carrito/Step2";
import Step3 from "../carrito/Step3";
import Step4 from "../carrito/Step4";

/**
 * Página principal del carrito y checkout
 * Controla la navegación entre pasos del proceso de compra
 */
export default function CheckoutPage() {
  // Estado para el paso actual
  const [step, setStep] = useState(1);

  // Handler para avanzar al siguiente paso
  const handleNext = () => {
    setStep((prev) => {
      const nextStep = prev + 1;
      console.log(
        "CheckoutPage: handleNext called, advancing from step",
        prev,
        "to",
        nextStep
      );
      return nextStep;
    });
  };
  // Handler para volver al paso anterior
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <>
      {step === 1 && <Step1 onContinue={handleNext} />}
      {step === 2 && <Step2 onBack={handleBack} onContinue={handleNext} />}
      {step === 3 && <Step3 onBack={handleBack} onContinue={handleNext} />}
      {step === 4 && <Step4 onBack={handleBack} />}
    </>
  );
}
