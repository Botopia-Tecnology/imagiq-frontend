// filepath: src/app/chatbot/ChatbotPanel.tsx
import React, { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Image from "next/image";

// Importa la función para enviar mensajes a Gemini
import { sendMessageToGemini } from "./apikey";

export default function ChatbotPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([
    {
      from: "bot",
      text: "Hola, soy tu asistente virtual de Samsung Store. ¿En qué puedo ayudarte?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleStart = () => setStep(1);
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));
  const handleReset = () => setStep(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Nuevo: Enviar mensaje a Gemini y mostrar respuesta
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const botReply = await sendMessageToGemini(userMessage);
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Ocurrió un error al contactar a Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 right-0 flex flex-col h-full z-[99999]"
      style={{
        width: "370px",
        maxWidth: "100vw",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(8px)", 
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "-4px 0 24px 0 rgba(0,0,0,0.10)",
        zIndex: 99999,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white bg-opacity-90 border-b border-gray-200 rounded-t-none shadow-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-black">
            Samsung Asistente Inteligente
          </span>
          {/* Icono SamsungIA.png */}
          <span className="inline-block">
            <Image
              src="/chatbot/SamsungIA.png"
              alt="Samsung IA"
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
            />
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar chat"
        >
          ×
        </button>
      </div>
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col">
        {step === 0 && (
          <>
            <div className="mb-8 flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg px-3 py-2 text-sm w-fit max-w-[80%] ${
                    msg.from === "bot"
                      ? "bg-blue-50 text-gray-900"
                      : "bg-gray-200 text-right self-end"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="rounded-lg px-3 py-2 text-sm w-fit max-w-[80%] bg-blue-50 text-gray-400">
                  Samsung IA está escribiendo...
                </div>
              )}
            </div>
          </>
        )}
        {step === 1 && <Step1 onContinue={handleNext} />}
        {step === 2 && <Step2 onContinue={handleNext} />}
        {step === 3 && <Step3 onContinue={handleNext} />}
        {step === 4 && <Step4 />}
      </div>
      {/* Opciones: ahora justo encima del input */}
      {step === 0 && (
        <div className="flex gap-2 px-4 pb-2">
          <button
            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-blue-50 transition flex-1"
            type="button"
            onClick={() => window.open("/chatbot", "_blank")}
          >
            ¿Necesitas ayuda con tu compra?
          </button>
          <button
            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-blue-50 transition flex-1"
            type="button"
            onClick={() => setInput("Quiero averiguar el estado de mi compra")}
          >
            Averigua el estado de tu compra
          </button>
          <button
            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-blue-50 transition flex-1"
            type="button"
            onClick={() => setInput("Quiero conocer productos")}
          >
            ¿Quieres conocer productos?
          </button>
        </div>
      )}
      {/* Chat Input habilitado */}
      {step === 0 && (
        <form
          className="p-4 border-t border-gray-100 bg-transparent flex gap-2"
          onSubmit={handleSend}
        >
          <input
            type="text"
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white bg-opacity-80"
            placeholder="Escribe aquí tu mensaje..."
            value={input}
            onChange={handleInputChange}
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-[#0a2342] text-white rounded-full px-6 py-2 text-sm font-medium shadow hover:bg-[#143362] transition"
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      )}
      {/* Botón para volver al inicio si está en steps */}
      {step > 0 && (
        <div className="p-4 border-t border-gray-100 bg-transparent flex justify-end">
          <button
            className="text-sm text-blue-600 hover:underline"
            type="button"
            onClick={handleReset}
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
}

// Exporta la función para usarla en otros componentes si es necesario
export { sendMessageToGemini } from "./apikey";