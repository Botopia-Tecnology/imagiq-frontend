"use client";

import Step1 from "../Step1";
import { useRouter } from "next/navigation";

export default function Step1Page() {
  const router = useRouter();

  const handleNext = () => {
    const hasData = JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("imagiq_user") || "{}"
        : "{}"
    );
    if (hasData !== undefined) {
      router.push("/carrito/step3");
    } else {
      router.push("/carrito/step2");
    }
  };

  return <Step1 onContinue={handleNext} />;
}
