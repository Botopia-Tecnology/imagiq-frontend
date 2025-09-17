import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key no definida" }, { status: 500 });
    }

    // Prompt de contexto
    const contexto = "Eres un asistente virtual de la empresa Samsung experto en productos de tecnología y ayudas a los usuarios a elegir el mejor producto según sus necesidades. Ademas de ayudarle como asesor para rastrear sus pedidos o consultar informacion sobre su orden. Responde de manera breve, clara, amigable y profesional.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [
        {
          parts: [
            { text: contexto }, // Prompt de contexto
            { text: message },  // Mensaje del usuario
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error de Gemini:", errorText, "Body enviado:", body);
      return NextResponse.json({ error: "Error al comunicarse con Gemini", details: errorText }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ response: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No hay respuesta de Gemini." });
  } catch (error) {
    console.error("Error en el endpoint:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}