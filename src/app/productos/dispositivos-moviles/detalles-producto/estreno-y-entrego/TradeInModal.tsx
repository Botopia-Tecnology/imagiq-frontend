"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "./ProgressBar";
import ModalFooter from "./ModalFooter";
import DeviceCategorySelector from "./DeviceCategorySelector";
import BrandDropdown from "./BrandDropdown";
import SimpleDropdown from "./SimpleDropdown";
import TradeInInformation from "./TradeInInformation";
import ConditionQuestion from "./ConditionQuestion";
import IMEIInputSection from "./IMEIInputSection";
import { useTradeInForm } from "./hooks/useTradeInForm";
import { CONDITION_QUESTIONS } from "./constants/tradeInQuestions";
import type { TradeInData } from "./types";
import { mockTradeInData } from "./mockData";

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
  tradeInData?: TradeInData;
}

export default function TradeInModal({
  isOpen,
  onClose,
  onContinue,
  tradeInData = mockTradeInData,
}: TradeInModalProps) {
  const [mounted, setMounted] = useState(false);

  // Custom hook for all form logic
  const {
    currentStep,
    formState,
    dropdownState,
    conditionAnswers,
    imeiInput,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    availableBrands,
    availableModels,
    availableCapacities,
    setCurrentStep,
    setSelectedCategory,
    setSelectedBrand,
    setSelectedModel,
    setSelectedCapacity,
    setIsBrandDropdownOpen,
    setIsModelDropdownOpen,
    setIsCapacityDropdownOpen,
    setImeiInput,
    handleConditionAnswer,
    resetForm,
  } = useTradeInForm({ tradeInData, isOpen });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleContinueStep1 = () => setCurrentStep(2);

  const handleContinueStep2 = () => {
    if (isStep2Valid) {
      setCurrentStep(3);
    } else {
      alert("Para continuar con el trade-in, tu dispositivo debe cumplir con todas las condiciones.");
    }
  };

  const handleBackToStep1 = () => setCurrentStep(1);
  const handleBackToStep2 = () => setCurrentStep(2);

  const handleFinalContinue = () => {
    const tradeInSelection = {
      category: tradeInData.categories.find((c) => c.id === formState.selectedCategory),
      brand: formState.selectedBrand,
      model: formState.selectedModel,
      capacity: formState.selectedCapacity,
      imei: imeiInput,
    };

    console.log("Trade-in selection:", tradeInSelection);
    onContinue?.();
    handleClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Vamos a empezar:",
          subtitle: "¿Cuál dispositivo deseas entregar?",
        };
      case 2:
        return {
          title: "Último paso",
          subtitle: "¿Tu dispositivo está en buenas condiciones?",
        };
      case 3:
        return {
          title: "Casi listo, por favor ingresa tu número de IMEI",
          subtitle: null,
        };
    }
  };

  const getCurrentStepValid = () => {
    if (currentStep === 1) return isStep1Valid;
    if (currentStep === 2) return isStep2Valid;
    return isStep3Valid;
  };

  const getContinueHandler = () => {
    if (currentStep === 1) return handleContinueStep1;
    if (currentStep === 2) return handleContinueStep2;
    return handleFinalContinue;
  };

  if (!isOpen || !mounted) return null;

  const stepTitle = getStepTitle();
  const isCurrentStepValid = getCurrentStepValid();

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="trade-in-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-t-3xl rounded-b-3xl w-full max-w-4xl mx-4 h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 md:top-8 md:right-10 p-1 hover:bg-gray-100 rounded-full transition-colors z-20 bg-white"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 md:w-7 md:h-7 text-[#222]" />
            </button>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="bg-white px-6 md:px-10 pt-6 md:pt-8 pb-4">
                <div className="flex items-start justify-between gap-4 mb-4 pr-8">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#222] leading-tight">
                      {stepTitle.title}
                    </h2>
                    {stepTitle.subtitle && (
                      <p className="text-xl md:text-2xl text-[#222] mt-1">
                        {stepTitle.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Indicator */}
                <ProgressBar currentStep={currentStep} />
              </div>

              {/* Step Content */}
              
              {/* Step 1: Device Selection */}
              {currentStep === 1 && (
                <div className="px-10 md:px-20 lg:px-24 py-6">
                  <DeviceCategorySelector
                    selectedCategory={formState.selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    categories={tradeInData.categories}
                  />

                  <BrandDropdown
                    brands={availableBrands}
                    selectedBrand={formState.selectedBrand}
                    isOpen={dropdownState.isBrandDropdownOpen}
                    onToggle={() => setIsBrandDropdownOpen(!dropdownState.isBrandDropdownOpen)}
                    onSelectBrand={(brand) => {
                      setSelectedBrand(brand);
                      setIsBrandDropdownOpen(false);
                    }}
                  />

                  <SimpleDropdown
                    label="Modelo"
                    placeholder="Selecciona el modelo de tu dispositivo"
                    isOpen={dropdownState.isModelDropdownOpen}
                    isDisabled={!formState.selectedBrand}
                    options={availableModels}
                    selectedOption={formState.selectedModel}
                    onToggle={() => setIsModelDropdownOpen(!dropdownState.isModelDropdownOpen)}
                    onSelectOption={(model) => {
                      setSelectedModel(model);
                      setIsModelDropdownOpen(false);
                    }}
                  />

                  <SimpleDropdown
                    label="Capacidad"
                    placeholder="Selecciona la capacidad de tu dispositivo"
                    isOpen={dropdownState.isCapacityDropdownOpen}
                    isDisabled={!formState.selectedModel}
                    options={availableCapacities}
                    selectedOption={formState.selectedCapacity}
                    onToggle={() => setIsCapacityDropdownOpen(!dropdownState.isCapacityDropdownOpen)}
                    onSelectOption={(capacity) => {
                      setSelectedCapacity(capacity);
                      setIsCapacityDropdownOpen(false);
                    }}
                  />

                  <div className="-mx-10 md:-mx-20 lg:-mx-24 px-6 md:px-10 py-6">
                    <TradeInInformation />
                  </div>
                </div>
              )}

              {/* Step 2: Condition Verification */}
              {currentStep === 2 && (
                <div className="px-6 md:px-10 py-6 space-y-6">
                  {CONDITION_QUESTIONS.map((question, index) => (
                    <ConditionQuestion
                      key={question.id}
                      question={question.question}
                      details={question.details}
                      answer={conditionAnswers[question.id as keyof typeof conditionAnswers]}
                      onAnswer={(answer) => handleConditionAnswer(question.id as keyof typeof conditionAnswers, answer)}
                      isLast={index === CONDITION_QUESTIONS.length - 1}
                    />
                  ))}
                </div>
              )}

              {/* Step 3: IMEI Input */}
              {currentStep === 3 && (
                <IMEIInputSection
                  selectedCategory={formState.selectedCategory}
                  selectedBrand={formState.selectedBrand}
                  selectedModel={formState.selectedModel}
                  selectedCapacity={formState.selectedCapacity}
                  imeiInput={imeiInput}
                  onImeiChange={setImeiInput}
                />
              )}
            </div>

            {/* Footer */}
            <ModalFooter
              currentStep={currentStep}
              isStepValid={isCurrentStepValid}
              onClose={handleClose}
              onBack={currentStep === 2 ? handleBackToStep1 : handleBackToStep2}
              onContinue={getContinueHandler()}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
