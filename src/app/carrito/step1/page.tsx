"use client";

import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Step1 from "../Step1";

export default function Step1Page() {
  const router = useRouter();
  const [loggedUser, _setLoggedUser] = useSecureStorage<User | null>(
    "imagiq_user",
    null
  );

  const handleNext = () => {
    if (loggedUser?.email) {
      router.push("/carrito/step3");
    } else {
      router.push("/carrito/step2");
    }
  };

  return <Step1 onContinue={handleNext} />;
}
