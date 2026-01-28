"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AgentProduct } from "@/services/chatbot.service";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
  products?: AgentProduct[];
}

interface ChatbotContextType {
  messages: ChatMessage[];
  sessionId: string | undefined;
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  setSessionId: (id: string) => void;
  clearChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hola, soy tu asistente virtual de Samsung Store. ¿En qué puedo ayudarte?",
    },
  ]);
  const [sessionId, setSessionIdState] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const setSessionId = (id: string) => {
    setSessionIdState(id);
  };

  const clearChat = () => {
    setMessages([
      {
        from: "bot",
        text: "Hola, soy tu asistente virtual de Samsung Store. ¿En qué puedo ayudarte?",
      },
    ]);
    setSessionIdState(undefined);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        sessionId,
        isOpen,
        addMessage,
        setSessionId,
        clearChat,
        openChat,
        closeChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
