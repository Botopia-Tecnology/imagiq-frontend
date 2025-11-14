"use client";
import Step4 from "../Step4";
import { useRouter } from "next/navigation";

export default function Step4Page() {
  const router = useRouter();
  const handleBack = () => router.push("/carrito/step3");
  const handleNext = () => router.push("/carrito/step5");
  return <Step4 onBack={handleBack} onContinue={handleNext} />;
}
