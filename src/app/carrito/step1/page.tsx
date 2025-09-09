"use client";

import Step1 from "../Step1";
import { useRouter } from "next/navigation";

export default function Step1Page() {
  const router = useRouter();
  const handleNext = () => router.push("/carrito/step2");
  return <Step1 onContinue={handleNext} />;
}

