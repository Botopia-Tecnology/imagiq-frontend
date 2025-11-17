"use client";
import React from "react";
import PaymentForm from "./components/PaymentForm";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import Modal from "@/components/ui/Modal";
import AddCardForm from "@/components/forms/AddCardForm";
import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import { useAuthContext } from "@/features/auth/context";
import { useCart } from "@/hooks/useCart";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
import { toast } from "sonner";

export default function Step4({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
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
    if (!validation.isValid && validation.errorMessage && validation.errorMessage.includes("Te removimos")) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");
      
      // Quitar el banner inmediatamente
      setTradeInData(null);
      
      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description: "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [products]);

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
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0">
      {/* Modal para agregar nueva tarjeta */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={handleCloseAddCardModal}
        size="lg"
        showCloseButton={false}
      >
        <AddCardForm
          userId={authContext.user?.id || ""}
          onSuccess={handleAddCardSuccess}
          onCancel={handleCloseAddCardModal}
          showAsModal={true}
        />
      </Modal>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <form
          id="checkout-form"
          className="col-span-2 flex flex-col gap-8  rounded-2xl p-8"
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

        {/* Resumen de compra y Trade-In */}
        <div className="space-y-4">
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
            disabled={isProcessing || !tradeInValidation.isValid}
          />

          {/* Banner de Trade-In - Debajo del resumen */}
          {tradeInData?.completed && (
            <TradeInCompletedSummary
              deviceName={tradeInData.deviceName}
              tradeInValue={tradeInData.value}
              onEdit={handleRemoveTradeIn}
              validationError={!tradeInValidation.isValid ? getTradeInValidationMessage(tradeInValidation) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
