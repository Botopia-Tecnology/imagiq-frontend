"use client";

import { useState } from "react";
import { notifyRegisterSuccess, notifyError } from "../notifications";
import { useRouter } from "next/navigation";

const REGISTER_API_URL = "http://localhost:3001/api/auth/register";

// Mejoras visuales y UX para el formulario multi-step
// - Animaciones de transición entre pasos
// - Inputs con feedback visual
// - Botones con efectos y estados
// - Mensajes de error y éxito destacados
// - Layout más atractivo y profesional
const CreateAccountForm = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [step, setStep] = useState(0);
  // Estado local para valores y errores
  const [values, setValues] = useState<Record<string, string>>({
    email: "",
    nombre: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [submitting, setSubmitting] = useState(false);

  // Definición de los pasos y campos
  const steps = [
    {
      name: "Correo",
      fields: [
        {
          name: "email",
          type: "email",
          label: "¿Cuál es tu correo?",
          placeholder: "Ingresa tu correo electrónico",
          required: true,
          validate: (value: string) =>
            !value
              ? "El correo es requerido"
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              ? "Formato de correo inválido"
              : undefined,
        },
      ],
    },
    {
      name: "Información básica",
      fields: [
        {
          name: "nombre",
          type: "text",
          label: "Nombre",
          placeholder: "Ingresa tu nombre",
          required: true,
          validate: (value: string) =>
            !value ? "El nombre es requerido" : undefined,
        },
      ],
    },
    {
      name: "Contraseña",
      fields: [
        {
          name: "password",
          type: "password",
          label: "Define una contraseña",
          placeholder: "Crea una contraseña segura",
          required: true,
          validate: (value: string) =>
            !value
              ? "La contraseña es requerida"
              : value.length < 8
              ? "La contraseña debe tener al menos 8 caracteres"
              : undefined,
        },
      ],
    },
  ];

  const currentFields = steps[step].fields;

  // Validación manual por paso
  const getErrors = () => {
    const errors: Record<string, string> = {};
    currentFields.forEach((config) => {
      const value = values[config.name] ?? "";
      if (typeof config.validate === "function") {
        const error = config.validate(value);
        if (error) errors[config.name] = error;
      } else if (config.required && !value) {
        errors[config.name] = "Este campo es requerido";
      }
    });
    return errors;
  };

  const handleFieldChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const next = () => {
    const errors = getErrors();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = getErrors();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setShowModal(false);
    setModalContent(null);
    setSubmitting(true);
    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          nombre: values.nombre,
          contrasena: values.password,
          rol: "usuario",
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
      if (!response.ok) {
        let errorMsg = "Error al registrar";
        try {
          const result = await response.json();
          if (
            result.message &&
            result.message.toLowerCase().includes("correo") &&
            result.message.toLowerCase().includes("existe")
          ) {
            errorMsg = "Ya existe un usuario con ese correo electrónico.";
          } else {
            errorMsg = result.message || errorMsg;
          }
        } catch {}
        setModalContent({ type: "error", message: errorMsg });
        setShowModal(true);
        await notifyError(errorMsg, "Registro fallido");
        setSubmitting(false);
        return;
      }
      setModalContent({
        type: "success",
        message: `¡Cuenta creada exitosamente para ${values.email}!`,
      });
      setShowModal(true);
      await notifyRegisterSuccess(values.email);
      setTimeout(() => {
        router.push("/login");
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
      <h2 className="text-center text-3xl font-bold mb-2 text-[#002142] drop-shadow-sm tracking-tight animate-fade-in">
        Crear una cuenta
      </h2>
      <p className="text-center text-base text-[#4a5a6a] mb-6 animate-fade-in">
        ¿Ya tienes una cuenta?{" "}
        <button
          className="underline text-[#003366] hover:text-[#002142] font-semibold transition-colors duration-150"
          type="button"
          onClick={() => router.push("/login")}
        >
          Inicia sesión
        </button>
      </p>
      <div className="flex flex-col items-center w-full mb-8 animate-fade-in">
        <div
          className="relative w-full flex flex-col items-center"
          style={{ maxWidth: "400px" }}
        >
          <div
            className="absolute top-4 left-0 right-0 h-[3px] bg-gradient-to-r from-[#002142]/10 via-[#e5e5e5] to-[#002142]/10"
            style={{ zIndex: 0 }}
          />
          <div
            className="flex w-full justify-between items-center relative"
            style={{ zIndex: 1 }}
          >
            {[0, 1, 2].map((n) => (
              <div className="flex flex-col items-center flex-1" key={n}>
                <button
                  type="button"
                  className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-base focus:outline-none transition-all duration-200 shadow-md border-2 ${
                    step === n
                      ? "bg-[#002142] text-white border-[#002142] scale-110"
                      : "bg-[#e5e5e5] text-[#bdbdbd] border-[#e5e5e5] hover:bg-[#d1d1d1]"
                  }`}
                  disabled={step === n || step < n}
                  aria-label={`Ir al paso ${n + 1}`}
                >
                  {n + 1}
                </button>
              </div>
            ))}
          </div>
          <div className="flex w-full justify-between items-center mt-2">
            <div
              className={`flex-1 text-xs text-center ${
                step === 0 ? "text-[#002142] font-semibold" : "text-[#bdbdbd]"
              }`}
            >
              Ingresa tu correo
            </div>
            <div
              className={`flex-1 text-xs text-center ${
                step === 1 ? "text-[#002142] font-semibold" : "text-[#bdbdbd]"
              }`}
            >
              Información básica
            </div>
            <div
              className={`flex-1 text-xs text-center ${
                step === 2 ? "text-[#002142] font-semibold" : "text-[#bdbdbd]"
              }`}
            >
              Define tu contraseña
            </div>
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
      <form
        onSubmit={
          step === steps.length - 1
            ? handleSubmit
            : (e) => {
                e.preventDefault();
                next();
              }
        }
        className="w-full flex flex-col gap-6 animate-fade-in"
      >
        {currentFields.map((config) => (
          <div key={config.name} className="w-full">
            <label
              htmlFor={config.name}
              className="block text-base font-semibold text-[#002142] mb-2 tracking-tight"
            >
              {config.label}
            </label>
            <input
              id={config.name}
              type={config.type}
              name={config.name}
              value={values[config.name] ?? ""}
              onChange={(e) => handleFieldChange(config.name, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal mb-2 bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                fieldErrors[config.name] ? "border-red-400" : "border-[#e5e5e5]"
              }`}
              placeholder={config.placeholder}
              autoComplete={config.type === "password" ? "new-password" : "off"}
              disabled={submitting}
            />
            {fieldErrors[config.name] && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">
                {fieldErrors[config.name]}
              </p>
            )}
          </div>
        ))}
        <div className="flex w-full gap-2 mt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="w-1/2 py-3 rounded-full font-semibold bg-gradient-to-r from-[#e5e5e5] to-[#b3c7db] text-[#222] hover:bg-[#d1d1d1] transition-all duration-150 shadow-md"
            >
              Atrás
            </button>
          )}
          <button
            type={step === steps.length - 1 ? "submit" : "button"}
            onClick={step === steps.length - 1 ? undefined : next}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-200 shadow-lg ${
              submitting
                ? "bg-[#f3f3f3] text-[#d1d1d1] cursor-not-allowed"
                : "bg-gradient-to-r from-[#002142] to-[#003366] text-white hover:from-[#003366] hover:to-[#002142] active:bg-[#00152a]"
            }`}
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-[#003366]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Procesando...
              </span>
            ) : step === steps.length - 1 ? (
              "Crear cuenta"
            ) : (
              "Siguiente"
            )}
          </button>
        </div>
      </form>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default CreateAccountForm;
