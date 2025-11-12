"use client";
import React from "react";
import PaymentForm from "./components/PaymentForm";
import BillingTypeSelector from "./components/BillingTypeSelector";
import PolicyAcceptance from "./components/PolicyAcceptance";
import CheckoutActions from "./components/CheckoutActions";
import Step4OrderSummary from "./components/Step4OrderSummary";
import Modal from "@/components/ui/Modal";
import AddCardForm from "@/components/forms/AddCardForm";
import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import { useAuthContext } from "@/features/auth/context";

export default function Step4({ onBack }: { onBack?: () => void }) {
  const authContext = useAuthContext();
  const {
    error,
    isProcessing,
    paymentMethod,
    selectedBank,
    card,
    cardErrors,
    billingError,
    billingType,
    accepted,
    saveInfo,
    selectedCardId,
    useNewCard,
    isAddCardModalOpen,
    handleCardChange,
    handleCardErrorChange,
    handlePaymentMethodChange,
    handleBankChange,
    handleBillingTypeChange,
    handleFinish,
    handleCardSelect,
    handleOpenAddCardModal,
    handleCloseAddCardModal,
    handleUseNewCardChange,
    setAccepted,
    setSaveInfo,
  } = useCheckoutLogic();

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
          onSuccess={handleCloseAddCardModal}
          onCancel={handleCloseAddCardModal}
          showAsModal={true}
        />
      </Modal>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <form
          id="checkout-form"
          className="col-span-2 flex flex-col gap-8  rounded-2xl p-8"
          onSubmit={handleFinish}
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
            useNewCard={useNewCard}
            onUseNewCardChange={handleUseNewCardChange}
          />

          {/* Billing section */}
          <BillingTypeSelector
            value={billingType}
            onChange={handleBillingTypeChange}
            error={billingError}
          />

          {/* Privacy policy acceptance */}
          <PolicyAcceptance checked={accepted} onChange={setAccepted} />

          {/* Action buttons */}
          <CheckoutActions
            onBack={onBack}
            onFinish={() => {
              const form = document.getElementById(
                "checkout-form"
              ) as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            isProcessing={isProcessing}
            isAccepted={accepted}
            error={error}
          />
        </form>

        {/* Resumen de compra */}
        <Step4OrderSummary
          isProcessing={isProcessing}
          accepted={accepted}
          onFinishPayment={() => {
            const form = document.getElementById(
              "checkout-form"
            ) as HTMLFormElement;
            if (form) form.requestSubmit();
          }}
        />
      </div>
    </div>
  );
}
