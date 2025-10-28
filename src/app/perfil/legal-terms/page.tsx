"use client";

import LegalPage from "@/features/profile/components/pages/LegalPage";
import { useRouter } from "next/navigation";

export default function LegalTermsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <LegalPage documentType="terms" onBack={handleBack} />;
}
