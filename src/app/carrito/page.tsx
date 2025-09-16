"use client";
/**
 * Página principal del carrito y checkout
 * Renderiza el paso 1 del carrito (productos y resumen)
 * Código limpio, escalable y documentado
 */

import React, { useState } from "react";
import { useDeviceType } from "@/components/responsive";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

/**
 * Página principal del carrito y checkout
 * Controla la navegación entre pasos del proceso de compra
 */
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const device = useDeviceType();

  const handleNext = () => {
    setStep((prev) => {
      const nextStep = prev + 1;
      console.log(
        "CheckoutPage: handleNext called, advancing from step",
        prev,
        "to",
        nextStep,
        "device:", device
      );
      return nextStep;
    });
  };
  const handleBack = () => setStep((prev) => prev - 1);

  // Ejemplo de layout responsive global
  return (
    <div
      className={
        device === "mobile"
          ? "bg-white min-h-screen px-2 py-2"
          : device === "tablet"
          ? "bg-white min-h-screen px-4 py-4"
          : "bg-white min-h-screen px-0 py-0"
      }
    >
      {step === 1 && <Step1 onContinue={handleNext} />}
      {step === 2 && <Step2 onBack={handleBack} onContinue={handleNext} />}
      {step === 3 && <Step3 onBack={handleBack} onContinue={handleNext} />}
      {step === 4 && <Step4 onBack={handleBack} />}
    </div>
  );
}