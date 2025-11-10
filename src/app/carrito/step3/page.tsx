"use client";
import Step3 from "../Step3";
import { useRouter } from "next/navigation";

export default function Step3Page() {
  const router = useRouter();
  const handleBack = () => router.push("/carrito/step1");
  const handleNext = () => router.push("/carrito/step4");
  return <Step3 onBack={handleBack} onContinue={handleNext} />;
}
