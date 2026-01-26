"use client";
import { useState, useEffect } from "react";
import ChatbotButton from "./chatbotButton";
import ChatbotPanel from "@/app/chatbot/chatbotPanel";
import { useChatbotVisibility } from "@/hooks/useChatbotVisibility";

export default function ChatbotWidget() {
  const [showChat, setShowChat] = useState(false);
  const isVisible = useChatbotVisibility();

  // Cerrar el panel si navegamos a una ruta donde no debe verse
  useEffect(() => {
    if (!isVisible && showChat) {
      setShowChat(false);
    }
  }, [isVisible, showChat]);

  // No renderizar nada si no es visible
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {!showChat && <ChatbotButton onClick={() => setShowChat(true)} />}
      {showChat && <ChatbotPanel onClose={() => setShowChat(false)} />}
    </>
  );
}
