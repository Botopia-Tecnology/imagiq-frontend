"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { Loader, RotateCcw } from "lucide-react";

interface TokenStepProps {
  email: string;
  onTokenSubmit: (token: string) => Promise<void>;
  onResendToken: () => Promise<void>;
  onBackToEmail: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
}

export default function TokenStep({
  email,
  onTokenSubmit,
  onResendToken,
  onBackToEmail,
  isLoading = false,
  isResending = false,
  error,
}: TokenStepProps) {
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Timer para reenvío de token
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [resendCountdown, canResend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError("");

    if (!token.trim()) {
      setTokenError("Por favor ingresa el código de verificación");
      return;
    }

    if (token.length < 6) {
      setTokenError("El código debe tener al menos 6 caracteres");
      return;
    }

    try {
      await onTokenSubmit(token);
    } catch (err) {
      setTokenError((err as Error).message || "Código inválido o expirado");
    }
  };

  const handleResend = async () => {
    try {
      setCanResend(false);
      setResendCountdown(60); // 60 segundos de espera
      await onResendToken();
    } catch (err) {
      setTokenError((err as Error).message || "Error al reenviar el código");
      setCanResend(true);
      setResendCountdown(0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-black">
            Verifica tu identidad
          </h2>
          <p className="text-sm text-gray-600">
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold text-black">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-black mb-2"
            >
              Código de verificación
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value.toUpperCase());
                setTokenError("");
              }}
              placeholder="Ej: ABC123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400 font-mono text-center text-lg letter-spacing"
              disabled={isLoading}
              maxLength={10}
            />
          </div>

          {/* Error Messages */}
          {(tokenError || error) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{tokenError || error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !token.trim()}
            className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar código"
            )}
          </Button>
        </form>

        {/* Resend Section */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 text-center">
            ¿No recibiste el código?
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || isResending}
            className="w-full border border-black text-black py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Reenviando...
              </>
            ) : canResend ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Reenviar código
              </>
            ) : (
              `Reenviar en ${resendCountdown}s`
            )}
          </button>
        </div>

        {/* Back Button */}
        <Button
          onClick={onBackToEmail}
          disabled={isLoading || isResending}
          className="w-full text-black text-sm font-medium py-2 px-4 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Usar otro correo
        </Button>
      </div>
    </div>
  );
}
