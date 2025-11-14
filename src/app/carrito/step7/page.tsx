"use client";
import Step7 from "../Step7";
import { useRouter } from "next/navigation";

export default function Step7Page() {
  const router = useRouter();
  const handleBack = () => router.push("/carrito/step6");

  return <Step7 onBack={handleBack} />;
}
