"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { notifyRegisterSuccess, notifyError } from "../notifications";
import { Usuario } from "@/types/user";
import { StepIndicator } from "./components/StepIndicator";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { OTPStep } from "./components/OTPStep";
import { AddressStep } from "./components/AddressStep";
import { PaymentStep } from "./components/PaymentStep";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const STEPS = [
  { id: 1, name: "Información personal", required: true },
  { id: 2, name: "Verificación", required: true },
  { id: 3, name: "Dirección de envío", required: false },
  { id: 4, name: "Método de pago", required: false },
];

export default function CreateAccountPage() {
  const router = useRouter();
  const { login } = useAuthContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    codigo_pais: "57", // Colombia por defecto (sin el +)
    tipo_documento: "CC",
    numero_documento: "",
    fecha_nacimiento: "",
    contrasena: "",
    confirmPassword: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const validateStep1 = () => {
    if (!formData.nombre || !formData.apellido) {
      setError("Nombre y apellido son obligatorios");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Correo electrónico inválido");
      return false;
    }
    if (!formData.telefono || formData.telefono.length < 10) {
      setError("Teléfono inválido");
      return false;
    }
    if (!formData.numero_documento) {
      setError("Número de documento es obligatorio");
      return false;
    }
    if (!formData.fecha_nacimiento) {
      setError("Fecha de nacimiento es obligatoria");
      return false;
    }
    if (!formData.contrasena || formData.contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (formData.contrasena !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/send-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefono: formData.telefono,
          metodo: "whatsapp",
        }),
      });

      if (!response || typeof response.status !== "number") {
        throw new Error("No se pudo conectar con el servidor");
      }

      const result = await response.json() as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Error al enviar código");
      }

      setOtpSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al enviar código de verificación";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const validateOTP = () => {
    if (!otpCode || otpCode.length !== 6) {
      setError("Código de verificación inválido");
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    setError("");

    if (currentStep === 1) {
      if (!validateStep1()) return;

      // Crear usuario sin verificar antes de pasar al step 2
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register-unverified`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            nombre: formData.nombre,
            apellido: formData.apellido,
            contrasena: formData.contrasena,
            fecha_nacimiento: formData.fecha_nacimiento,
            telefono: formData.telefono,
            codigo_pais: formData.codigo_pais,
            tipo_documento: formData.tipo_documento,
            numero_documento: formData.numero_documento,
          }),
        });

        if (!response || typeof response.status !== "number") {
          throw new Error("No se pudo conectar con el servidor");
        }

        const result = await response.json() as { message?: string; userId?: string };

        if (!response.ok) {
          throw new Error(result.message || "Error al crear el usuario");
        }

        setCurrentStep(2);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al crear usuario";
        setError(msg);
        await notifyError(msg, "Registro fallido");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      if (!otpSent) {
        setError("Debes enviar el código de verificación primero");
        return;
      }
      if (!validateOTP()) return;

      // Verificar OTP con el backend y completar registro
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/otp/verify-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telefono: formData.telefono,
            codigo: otpCode,
          }),
        });

        if (!response || typeof response.status !== "number") {
          throw new Error("No se pudo conectar con el servidor");
        }

        const result = await response.json() as {
          access_token: string;
          user: Usuario;
          message?: string;
        };

        if (!response.ok) {
          throw new Error(result.message || "Código OTP inválido");
        }

        // Guardar token y usuario - registro completado
        if (result.access_token && result.user) {
          localStorage.setItem("imagiq_token", result.access_token);
          localStorage.setItem("imagiq_user", JSON.stringify(result.user));

          await login({
            id: result.user.id,
            email: result.user.email,
            nombre: result.user.nombre,
            apellido: result.user.apellido,
            numero_documento: result.user.numero_documento,
            telefono: result.user.telefono,
          });
        }

        await notifyRegisterSuccess(formData.email);

        // Opcional: ir a paso 3 para dirección o saltar directo
        setCurrentStep(3);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al verificar código";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 3) {
      // Paso 3: dirección - solo avanzar o ir a home
      router.push("/");
    } else if (currentStep === 4) {
      // Paso 4: pago - ir a home
      router.push("/");
    }
  };

  const handleSkipStep = () => {
    // Los pasos 3 y 4 son opcionales, ir directo a home
    router.push("/");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
            disabled={isLoading}
          />
        );
      case 2:
        return (
          <OTPStep
            email={formData.email}
            otpCode={otpCode}
            otpSent={otpSent}
            onOTPChange={setOtpCode}
            onSendOTP={handleSendOTP}
            disabled={isLoading}
          />
        );
      case 3:
        return <AddressStep />;
      case 4:
        return <PaymentStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4 pt-6">
      <div className="w-full max-w-5xl">
        {/* Mobile: Indicador arriba */}
        <div className="md:hidden mb-6">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Desktop: Indicador a la izquierda + Contenido a la derecha */}
        <div className="flex gap-8">
          {/* Indicador vertical y login prompt en desktop */}
          <div className="hidden md:flex md:flex-col flex-shrink-0 pt-2" style={{ width: '300px' }}>
            {/* Términos y condiciones - Fijo arriba */}
            <div className="text-xs text-gray-500 mb-8">
              <p>
                Al continuar, aceptas los{" "}
                <a href="#" className="underline hover:text-gray-900">
                  Términos de uso
                </a>{" "}
                y la{" "}
                <a href="#" className="underline hover:text-gray-900">
                  Política de privacidad
                </a>
              </p>
            </div>

            <StepIndicator steps={STEPS} currentStep={currentStep} />

            {/* Espaciador flexible */}
            <div className="flex-grow" />

            {/* Login prompt - Alineado al final */}
            <div className="space-y-4 pb-6">
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-500 whitespace-nowrap">
                  ¿Ya tienes cuenta?
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              {renderStepContent()}

              {error && (
                <div className="text-sm text-red-600 text-center bg-red-50 py-2 px-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                )}
                {/* En step 2: mostrar "Enviar código" si no se ha enviado, o "Continuar" si ya se envió */}
                {currentStep === 2 && !otpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    {isLoading ? "Enviando..." : "Enviar código"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    {isLoading
                      ? "Procesando..."
                      : currentStep === 4
                      ? "Finalizar"
                      : "Continuar"}
                  </Button>
                )}
                {!STEPS[currentStep - 1].required && (
                  <Button type="button" variant="ghost" onClick={handleSkipStep} disabled={isLoading}>
                    Omitir
                  </Button>
                )}
              </div>
            </div>

            {/* Login prompt - Mobile only */}
            <div className="md:hidden text-center space-y-4">
              <div className="text-xs text-gray-500">
                <p>
                  Al continuar, aceptas los{" "}
                  <a href="#" className="underline hover:text-gray-900">
                    Términos de uso
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="underline hover:text-gray-900">
                    Política de privacidad
                  </a>
                </p>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-500">
                  ¿Ya tienes cuenta?
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
