"use client";
import Step6 from "../Step6";
import { useRouter } from "next/navigation";

export default function Step6Page() {
  const router = useRouter();
  const handleBack = () => router.push("/carrito/step5");
  const handleNext = () => router.push("/carrito/step7");
  return <Step6 onBack={handleBack} onContinue={handleNext} />;
}
