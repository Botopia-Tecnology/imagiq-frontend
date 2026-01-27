"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PaymentForm from "./components/PaymentForm";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import Modal from "@/components/ui/Modal";
import AddCardForm from "@/components/forms/AddCardForm";
import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import { useAuthContext } from "@/features/auth/context";
import { useCart } from "@/hooks/useCart";
import {
  validateTradeInProducts,
  getTradeInValidationMessage,
} from "./utils/validateTradeIn";
import { toast } from "sonner";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step4({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const router = useRouter();
  const authContext = useAuthContext();
  const { products } = useCart();
  const {
    isProcessing,
    paymentMethod,
    selectedBank,
    card,
    cardErrors,
    saveInfo,
    selectedCardId,
    useNewCard,
    isAddCardModalOpen,
    savedCardsReloadCounter,
    zeroInterestData,
    isLoadingZeroInterest,
    handleCardChange,
    handleCardErrorChange,
    handlePaymentMethodChange,
    handleBankChange,
    handleSavePaymentData,
    handleCardSelect,
    handleOpenAddCardModal,
    handleCloseAddCardModal,
    handleAddCardSuccess,
    handleUseNewCardChange,
    fetchZeroInterestInfo,
    setSaveInfo,
  } = useCheckoutLogic();
  const [loggedUser, setLoggedUser] = useSecureStorage<User | null>(
    "imagiq_user",
    null
  );

  // Trade-In state management
  const [tradeInData, setTradeInData] = React.useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Load Trade-In data from localStorage
  React.useEffect(() => {
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed.completed) {
          setTradeInData(parsed);
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    }
  }, []);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);
    
    // Si se elimina el trade-in y el método está en "tienda", cambiar a "domicilio"
    if (typeof globalThis.window !== "undefined") {
      const currentMethod = globalThis.window.localStorage.getItem("checkout-delivery-method");
      if (currentMethod === "tienda") {
        globalThis.window.localStorage.setItem("checkout-delivery-method", "domicilio");
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", { detail: { method: "domicilio" } })
        );
        globalThis.window.dispatchEvent(new Event("storage"));
      }
    }
  };

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof products;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
  React.useEffect(() => {
    const validation = validateTradeInProducts(products);
    setTradeInValidation(validation);

    // Si el producto ya no aplica (indRetoma === 0), quitar banner inmediatamente y mostrar notificación
    if (
      !validation.isValid &&
      validation.errorMessage &&
      validation.errorMessage.includes("Te removimos")
    ) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");

      // Quitar el banner inmediatamente
      setTradeInData(null);

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description:
          "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [products]);

  // Redirigir a Step3 si la dirección cambia desde el header
  React.useEffect(() => {
    const handleAddressChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const fromHeader = customEvent.detail?.fromHeader;

      if (fromHeader) {
        // console.log(
//           "🔄 Dirección cambiada desde header en Step4, redirigiendo a Step3..."
//         );
        router.push("/carrito/step3");
      }
    };

    window.addEventListener(
      "address-changed",
      handleAddressChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "address-changed",
        handleAddressChange as EventListener
      );
    };
  }, [router]);

  // Validar si el método de pago está seleccionado correctamente
  const isPaymentMethodValid = React.useMemo(() => {
    // Si no hay método de pago seleccionado
    if (!paymentMethod) return false;

    // Si es tarjeta, debe tener una tarjeta seleccionada
    if (paymentMethod === "tarjeta" && !selectedCardId) return false;

    // Si es PSE, debe tener un banco seleccionado
    if (paymentMethod === "pse" && !selectedBank) return false;

    // Si es Addi, siempre está válido (no requiere más datos)
    return true;
  }, [paymentMethod, selectedCardId, selectedBank]);

  const handleContinueToNextStep = async (e: React.FormEvent) => {
    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      e.preventDefault();
      alert(getTradeInValidationMessage(validation));
      return;
    }

    const isValid = await handleSavePaymentData(e);
    if (isValid && onContinue) {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0 pb-40 md:pb-8">
      {/* Modal para agregar nueva tarjeta */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={handleCloseAddCardModal}
        size="lg"
        showCloseButton={false}
      >
        <AddCardForm
          userId={authContext.user?.id || String(loggedUser?.id)}
          onSuccess={handleAddCardSuccess}
          onCancel={handleCloseAddCardModal}
          showAsModal={true}
        />
      </Modal>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <form
          id="checkout-form"
          className="col-span-2 flex flex-col gap-8 rounded-2xl p-8 md:min-h-[70vh]"
          onSubmit={handleContinueToNextStep}
          autoComplete="off"
        >
          {/* Payment Form */}
          <PaymentForm
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            card={card}
            cardErrors={cardErrors}
            onCardChange={handleCardChange}
            onCardErrorChange={handleCardErrorChange}
            saveInfo={saveInfo}
            onSaveInfoChange={setSaveInfo}
            selectedBank={selectedBank}
            onBankChange={handleBankChange}
            selectedCardId={selectedCardId}
            onCardSelect={handleCardSelect}
            onOpenAddCardModal={handleOpenAddCardModal}
            savedCardsReloadCounter={savedCardsReloadCounter}
            useNewCard={useNewCard}
            onUseNewCardChange={handleUseNewCardChange}
            zeroInterestData={zeroInterestData}
            isLoadingZeroInterest={isLoadingZeroInterest}
            onFetchZeroInterest={fetchZeroInterestInfo}
          />
        </form>

        {/* Resumen de compra y Trade-In - Hidden en mobile */}
        <aside className="hidden md:block space-y-4 self-start sticky top-40">
          <Step4OrderSummary
            isProcessing={isProcessing}
            onFinishPayment={() => {
              const form = document.getElementById(
                "checkout-form"
              ) as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            onBack={onBack}
            buttonText="Continuar"
            disabled={isProcessing || !tradeInValidation.isValid || !isPaymentMethodValid}
            isSticky={true}
            deliveryMethod={
              typeof window !== "undefined"
                ? (() => {
                    const method = localStorage.getItem("checkout-delivery-method");
                    if (method === "tienda") return "pickup";
                    if (method === "domicilio") return "delivery";
                    if (method === "delivery" || method === "pickup") return method;
                    return undefined;
                  })()
                : undefined
            }
          />

          {/* Banner de Trade-In - Debajo del resumen (baja con el scroll) */}
          {tradeInData?.completed && (
            <TradeInCompletedSummary
              deviceName={tradeInData.deviceName}
              tradeInValue={tradeInData.value}
              onEdit={handleRemoveTradeIn}
              validationError={
                !tradeInValidation.isValid
                  ? getTradeInValidationMessage(tradeInValidation)
                  : undefined
              }
            />
          )}
        </aside>
      </div>

      {/* Sticky Bottom Bar - Solo Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="p-4">
          {/* Resumen compacto */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">
                Total ({products.reduce((acc, p) => acc + p.quantity, 0)}{" "}
                productos)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                $ {Number(products.reduce((acc, p) => acc + p.price * p.quantity, 0)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Botón continuar */}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${
              isProcessing || !tradeInValidation.isValid || !isPaymentMethodValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#222] hover:bg-[#333] cursor-pointer"
            }`}
            onClick={() => {
              const form = document.getElementById("checkout-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isProcessing || !tradeInValidation.isValid || !isPaymentMethodValid}
          >
            {isProcessing ? "Procesando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
