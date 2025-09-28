/**
 * Tipos TypeScript para extensiones del proceso de registro
 * - Extiende tipos existentes de Usuario sin duplicar campos
 * - Tipos específicos para componentes de registro
 * - Interfaces para validación y pasos del formulario
 */

import { Usuario, UserAddress } from './user';

// Datos del país para selector de teléfono
export interface Country {
  code: string;         // ISO 3166-1 alpha-2 (ej: "CO", "US")
  name: string;         // Nombre del país
  dialCode: string;     // Código telefónico (ej: "+57", "+1")
  flag: string;         // Emoji de bandera
}

// Tipos de documento disponibles
export interface DocumentType {
  code: string;         // Código interno (ej: "CC", "CE", "PP")
  name: string;         // Nombre del tipo
  country: string;      // País específico donde aplica
  maxLength: number;    // Longitud máxima del documento
  pattern?: RegExp;     // Patrón de validación opcional
}

// Canales de verificación OTP
export interface VerificationChannel {
  type: 'whatsapp' | 'sms' | 'email';
  label: string;
  icon: string;         // Nombre del ícono
  description: string;  // Descripción del canal
}

// Extensión de UserAddress para el formulario de registro
export interface RegistrationAddress extends Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  // Reutiliza UserAddress pero sin campos de BD
}

// Datos del formulario de registro - extiende Usuario existente
export interface RegistrationFormData extends Pick<Usuario, 'email' | 'nombre' | 'apellido' | 'contrasena' | 'telefono' | 'codigo_pais' | 'tipo_documento' | 'numero_documento'> {
  // Campos existentes de Usuario ya incluidos por Pick

  // Campos adicionales específicos del registro
  fecha_nacimiento?: string;
  confirmPassword?: string; // Campo para confirmar contraseña

  // Direcciones: envío y facturación separadas
  shippingAddress: RegistrationAddress;
  billingAddress?: RegistrationAddress;   // Opcional si useSameForBilling es true
  useSameForBilling: boolean;

  // Verificación OTP
  preferredVerificationChannel: VerificationChannel['type'];
  verificationCode?: string;
  isVerified: boolean;
}

// Configuración de pasos del formulario
export interface RegistrationStep {
  id: string;
  name: string;
  title: string;
  description?: string;
  validation: (data: Partial<RegistrationFormData>) => ValidationResult;
}

// Props comunes para componentes de pasos
export interface RegistrationStepProps {
  data: Partial<RegistrationFormData>;
  onChange: (data: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

// Resultado de validación
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Configuración de campo de formulario genérico
export interface FormFieldConfig {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  validate?: (value: string) => string | undefined;
  options?: Array<{ value: string; label: string; }>;
}