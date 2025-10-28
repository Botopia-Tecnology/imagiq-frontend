"use client";

import SamsungPrivacyPage from "@/features/profile/components/legal/SamsungPrivacyPage";
import { useRouter } from "next/navigation";

export default function LegalPrivacyPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <SamsungPrivacyPage onBack={handleBack} />;
}
