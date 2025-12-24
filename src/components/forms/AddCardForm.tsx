"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import cardValidator from "card-validator";
import { Camera, X, Loader2, CreditCard as CreditCardIcon, CheckCircle, AlertCircle } from "lucide-react";
import AnimatedCard from "../ui/AnimatedCard";
import { profileService } from "@/services/profile.service";
import { useMercadoPago } from "@/hooks/useMercadoPago";
import { useAuthContext } from "@/features/auth/context";

export interface AddCardFormHandle {
  submitForm: (saveCard: boolean) => Promise<boolean>;
}

interface AddCardFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showAsModal?: boolean;
  embedded?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

const AddCardForm = React.forwardRef<AddCardFormHandle, AddCardFormProps>(({
  userId,
  onSuccess,
  onCancel,
  showAsModal = false,
  embedded = false,
  onValidityChange,
}, ref) => {
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

  // Estado para metadatos de tarjeta
  const [cardType, setCardType] = useState<"credit" | "debit" | "">("credit");
  const [franchise, setFranchise] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");

  // Detectar información de la tarjeta (BIN)
  React.useEffect(() => {
    if (!mp || !cardNumber || cardNumber.length < 6) return;

    const bin = cardNumber.replace(/\s/g, '').substring(0, 6);
    if (bin.length === 6) {
      console.log("💳 [AddCardForm] Fetching payment method for BIN:", bin);
      mp.getPaymentMethods({ bin })
        .then((response: any) => {
          const { results } = response;
          if (results && results.length > 0) {
            const method = results[0];
            console.log("💳 [AddCardForm] Payment Method detected:", method);

            // Set type
            if (method.payment_type_id === "debit_card" || method.payment_type_id === "prepaid_card") {
              setCardType("debit");
            } else {
              setCardType("credit");
            }

            // Set franchise
            if (method.name) {
              setFranchise(method.name);
            }

            // Set Bank/Issuer (if available in additional_info_needed or issuer)
            if (method.issuer && method.issuer.name) {
              setBankName(method.issuer.name);
            }
          }
        })
        .catch((err: any) => console.error("Error fetching payment methods:", err));
    }
  }, [cardNumber, mp]);

  // Load temp card data if available
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedData = localStorage.getItem("checkout-card-data");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.cardNumber) setCardNumber(parsed.cardNumber);
        if (parsed.cardHolder) setCardHolder(parsed.cardHolder);
        if (parsed.cardExpMonth) setExpiryMonth(parsed.cardExpMonth);
        if (parsed.cardExpYear) setExpiryYear(parsed.cardExpYear);
        if (parsed.cardCvc) setCvv(parsed.cardCvc);
        if (parsed.cardType) setCardType(parsed.cardType);
        if (parsed.franchise) setFranchise(parsed.franchise);
      }
    } catch (e) {
      console.error("Error loading temp card data", e);
    }
  }, []);

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

  // Verificar validez sin mostrar errores (para habilitar/deshabilitar botón externo)
  React.useEffect(() => {
    if (!onValidityChange) return;

    const isValid =
      cardNumber && validateCardNumber(cardNumber) &&
      cardHolder.trim().length > 0 &&
      expiryMonth !== "" &&
      expiryYear !== "" &&
      cvv && validateCVV(cvv);

    onValidityChange(!!isValid);
  }, [cardNumber, cardHolder, expiryMonth, expiryYear, cvv, onValidityChange]);

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

  // Expose submit method to parent
  React.useImperativeHandle(ref, () => ({
    submitForm: async (saveCard: boolean) => {
      console.log("💳 [AddCardForm] submitForm called via ref", { saveCard });
      // Create a synthetic event
      const e = { preventDefault: () => { } } as React.FormEvent;
      return await handleSubmit(e, saveCard);
    }
  }));

  // Enviar formulario con dual tokenization
  const handleSubmit = async (e: React.FormEvent, saveCard: boolean = true): Promise<boolean> => {
    e.preventDefault();
    console.log("💳 [AddCardForm] handleSubmit execution started", { saveCard });

    if (!validateForm()) {
      console.warn("💳 [AddCardForm] Validation failed", errors);
      return false;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus("idle");

    // Detectar si es tarjeta de prueba para 3D Secure
    const testCards = [
      '4111111111111111', // Visa test
      '5500000000000004', // Mastercard test 3DS
    ];

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const isTestCard = testCards.some(testNum => cleanCardNumber === testNum);

    // Si es tarjeta de prueba, NO intentar tokenizar - usar directamente
    if (isTestCard) {
      console.log("⚠️ [AddCardForm] Tarjeta de prueba detectada:", cleanCardNumber);
      console.log("⚠️ [AddCardForm] Guardando datos en localStorage para uso directo");

      // Guardar datos de tarjeta en localStorage para uso inmediato (sin tokenizar)
      const cardData = {
        cardNumber: cleanCardNumber,
        cardHolder,
        cardExpYear: expiryYear,
        cardExpMonth: expiryMonth,
        cardCvc: cvv,
        cardType: cardType || "credit", // Use detected type
        franchise: franchise || getCardBrand(cardNumber),
        bankName: bankName || franchise || (cleanCardNumber.startsWith('4') ? 'Visa Test Bank' : 'Mastercard Test Bank'),
      };

      localStorage.setItem("checkout-card-data", JSON.stringify(cardData));
      localStorage.setItem("checkout-payment-method", "tarjeta");

      // Mostrar mensaje informativo
      setSubmitStatus("success");
      setSuccessMessage(saveCard
        ? "Las tarjetas de prueba no se pueden guardar. Se usarán directamente en el pago."
        : "¡Tarjeta de prueba lista para usar!"
      );

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
        setIsSubmitting(false);

        if (onSuccess) onSuccess();
      }, 2000);

      return true;
    }

    // Si NO saveCard, guardar en localStorage y terminar
    if (!saveCard) {
      console.log("💳 [AddCardForm] Guardando tarjeta sin tokenizar para uso inmediato");

      const cardData = {
        cardNumber: cleanCardNumber,
        cardHolder,
        cardExpYear: expiryYear,
        cardExpMonth: expiryMonth,
        cardCvc: cvv,
        cardType: cardType || "credit", // Use detected type
        franchise: franchise || getCardBrand(cardNumber),
        bankName: bankName || franchise || getCardBrand(cardNumber),
      };

      localStorage.setItem("checkout-card-data", JSON.stringify(cardData));
      localStorage.setItem("checkout-payment-method", "tarjeta");

      setSubmitStatus("success");
      setSuccessMessage("¡Tarjeta lista para usar en este pago!");

      setTimeout(() => {
        setCardNumber("");
        setCardHolder("");
        setExpiryMonth("");
        setExpiryYear("");
        setCvv("");
        setErrors({});
        setSubmitStatus("idle");
        setSuccessMessage("");
        setIsSubmitting(false);

        if (onSuccess) onSuccess();
      }, 1500);

      return true;
    }

    // Flujo normal: guardar tarjeta con tokenización
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
            cardNumber: cleanCardNumber,
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
        cardNumber: cleanCardNumber,
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

      return true;

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
      return false;
    }
  };

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!embedded && <CreditCardIcon className="w-5 h-5 text-gray-700" />}
          {!embedded && <h2 className="text-lg font-bold text-gray-900">Agregar Tarjeta</h2>}
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

      {/* Campos del formulario */}
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
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${errors.cardNumber ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm uppercase ${errors.cardHolder ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.cardHolder && (
            <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
          )}
        </div>

        {/* Fecha de expiración y CVV */}
        <div className="grid grid-cols-3 gap-3">
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
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${errors.expiryMonth ? "border-red-500" : "border-gray-300"
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
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${errors.expiryYear ? "border-red-500" : "border-gray-300"
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
              CVV
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
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm ${errors.cvv ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.cvv && (
              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
            )}
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
      <div className="text-center space-y-2">
        <p className="text-gray-500 text-xs">
          Tu tarjeta está protegida con encriptación
        </p>

        {/* Detectar si es tarjeta de prueba - Oculto por solicitud */
        /*(() => {
          const cleanCardNumber = cardNumber.replace(/\s/g, '');
          const testCards = ['4111111111111111', '5500000000000004'];
          const isTestCard = testCards.some(testNum => cleanCardNumber === testNum);

          if (isTestCard) {
            return (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-semibold text-xs">Tarjeta de prueba detectada</p>
                    <p className="text-amber-700 text-xs mt-1">
                      Esta tarjeta solo funcionará para probar 3D Secure. No se puede guardar permanentemente.
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()*/}
      </div>

      {/* Vista previa animada de la tarjeta */}
      <div className="flex justify-center mt-6 mb-4">
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

      {/* Botones - Ocultar si está en modo embedded */}
      {!embedded && (
        <div className="flex flex-col gap-3">
          {/* Botón principal: Usar sin guardar */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting || submitStatus === "success"}
            className={`w-full px-4 py-2.5 rounded-lg transition-all text-sm font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2 ${submitStatus === "success"
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : submitStatus === "success" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <CreditCardIcon className="w-4 h-4" />
                <span>Usar sin guardar</span>
              </>
            )}
          </button>

          {/* Botón secundario: Guardar tarjeta */}
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting || submitStatus === "success"}
            className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Guardar tarjeta para después</span>
          </button>

          {/* Botón de cancelar */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || submitStatus === "success"}
              className="w-full px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </form>
  );

  if (!showAsModal) {
    return <div className="max-w-2xl mx-auto p-6">{FormContent}</div>;
  }

  return FormContent;
});

export default AddCardForm;
