/**
 * Utilidades para validación de contraseñas
 */

export interface PasswordStrengthResult {
  isValid: boolean;
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errors: string[];
}

/**
 * Valida la fortaleza de la contraseña
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 carácter especial
 */
export function validatePasswordStrength(
  password: string
): PasswordStrengthResult {
  const errors: string[] = [];

  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!minLength) errors.push("La contraseña debe tener al menos 8 caracteres");
  if (!hasUppercase) errors.push("Debe contener al menos una letra mayúscula");
  if (!hasLowercase) errors.push("Debe contener al menos una letra minúscula");
  if (!hasNumber) errors.push("Debe contener al menos un número");
  if (!hasSpecialChar)
    errors.push("Debe contener al menos un carácter especial (!@#$%^&*)");

  return {
    isValid:
      minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    errors,
  };
}
