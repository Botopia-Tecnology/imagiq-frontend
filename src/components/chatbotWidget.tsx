"use client";
import { useState } from "react";
import ChatbotButton from "./chatbotButton";
import ChatbotPanel from "@/app/chatbot/chatbotPanel";

export default function ChatbotWidget() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {!showChat && <ChatbotButton onClick={() => setShowChat(true)} />}
      {showChat && <ChatbotPanel onClose={() => setShowChat(false)} />}
    </>
  );
}