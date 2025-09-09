"use client";

import { useEffect } from "react";
import Step1 from "../Step1";
import { useRouter } from "next/navigation";

import { useRef } from "react";

export default function Step1Page() {
  const router = useRouter();
  const handleNext = useRef(() => router.push("/carrito/step2"));

  useEffect(() => {
    const hasData = JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("imagiq_user") || "{}"
        : "{}"
    );
    if (hasData.email && hasData.nombre) {
      handleNext.current = () => router.push("/carrito/step3");
    } else {
      handleNext.current = () => router.push("/carrito/step2");
    }
  }, [router]);

  return <Step1 onContinue={handleNext.current} />;
}
