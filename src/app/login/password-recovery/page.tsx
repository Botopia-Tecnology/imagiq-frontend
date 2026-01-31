"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmailStep from "./components/EmailStep";
import TokenStep from "./components/TokenStep";
import ResetPasswordStep from "./components/ResetPasswordStep";
import { apiPost } from "@/lib/api-client";

type RecoveryStep = "email" | "token" | "password" | "success";

export default function PasswordRecoveryPage() {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Solicitar email
  const handleEmailSubmit = async (submittedEmail: string) => {
    setIsLoading(true);
    setError("");

    try {
      await apiPost<{ message: string }>("/api/auth/forgot-password", {
        email: submittedEmail,
      });

      setEmail(submittedEmail);
      setStep("token");
    } catch (err) {
      setError((err as Error).message || "Error al enviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validar token
  const handleTokenSubmit = async (submittedToken: string) => {
    setIsLoading(true);
    setError("");

    try {
      await apiPost<{ message: string }>("/api/auth/validate-token", {
        token: submittedToken,
      });

      setToken(submittedToken);
      setStep("password");
    } catch (err) {
      setError((err as Error).message || "Token inválido o expirado");
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar token
  const handleResendToken = async () => {
    setIsResending(true);
    setError("");

    try {
      await apiPost<{ message: string }>("/api/auth/resend-token", {
        email,
      });
    } catch (err) {
      setError((err as Error).message || "Error al reenviar el código");
    } finally {
      setIsResending(false);
    }
  };

  // Step 3: Restablecer contraseña
  const handlePasswordReset = async (password: string) => {
    setIsLoading(true);
    setError("");

    try {
      await apiPost<{ message: string }>("/api/auth/reset-password", {
        email,
        nuevaContrasena: password,
      });

      setStep("success");
    } catch (err) {
      setError((err as Error).message || "Error al restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Volver a email
  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    setToken("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-start justify-center pt-24 pb-12 px-4">
      <div className="w-full">
        {step === "email" && (
          <EmailStep
            onEmailSubmit={handleEmailSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}

        {step === "token" && (
          <TokenStep
            email={email}
            onTokenSubmit={handleTokenSubmit}
            onResendToken={handleResendToken}
            onBackToEmail={handleBackToEmail}
            isLoading={isLoading}
            isResending={isResending}
            error={error}
          />
        )}

        {step === "password" && (
          <ResetPasswordStep
            token={token}
            email={email}
            onPasswordReset={handlePasswordReset}
            isLoading={isLoading}
            error={error}
            onSuccess={() => setStep("success")}
          />
        )}

        {step === "success" && (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-black">
                  ¡Contraseña actualizada!
                </h2>
                <p className="text-sm text-gray-600">
                  Tu contraseña ha sido restablecida correctamente. Ahora puedes
                  iniciar sesión con tu nueva contraseña.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
