import { NextRequest, NextResponse } from "next/server";

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v17.0/837906702729239/messages";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || "";

interface WhatsAppMessageRequest {
  to: string;
  nombre: string;
  ordenId: string;
  numeroGuia: string;
  productos: string;
  fechaEntrega: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppMessageRequest = await request.json();
    let { to, nombre, ordenId, numeroGuia, productos, fechaEntrega } = body;

    // Validar que todos los campos requeridos estén presentes
    if (!to || !nombre || !ordenId || !numeroGuia || !productos || !fechaEntrega) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar límites de caracteres de WhatsApp (30 caracteres por parámetro)
    if (productos.length > 30) {
      productos = "tus productos";
    }

    if (fechaEntrega.length > 30) {
      fechaEntrega = "Próximamente";
    }

    // Construir el cuerpo del mensaje de WhatsApp
    const whatsappBody = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "pedido_confirmado",
        language: { code: "es" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: nombre },
              { type: "text", text: "compra" },
              { type: "text", text: numeroGuia },
              { type: "text", text: productos },
              { type: "text", text: fechaEntrega }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              { type: "text", text: `/tracking-service/${ordenId}` }
            ]
          }
        ]
      }
    };

    // Enviar el mensaje a WhatsApp
    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(whatsappBody)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error al enviar mensaje de WhatsApp:", responseData);
      return NextResponse.json(
        { success: false, error: "Error al enviar mensaje de WhatsApp", details: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje de WhatsApp enviado exitosamente",
      data: responseData
    });

  } catch (error) {
    console.error("Error en el endpoint de WhatsApp:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
