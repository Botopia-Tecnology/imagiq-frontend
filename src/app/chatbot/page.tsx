"use client";
import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";

export default function ChatbotStepsPage() {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      {step === 1 && <Step1 onContinue={handleNext} />}
      {step === 2 && <Step2 onContinue={handleNext} />}
      {step === 3 && <Step3 onContinue={handleNext} />}
      {step === 4 && <Step4 />}
    </>
  );
}