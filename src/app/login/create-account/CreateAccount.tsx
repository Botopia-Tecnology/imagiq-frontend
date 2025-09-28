"use client";

import { useState } from "react";
import { notifyRegisterSuccess, notifyError } from "../notifications";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { Usuario } from "@/types/user";
import { RegistrationFormData, RegistrationAddress } from "@/types/registration";
import PhoneSelector from "@/components/forms/PhoneSelector";
import DocumentSelector from "@/components/forms/DocumentSelector";
import AddressForm from "@/components/forms/AddressForm";
import VerificationStep from "@/components/forms/VerificationStep";
import PasswordInput from "@/components/forms/PasswordInput";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Mejoras visuales y UX para el formulario multi-step
// - Animaciones de transición entre pasos
// - Inputs con feedback visual
// - Botones con efectos y estados
// - Mensajes de error y éxito destacados
// - Layout más atractivo y profesional
const CreateAccountForm = () => {
  const router = useRouter();
  // Importar el contexto de autenticación

  const { login } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [step, setStep] = useState(0);

  // Estado extendido del formulario
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    email: "",
    nombre: "",
    apellido: "",
    contrasena: "",
    confirmPassword: "",
    fecha_nacimiento: "",
    telefono: "",
    codigo_pais: "CO",
    tipo_documento: "CC",
    numero_documento: "",
    shippingAddress: {
      type: 'home',
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Colombia',
      isDefault: true
    },
    useSameForBilling: true,
    preferredVerificationChannel: 'whatsapp',
    isVerified: false
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Definición de los pasos del formulario extendido
  const stepConfigs = [
    { id: 'email', name: 'Correo', title: 'Correo electrónico' },
    { id: 'basic', name: 'Información básica', title: 'Datos personales' },
    { id: 'contact', name: 'Contacto', title: 'Teléfono y documento' },
    { id: 'address', name: 'Direcciones', title: 'Información de envío' },
    { id: 'password', name: 'Contraseña', title: 'Crear contraseña' },
    { id: 'verification', name: 'Verificación', title: 'Verificar información' }
  ];

  const currentStep = stepConfigs[step];

  // Validación por paso
  const validateCurrentStep = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (currentStep.id) {
      case 'email':
        if (!formData.email) errors.email = 'El correo es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Formato de correo inválido';
        }
        break;

      case 'basic':
        if (!formData.nombre) errors.nombre = 'El nombre es requerido';
        if (!formData.apellido) errors.apellido = 'El apellido es requerido';
        break;

      case 'contact':
        if (!formData.telefono) errors.telefono = 'El teléfono es requerido';
        if (!formData.numero_documento) errors.numero_documento = 'El documento es requerido';
        break;

      case 'address':
        if (!formData.shippingAddress?.addressLine1) {
          errors.shippingAddressLine1 = 'La dirección es requerida';
        }
        if (!formData.shippingAddress?.city) errors.shippingCity = 'La ciudad es requerida';
        if (!formData.shippingAddress?.state) errors.shippingState = 'El departamento es requerido';
        if (!formData.shippingAddress?.zipCode) errors.shippingZipCode = 'El código postal es requerido';
        break;

      case 'password':
        // Validación de contraseña con requisitos robustos
        if (!formData.contrasena) {
          errors.contrasena = 'La contraseña es requerida';
        } else {
          const password = formData.contrasena;
          if (password.length < 8) errors.contrasena = 'Mínimo 8 caracteres';
          else if (!/[A-Z]/.test(password)) errors.contrasena = 'Debe contener una mayúscula';
          else if (!/[a-z]/.test(password)) errors.contrasena = 'Debe contener una minúscula';
          else if (!/\d/.test(password)) errors.contrasena = 'Debe contener un número';
          else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.contrasena = 'Debe contener un carácter especial';
          }
        }

        // Validación de confirmación de contraseña
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.contrasena !== formData.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
        break;

      case 'verification':
        if (!formData.isVerified) {
          errors.verification = 'Debes verificar tu información para continuar';
        }
        break;
    }

    return errors;
  };

  // Actualizar datos del formulario
  const updateFormData = (updates: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setFieldErrors({});
  };

  // Mock para envío de código OTP
  const handleSendVerificationCode = async (channel: 'whatsapp' | 'sms' | 'email') => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
    console.log(`Código enviado por ${channel}`);
  };

  const next = () => {
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep((s) => Math.min(s + 1, stepConfigs.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setShowModal(false);
    setModalContent(null);
    setSubmitting(true);
    try {
      // Combinar teléfono con código de país
      const fullPhone = `+${formData.codigo_pais === 'CO' ? '57' : '1'}${formData.telefono}`;

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          contrasena: formData.contrasena,
          fecha_nacimiento: formData.fecha_nacimiento,
          telefono: fullPhone,
          tipo_documento: formData.tipo_documento,
          numero_documento: formData.numero_documento,
        }),
      });
      if (!response || typeof response.status !== "number") {
        const msg =
          "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
        setModalContent({ type: "error", message: msg });
        setShowModal(true);
        await notifyError(msg, "Registro fallido");
        setSubmitting(false);
        return;
      }
      const result = (await response.json()) as {
        access_token: string;
        user: Usuario;
        message?: string;
      };
      if (!response.ok) {
        let errorMsg = "Error al registrar";
        errorMsg = result.message || errorMsg;
        setModalContent({ type: "error", message: errorMsg });
        setShowModal(true);
        await notifyError(errorMsg, "Registro fallido");
        setSubmitting(false);
        return;
      }
      // Guardar token y usuario en localStorage
      if (result.access_token && result.user) {
        localStorage.setItem("imagiq_token", result.access_token);
        // Mapear el rol numérico a string
        localStorage.setItem("imagiq_user", JSON.stringify(result.user));
        // Actualizar el contexto de sesión
        await login({
          id: result.user.id,
          email: result.user.email,
          nombre: result.user.nombre,
          apellido: result.user.apellido,
          numero_documento: result.user.numero_documento,
          telefono: result.user.telefono,
        });
      }
      setModalContent({
        type: "success",
        message: `¡Cuenta creada exitosamente para ${formData.email}!`,
      });
      setShowModal(true);
      await notifyRegisterSuccess(formData.email!);
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de conexión";
      setModalContent({ type: "error", message: msg });
      setShowModal(true);
      await notifyError(msg, "Registro fallido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-center text-lg sm:text-xl lg:text-2xl font-bold mb-1.5 sm:mb-2 text-[#002142] drop-shadow-sm tracking-tight animate-fade-in">
        Crear una cuenta
      </h2>
      <p className="text-center text-xs sm:text-sm text-[#4a5a6a] mb-3 sm:mb-4 animate-fade-in">
        ¿Ya tienes una cuenta?{" "}
        <button
          className="underline text-[#003366] hover:text-[#002142] font-semibold transition-colors duration-150"
          type="button"
          onClick={() => router.push("/login")}
        >
          Inicia sesión
        </button>
      </p>
      {/* Indicador de progreso responsive */}
      <div className="flex flex-col items-center w-full mb-3 sm:mb-4 lg:mb-6 animate-fade-in">
        <div className="relative w-full flex flex-col items-center max-w-4xl">
          {/* Línea de progreso */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-[#002142]/10 via-[#e5e5e5] to-[#002142]/10 z-0" />

          {/* Círculos de pasos */}
          <div className="flex w-full justify-between items-center relative z-10 px-2 sm:px-4">
            {stepConfigs.map((_, n) => (
              <div className="flex flex-col items-center" key={n}>
                <button
                  type="button"
                  className={`rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-xs focus:outline-none transition-all duration-200 shadow-md border-2 ${
                    step === n
                      ? "bg-[#002142] text-white border-[#002142] scale-110"
                      : step > n
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-[#e5e5e5] text-[#bdbdbd] border-[#e5e5e5]"
                  }`}
                  disabled={step === n || step < n}
                  aria-label={`Ir al paso ${n + 1}`}
                >
                  {step > n ? '✓' : n + 1}
                </button>
              </div>
            ))}
          </div>

          {/* Nombres de pasos - Solo mostrar en pantallas grandes */}
          <div className="hidden lg:flex w-full justify-between items-center mt-3 px-2 sm:px-4">
            {stepConfigs.map((stepConfig, n) => (
              <div
                key={stepConfig.id}
                className={`flex-1 text-xs text-center px-1 ${
                  step === n ? "text-[#002142] font-semibold" : "text-[#bdbdbd]"
                }`}
              >
                {stepConfig.name}
              </div>
            ))}
          </div>

          {/* Nombre del paso actual - Mostrar solo en móvil y tablet */}
          <div className="lg:hidden mt-2 text-center">
            <span className="text-xs sm:text-sm text-[#002142] font-semibold">
              Paso {step + 1} de {stepConfigs.length}: {stepConfigs[step].name}
            </span>
          </div>
        </div>
      </div>
      {showModal && modalContent && (
        <div className="w-full flex items-center justify-center mt-2 animate-fade-in">
          {modalContent.type === "success" ? (
            <span className="text-green-600 text-base font-bold px-4 py-2 rounded-lg bg-green-50 border border-green-200 shadow animate-fade-in">
              {modalContent.message}
            </span>
          ) : (
            <span className="text-red-500 text-base font-bold px-4 py-2 rounded-lg bg-red-50 border border-red-200 shadow animate-fade-in">
              {modalContent.message}
            </span>
          )}
        </div>
      )}
      {/* Contenido del formulario responsive */}
      <div className="w-full max-w-lg mx-auto">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#002142] mb-2 sm:mb-3 lg:mb-4 text-center">
          {currentStep.title}
        </h3>

        {/* Renderizado condicional por paso */}
        {currentStep.id === 'email' && (
          <div className="space-y-2.5 sm:space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#002142] mb-1 sm:mb-1.5 tracking-tight">
                ¿Cuál es tu correo?
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="Ingresa tu correo electrónico"
                disabled={submitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                  fieldErrors.email ? "border-red-400" : "border-[#e5e5e5]"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>
          </div>
        )}

        {currentStep.id === 'basic' && (
          <div className="space-y-2.5 sm:space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#002142] mb-1 sm:mb-1.5 tracking-tight">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => updateFormData({ nombre: e.target.value })}
                placeholder="Ingresa tu nombre"
                disabled={submitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                  fieldErrors.nombre ? "border-red-400" : "border-[#e5e5e5]"
                }`}
              />
              {fieldErrors.nombre && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.nombre}</p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#002142] mb-1 sm:mb-1.5 tracking-tight">
                Apellido
              </label>
              <input
                type="text"
                value={formData.apellido || ''}
                onChange={(e) => updateFormData({ apellido: e.target.value })}
                placeholder="Ingresa tu apellido"
                disabled={submitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                  fieldErrors.apellido ? "border-red-400" : "border-[#e5e5e5]"
                }`}
              />
              {fieldErrors.apellido && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.apellido}</p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#002142] mb-1 sm:mb-1.5 tracking-tight">
                Fecha de nacimiento (opcional)
              </label>
              <input
                type="date"
                value={formData.fecha_nacimiento || ''}
                onChange={(e) => updateFormData({ fecha_nacimiento: e.target.value })}
                disabled={submitting}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-[#e5e5e5] rounded-lg text-xs sm:text-sm text-[#002142] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        )}

        {currentStep.id === 'contact' && (
          <div className="space-y-2.5 sm:space-y-3">
            <PhoneSelector
              value={{
                countryCode: formData.codigo_pais || 'CO',
                number: formData.telefono || ''
              }}
              onChange={(phoneData) => updateFormData({
                codigo_pais: phoneData.countryCode,
                telefono: phoneData.number
              })}
              error={fieldErrors.telefono}
              disabled={submitting}
            />
            <DocumentSelector
              value={{
                type: formData.tipo_documento || 'CC',
                number: formData.numero_documento || ''
              }}
              onChange={(docData) => updateFormData({
                tipo_documento: docData.type,
                numero_documento: docData.number
              })}
              error={fieldErrors.numero_documento}
              disabled={submitting}
            />
          </div>
        )}
        {currentStep.id === 'address' && (
          <AddressForm
            shippingAddress={formData.shippingAddress!}
            billingAddress={formData.billingAddress}
            useSameForBilling={formData.useSameForBilling!}
            onChange={(addressData) => updateFormData(addressData)}
            errors={fieldErrors}
            disabled={submitting}
          />
        )}

        {currentStep.id === 'password' && (
          <PasswordInput
            password={formData.contrasena || ''}
            confirmPassword={formData.confirmPassword || ''}
            onChange={(passwordData) => updateFormData({
              contrasena: passwordData.password,
              confirmPassword: passwordData.confirmPassword
            })}
            errors={fieldErrors}
            disabled={submitting}
          />
        )}

        {currentStep.id === 'verification' && (
          <VerificationStep
            email={formData.email!}
            phone={`+${formData.codigo_pais === 'CO' ? '57' : '1'}${formData.telefono}`}
            preferredChannel={formData.preferredVerificationChannel!}
            verificationCode={formData.verificationCode}
            isVerified={formData.isVerified!}
            onChange={(verificationData) => updateFormData(verificationData)}
            onSendCode={handleSendVerificationCode}
            errors={fieldErrors}
            disabled={submitting}
          />
        )}

        {/* Botones de navegación responsive */}
        <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2 mt-3 sm:mt-4 lg:mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="w-full sm:w-1/2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-full font-semibold bg-gradient-to-r from-[#e5e5e5] to-[#b3c7db] text-[#222] hover:bg-[#d1d1d1] transition-all duration-150 shadow-md text-xs sm:text-sm"
            >
              ← Atrás
            </button>
          )}
          <button
            type="button"
            onClick={step === stepConfigs.length - 1 ? handleSubmit : next}
            className={`${step > 0 ? 'w-full sm:w-1/2' : 'w-full'} py-2 sm:py-2.5 px-3 sm:px-4 rounded-full font-semibold transition-all duration-200 shadow-lg text-xs sm:text-sm ${
              submitting || (step === stepConfigs.length - 1 && !formData.isVerified)
                ? "bg-[#f3f3f3] text-[#d1d1d1] cursor-not-allowed"
                : "bg-gradient-to-r from-[#002142] to-[#003366] text-white hover:from-[#003366] hover:to-[#002142]"
            }`}
            disabled={submitting || (step === stepConfigs.length - 1 && !formData.isVerified)}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Procesando...
              </span>
            ) : step === stepConfigs.length - 1 ? (
              formData.isVerified ? "✓ Crear cuenta" : "🔒 Verifica tu código primero"
            ) : (
              `Siguiente →`
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateAccountForm;
