/**
 * Componente de input de contraseña con validación interactiva
 * - Validación visual en tiempo real de requisitos
 * - Toggle de visibilidad de contraseña
 * - Campo de confirmación de contraseña
 * - Indicadores visuales atractivos
 */

"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordInputProps {
  password: string;
  confirmPassword: string;
  onChange: (data: { password: string; confirmPassword: string }) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'minLength',
    label: 'Mínimo 8 caracteres',
    test: (pwd) => pwd.length >= 8
  },
  {
    id: 'uppercase',
    label: 'Una mayúscula (A-Z)',
    test: (pwd) => /[A-Z]/.test(pwd)
  },
  {
    id: 'lowercase',
    label: 'Una minúscula (a-z)',
    test: (pwd) => /[a-z]/.test(pwd)
  },
  {
    id: 'number',
    label: 'Un número (0-9)',
    test: (pwd) => /\d/.test(pwd)
  },
  {
    id: 'special',
    label: 'Un carácter especial (!@#$%^&*)',
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  }
];

export default function PasswordInput({
  password,
  confirmPassword,
  onChange,
  errors,
  disabled = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handlePasswordChange = (newPassword: string) => {
    onChange({ password: newPassword, confirmPassword });
  };

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    onChange({ password, confirmPassword: newConfirmPassword });
  };

  const getRequirementStatus = (requirement: PasswordRequirement) => {
    if (!password) return 'inactive';
    return requirement.test(password) ? 'valid' : 'invalid';
  };

  const isPasswordValid = PASSWORD_REQUIREMENTS.every(req => req.test(password));
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const getStrengthColor = () => {
    const validCount = PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;
    if (validCount === 0) return 'bg-gray-200';
    if (validCount <= 2) return 'bg-red-400';
    if (validCount <= 3) return 'bg-yellow-400';
    if (validCount <= 4) return 'bg-blue-400';
    return 'bg-green-500';
  };

  const getStrengthWidth = () => {
    const validCount = PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;
    return `${(validCount / PASSWORD_REQUIREMENTS.length) * 100}%`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Campo de contraseña principal */}
      <div className="space-y-2 sm:space-y-3">
        <label className="block text-sm sm:text-base font-semibold text-[#002142] tracking-tight">
          Crear contraseña
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            placeholder="Ingresa tu contraseña"
            disabled={disabled}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 rounded-lg text-sm sm:text-base text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm ${
              errors.password ? "border-red-400" :
              password && isPasswordValid ? "border-green-400" : "border-[#e5e5e5]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a6a] hover:text-[#002142] transition-colors"
            disabled={disabled}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Barra de fortaleza */}
        {password && (
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#4a5a6a] font-medium">Fortaleza de la contraseña</span>
              <span className={`text-xs font-medium ${
                isPasswordValid ? 'text-green-600' : 'text-amber-600'
              }`}>
                {isPasswordValid ? 'Fuerte' : 'Débil'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: getStrengthWidth() }}
              />
            </div>
          </div>
        )}

        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>

      {/* Requisitos de contraseña */}
      {(password || focusedField === 'password') && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 animate-fade-in">
          <h4 className="text-xs sm:text-sm font-semibold text-[#002142] mb-1 sm:mb-2">
            Requisitos de contraseña:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const status = getRequirementStatus(requirement);
              return (
                <div
                  key={requirement.id}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs transition-all duration-200 ${
                    status === 'valid' ? 'text-green-600' :
                    status === 'invalid' ? 'text-red-500' : 'text-[#4a5a6a]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    status === 'valid' ? 'bg-green-100' :
                    status === 'invalid' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {status === 'valid' ? (
                      <Check className="w-3 h-3" />
                    ) : status === 'invalid' ? (
                      <X className="w-3 h-3" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{requirement.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campo de confirmación de contraseña */}
      {password && isPasswordValid && (
        <div className="space-y-3 animate-fade-in">
          <label className="block text-base font-semibold text-[#002142] tracking-tight">
            Confirmar contraseña
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              placeholder="Confirma tu contraseña"
              disabled={disabled}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                errors.confirmPassword ? "border-red-400" :
                confirmPassword && passwordsMatch ? "border-green-400" :
                confirmPassword && !passwordsMatch ? "border-red-400" : "border-[#e5e5e5]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a6a] hover:text-[#002142] transition-colors"
              disabled={disabled}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Indicador de coincidencia */}
          {confirmPassword && (
            <div className={`flex items-center gap-2 text-xs ${
              passwordsMatch ? 'text-green-600' : 'text-red-500'
            }`}>
              {passwordsMatch ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Las contraseñas coinciden</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  <span className="font-medium">Las contraseñas no coinciden</span>
                </>
              )}
            </div>
          )}

          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
        </div>
      )}

    </div>
  );
}