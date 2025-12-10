"use client";

import { useState } from "react";
import { Loader, Eye, EyeOff, Check, X } from "lucide-react";
import {
  validatePasswordStrength,
  type PasswordStrengthResult,
} from "../utils/passwordValidation";

interface ResetPasswordStepProps {
  token: string;
  email: string;
  onPasswordReset: (password: string, token: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onSuccess?: () => void;
}

export default function ResetPasswordStep({
  token,
  email,
  onPasswordReset,
  isLoading = false,
  error,
  onSuccess,
}: ResetPasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrengthResult | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(validatePasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!password.trim()) {
      setFormError("Por favor ingresa una nueva contraseña");
      return;
    }

    if (!confirmPassword.trim()) {
      setFormError("Por favor confirma tu contraseña");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }

    if (!passwordStrength?.isValid) {
      setFormError("La contraseña no cumple con los requisitos mínimos");
      return;
    }

    try {
      await onPasswordReset(password, token);
      onSuccess?.();
    } catch (err) {
      setFormError(
        (err as Error).message || "Error al actualizar la contraseña"
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-black">
            Establecer nueva contraseña
          </h2>
          <p className="text-sm text-gray-600">
            Para la cuenta{" "}
            <span className="font-semibold text-black">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-2"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-black transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && passwordStrength && (
            <div className="space-y-2">
              <div className="space-y-1">
                <StrengthRequirement
                  met={passwordStrength.minLength}
                  label="Mínimo 8 caracteres"
                />
                <StrengthRequirement
                  met={passwordStrength.hasUppercase}
                  label="Al menos una letra mayúscula"
                />
                <StrengthRequirement
                  met={passwordStrength.hasLowercase}
                  label="Al menos una letra minúscula"
                />
                <StrengthRequirement
                  met={passwordStrength.hasNumber}
                  label="Al menos un número"
                />
                <StrengthRequirement
                  met={passwordStrength.hasSpecialChar}
                  label="Al menos un carácter especial (!@#$%^&*)"
                />
              </div>

              {/* Strength Bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength.isValid
                      ? "bg-green-500 w-full"
                      : `bg-red-500 w-${Math.floor(
                          (Object.values(passwordStrength).filter(
                            (v) => typeof v === "boolean" && v
                          ).length /
                            5) *
                            100
                        )}`
                  }`}
                  style={{
                    width: `${Math.floor(
                      (Object.values(passwordStrength).filter(
                        (v) => typeof v === "boolean" && v
                      ).length /
                        5) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-black mb-2"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-black transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Match Indicator */}
          {confirmPassword && (
            <div className="flex items-center gap-2">
              {password === confirmPassword ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600">
                    Las contraseñas coinciden
                  </span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-600">
                    Las contraseñas no coinciden
                  </span>
                </>
              )}
            </div>
          )}

          {/* Error Messages */}
          {(formError || error) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{formError || error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading ||
              !password.trim() ||
              !confirmPassword.trim() ||
              !passwordStrength?.isValid
            }
            className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Establecer contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar requisitos de contraseña
function StrengthRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600">{label}</span>
        </>
      ) : (
        <>
          <X className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600">{label}</span>
        </>
      )}
    </div>
  );
}
