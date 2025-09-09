"use client";
import { useRouter } from "next/navigation";
import Step2 from "../Step2";

export default function Step2Page() {
  const router = useRouter();
  const handleBack = () => router.push("/carrito/step1");
  const handleNext = () => router.push("/carrito/step3");

  return <Step2 onBack={handleBack} onContinue={handleNext} />;
}
