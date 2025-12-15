"use client";
import Step3 from "../Step3";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step3Page() {
  const router = useRouter();
  const [loggedUser] = useSecureStorage<User | null>("imagiq_user", null);
  const [isChecking, setIsChecking] = useState(true);

  // Protección: Solo permitir acceso si hay usuario logueado (invitado o regular con token)
  useEffect(() => {
    const token = localStorage.getItem("imagiq_token");
    const userInfo = localStorage.getItem("imagiq_user");

    // Si no hay token O no hay usuario, redirigir a step2
    if (!token && !userInfo) {
      console.warn("⚠️ [STEP3] Acceso denegado: No hay sesión activa. Redirigiendo a step2...");
      router.push("/carrito/step2");
      return;
    }

    // Si hay usuario pero no es invitado ni tiene token, redirigir
    if (!token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        // Si no tiene rol 3 (invitado) y no tiene token, algo está mal
        if (user.rol !== 3) {
          console.warn("⚠️ [STEP3] Acceso denegado: Usuario sin token. Redirigiendo a step2...");
          router.push("/carrito/step2");
          return;
        }
      } catch (err) {
        console.error("Error al parsear usuario:", err);
        router.push("/carrito/step2");
        return;
      }
    }

    // Todo OK, permitir acceso
    setIsChecking(false);
  }, [router]);

  const handleBack = () => router.push("/carrito/step1");
  const handleNext = () => router.push("/carrito/step4");

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <Step3 onBack={handleBack} onContinue={handleNext} />;
}
