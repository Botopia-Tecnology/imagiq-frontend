"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import cardValidator from "card-validator";
import { Camera, X, Loader2, CreditCard as CreditCardIcon, CheckCircle, AlertCircle } from "lucide-react";
import AnimatedCard from "../ui/AnimatedCard";
import { profileService } from "@/services/profile.service";
import { useMercadoPago } from "@/hooks/useMercadoPago";
import { useAuthContext } from "@/features/auth/context";

interface AddCardFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showAsModal?: boolean;
}

const AddCardForm: React.FC<AddCardFormProps> = ({
  userId,
  onSuccess,
  onCancel,
  showAsModal = false,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  // Initialize Mercado Pago SDK
  const mercadoPagoPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '';
  const { mp, isLoaded: mpLoaded, error: mpError, createCardToken } = useMercadoPago(mercadoPagoPublicKey);

  // Get user data from auth context
  const authContext = useAuthContext();

  // Validación en tiempo real
  const validateCardNumber = (number: string) => {
    const validation = cardValidator.number(number);
    return validation.isValid;
  };

  const validateCVV = (cvvValue: string, cardBrand?: string) => {
    // American Express usa CVV de 4 dígitos, otras tarjetas usan 3
    if (!cvvValue) return false;

    const brand = cardBrand || getCardBrand(cardNumber);
    const isAmex = brand?.toLowerCase().includes('american') || brand?.toLowerCase().includes('amex');
    const expectedLength = isAmex ? 4 : 3;

    return cvvValue.length === expectedLength && /^\d+$/.test(cvvValue);
  };

  // Obtener marca de tarjeta
  const getCardBrand = (number: string) => {
    const validation = cardValidator.number(number);
    return validation.card?.type || "";
  };

  // Generar arrays para los dropdowns
  const months = [
    { value: "01", label: "01 - Enero" },
    { value: "02", label: "02 - Febrero" },
    { value: "03", label: "03 - Marzo" },
    { value: "04", label: "04 - Abril" },
    { value: "05", label: "05 - Mayo" },
    { value: "06", label: "06 - Junio" },
    { value: "07", label: "07 - Julio" },
    { value: "08", label: "08 - Agosto" },
    { value: "09", label: "09 - Septiembre" },
    { value: "10", label: "10 - Octubre" },
    { value: "11", label: "11 - Noviembre" },
    { value: "12", label: "12 - Diciembre" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(" ").substring(0, 19);
  };

  // Formatear fecha de expiración para mostrar en la tarjeta (MM/AA)
  const formatExpiryDate = () => {
    if (!expiryMonth || !expiryYear) return "MM/AA";
    return `${expiryMonth}/${expiryYear.slice(-2)}`;
  };

  // Handlers de inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      setCardNumber(value);
      if (errors.cardNumber) {
        setErrors((prev) => ({ ...prev, cardNumber: "" }));
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const brand = getCardBrand(cardNumber);
    const isAmex = brand?.toLowerCase().includes('american') || brand?.toLowerCase().includes('amex');
    const maxLength = isAmex ? 4 : 3;

    if (value.length <= maxLength) {
      setCvv(value);
      if (errors.cvv) {
        setErrors((prev) => ({ ...prev, cvv: "" }));
      }
    }
  };

  // Capturar imagen de cámara y extraer número
  const captureCardImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Por ahora solo simularemos la captura
      // En producción, aquí se usaría OCR (ej: Tesseract.js)
      setShowCamera(false);

      // Simulación: rellenar con datos de ejemplo
      alert("Funcionalidad de OCR en desarrollo. Por ahora, ingresa los datos manualmente.");
    }
  }, []);

  // Validar formulario completo
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber || !validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }

    if (!cardHolder.trim()) {
      newErrors.cardHolder = "El nombre del titular es requerido";
    }

    if (!expiryMonth) {
      newErrors.expiryMonth = "Selecciona el mes de expiración";
    }

    if (!expiryYear) {
      newErrors.expiryYear = "Selecciona el año de expiración";
    }

    if (!cvv || !validateCVV(cvv)) {
      newErrors.cvv = "CVV inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario con dual tokenization
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus("idle");

    try {
      // Step 1: Get user data from auth context
      const user = authContext.user;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Step 2: Tokenize with Mercado Pago SDK (frontend)
      let mercadoPagoToken: string | null = null;

      if (mpLoaded && mp) {
        try {
          console.log('🔄 [AddCardForm] Tokenizando con Mercado Pago SDK...');
          const mpTokenResult = await createCardToken({
            cardNumber: cardNumber.replace(/\s/g, ""),
            cardholderName: cardHolder,
            cardExpirationMonth: expiryMonth,
            cardExpirationYear: expiryYear,
            securityCode: cvv,
            identificationType: user.numero_documento?.length > 10 ? 'CC' : 'CC', // Tipo de documento colombiano
            identificationNumber: user.numero_documento || '',
          });

          mercadoPagoToken = mpTokenResult.id;
          console.log('✅ [AddCardForm] Token de Mercado Pago generado:', mercadoPagoToken);
        } catch (mpErr) {
          console.warn('⚠️ [AddCardForm] Error al tokenizar con Mercado Pago:', mpErr);
          // Continue without Mercado Pago token - backend will handle partial tokenization
        }
      } else if (mpError) {
        console.warn('⚠️ [AddCardForm] Mercado Pago SDK no disponible:', mpError);
      }

      // Step 3: Send to backend for dual tokenization
      console.log('🔄 [AddCardForm] Enviando al backend para dual tokenization...');
      await profileService.tokenizeCardDual({
        userId,
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardHolder,
        expiryMonth,
        expiryYear,
        cvv,
        customerEmail: user.email,
        customerDocNumber: user.numero_documento || '',
        customerPhone: user.telefono,
        mercadoPagoFrontendToken: mercadoPagoToken,
      });

      console.log('✅ [AddCardForm] Tarjeta tokenizada exitosamente');

      // Mostrar mensaje de éxito
      setSubmitStatus("success");
      setSuccessMessage("¡Tarjeta agregada exitosamente!");

      // Limpiar formulario después de un delay
      setTimeout(() => {
        setCardNumber("");
        setCardHolder("");
        setExpiryMonth("");
        setExpiryYear("");
        setCvv("");
        setErrors({});
        setSubmitStatus("idle");
        setSuccessMessage("");

        if (onSuccess) onSuccess();
      }, 1500);

    } catch (error) {
      console.error("❌ [AddCardForm] Error tokenizando tarjeta:", error);
      setSubmitStatus("error");

      // Parsear errores específicos del backend
      let errorMessage = "Error al agregar la tarjeta. Por favor, intenta de nuevo.";

      if (error instanceof Error) {
        try {
          // Intentar parsear el mensaje de error como JSON
          const errorData = JSON.parse(error.message);

          // Manejar errores específicos
          if (errorData.errorCode || errorData.codError) {
            const errorCode = errorData.errorCode || errorData.codError;
            const backendMessage = errorData.errorMessage || errorData.message;

            switch (errorCode) {
              case "AE100":
                // Determinar el mensaje específico según el error
                if (backendMessage?.toLowerCase().includes("expired")) {
                  errorMessage = "La tarjeta está vencida. Por favor, usa otra tarjeta.";
                } else {
                  errorMessage = "La tarjeta fue rechazada. Por favor, contacta a tu banco.";
                }
                break;
              case "DUPLICATE_CARD":
                errorMessage = "Esta tarjeta ya está registrada en tu cuenta.";
                break;
              default:
                errorMessage = backendMessage || errorData.message || errorMessage;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Si no es JSON, usar el mensaje tal cual
          errorMessage = error.message;
        }
      }

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Agregar Tarjeta</h2>
        </div>
        {showAsModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Layout de dos columnas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda: Vista previa animada de la tarjeta */}
        <div className="flex items-start justify-center md:justify-start">
          <div className="w-full max-w-[340px]">
            <AnimatedCard
              cardNumber={cardNumber}
              cardHolder={cardHolder}
              expiryDate={formatExpiryDate()}
              cvv={cvv}
              brand={getCardBrand(cardNumber)}
              isFlipped={isCardFlipped}
            />
          </div>
        </div>

        {/* Columna derecha: Campos del formulario */}
        <div className="space-y-4">
        {/* Número de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatCardNumber(cardNumber)}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCamera(!showCamera)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <Camera className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Cámara */}
        {showCamera && (
          <div className="relative rounded-lg overflow-hidden bg-black">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
              videoConstraints={{
                facingMode: { ideal: "environment" },
              }}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                type="button"
                onClick={captureCardImage}
                className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100"
              >
                Capturar
              </button>
              <button
                type="button"
                onClick={() => setShowCamera(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Nombre del titular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del titular
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => {
              setCardHolder(e.target.value.toUpperCase());
              if (errors.cardHolder) {
                setErrors((prev) => ({ ...prev, cardHolder: "" }));
              }
            }}
            placeholder="JUAN PÉREZ"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm uppercase ${
              errors.cardHolder ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cardHolder && (
            <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
          )}
        </div>

        {/* Fecha de expiración y CVV */}
        <div className="grid grid-cols-3 gap-4">
          {/* Mes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes
            </label>
            <select
              value={expiryMonth}
              onChange={(e) => {
                setExpiryMonth(e.target.value);
                if (errors.expiryMonth) {
                  setErrors((prev) => ({ ...prev, expiryMonth: "" }));
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${
                errors.expiryMonth ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">MM</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {errors.expiryMonth && (
              <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>
            )}
          </div>

          {/* Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <select
              value={expiryYear}
              onChange={(e) => {
                setExpiryYear(e.target.value);
                if (errors.expiryYear) {
                  setErrors((prev) => ({ ...prev, expiryYear: "" }));
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${
                errors.expiryYear ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">AAAA</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
            {errors.expiryYear && (
              <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV {(() => {
                const brand = getCardBrand(cardNumber);
                const isAmex = brand?.toLowerCase().includes('american') || brand?.toLowerCase().includes('amex');
                return isAmex ? '4 dígitos' : '3 dígitos';
              })()}
            </label>
            <input
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              onFocus={() => setIsCardFlipped(true)}
              onBlur={() => setIsCardFlipped(false)}
              placeholder={(() => {
                const brand = getCardBrand(cardNumber);
                const isAmex = brand?.toLowerCase().includes('american') || brand?.toLowerCase().includes('amex');
                return isAmex ? '1234' : '123';
              })()}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${
                errors.cvv ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cvv && (
              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {submitStatus === "success" && successMessage && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold text-sm">{successMessage}</p>
              <p className="text-green-600 text-xs mt-1">La tarjeta se ha guardado de forma segura</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {submitStatus === "error" && errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold text-sm">Error al procesar la tarjeta</p>
              <p className="text-red-600 text-sm mt-1">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de protección */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">
          Tu tarjeta está protegida con encriptación
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || submitStatus === "success"}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || submitStatus === "success"}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            submitStatus === "success"
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Procesando tarjeta...</span>
            </>
          ) : submitStatus === "success" ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>¡Tarjeta agregada!</span>
            </>
          ) : (
            "Agregar Tarjeta"
          )}
        </button>
      </div>
    </form>
  );

  if (!showAsModal) {
    return <div className="max-w-2xl mx-auto p-6">{FormContent}</div>;
  }

  return FormContent;
};

export default AddCardForm;
