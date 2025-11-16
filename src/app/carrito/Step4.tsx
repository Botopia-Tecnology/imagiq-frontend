"use client";
import React from "react";
import PaymentForm from "./components/PaymentForm";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import Modal from "@/components/ui/Modal";
import AddCardForm from "@/components/forms/AddCardForm";
import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import { useAuthContext } from "@/features/auth/context";

export default function Step4({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const authContext = useAuthContext();
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

  const handleContinueToNextStep = async (e: React.FormEvent) => {
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
          />

          {/* Banner de Trade-In - Debajo del resumen */}
          {tradeInData?.completed && (
            <TradeInCompletedSummary
              deviceName={tradeInData.deviceName}
              tradeInValue={tradeInData.value}
              onEdit={handleRemoveTradeIn}
            />
          )}
        </div>
      </div>
    </div>
  );
}
