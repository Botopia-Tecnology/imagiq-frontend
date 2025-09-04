"use client";

export async function sendMessageToGemini(message: string) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Error al comunicarse con Gemini");
  }

  const data = await res.json();
  return data.response;
}