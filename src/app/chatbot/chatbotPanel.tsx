// filepath: src/app/chatbot/ChatbotPanel.tsx
import React, { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import { Bot, X } from "lucide-react";

// Importa la función para enviar mensajes a Gemini
import { sendMessageToGemini } from "./apikey";

export default function ChatbotPanel({ onClose }: Readonly<{ onClose: () => void }>) {
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

  const handleNext = () => setStep((prev) => prev + 1);
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
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Ocurrió un error al contactar a Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle quick option buttons
  const handleQuickOption = async (optionText: string) => {
    setMessages((prev) => [...prev, { from: "user", text: optionText }]);
    setLoading(true);

    try {
      const botReply = await sendMessageToGemini(optionText);
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch {
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
      className="fixed top-0 right-0 flex flex-col h-full chatbot-panel shadow-2xl"
    >
      {/* Header mejorado */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white block">
              Samsung Asistente
            </span>
            <span className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {' '}En línea
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          aria-label="Cerrar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Chat Body con scroll mejorado */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col scroll-smooth"
style={{
          scrollBehavior: 'smooth'
        }}
      >
        {step === 0 && (
          <div className="mb-8 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.from}-${idx}`}
                className={`rounded-2xl px-4 py-3 text-sm w-fit max-w-[85%] shadow-sm ${
                  msg.from === "bot"
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 border border-blue-200"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 text-white self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="rounded-2xl px-4 py-3 text-sm w-fit max-w-[85%] bg-blue-50 text-gray-500 flex items-center gap-2 border border-blue-200">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
                <span>Samsung IA está escribiendo...</span>
              </div>
            )}
          </div>
        )}
        {step === 1 && <Step1 onContinue={handleNext} />}
        {step === 2 && <Step2 onContinue={handleNext} />}
        {step === 3 && <Step3 onContinue={handleNext} />}
        {step === 4 && <Step4 />}
      </div>
      {/* Opciones: ahora justo encima del input */}
      {step === 0 && messages.length === 0 && (
        <div className="flex flex-col gap-2 px-4 pb-3">
          <button
            onClick={() => handleQuickOption("Necesito ayuda con mi compra")}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <span className="text-lg">🛒</span>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Ayuda con mi compra</span>
          </button>
          <button
            onClick={() => handleQuickOption("¿Cuál es el estado de mi compra?")}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <span className="text-lg">📦</span>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Estado de mi pedido</span>
          </button>
          <button
            onClick={() => handleQuickOption("Quiero conocer productos Samsung")}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <span className="text-lg">📱</span>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Explorar productos</span>
          </button>
        </div>
      )}
      {/* Chat Input habilitado */}
      {step === 0 && (
        <form
          className="p-4 border-t border-gray-200 bg-white bg-opacity-95 backdrop-blur-sm flex gap-2"
          onSubmit={handleSend}
        >
          <input
            type="text"
            className="flex-1 rounded-full border-2 border-gray-200 px-5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white transition-all"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={handleInputChange}
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !input.trim()}
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