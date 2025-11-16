"use client";
import { AddiPaymentData, CardPaymentData, PsePaymentData } from "../types";
import { apiPost, apiGet } from "@/lib/api-client";

export async function payWithAddi(
  props: AddiPaymentData
): Promise<{ redirectUrl: string } | { error: string; message: string }> {
  try {
    const data = await apiPost<{ redirectUrl: string }>('/api/payments/addi/apply', props);
    return data;
  } catch (error) {
    console.error("Error initiating Addi payment:", error);
    if (error instanceof Error) {
      return { error: "payment_failed", message: error.message || "Failed to initiate Addi payment" };
    }
    return { error: "network_error", message: "Error de conexión al procesar el pago" };
  }
}

export async function payWithCard(
  props: CardPaymentData
): Promise<{ redirectionUrl: string } | { error: string; message: string }> {
  try {
    const data = await apiPost<{ redirectionUrl: string }>('/api/payments/epayco/credit-card', {
      ...props,
      dues: props.dues.trim() === "" ? "1" : props.dues,
    });
    return data;
  } catch (error) {
    console.error("Error processing card payment:", error);
    if (error instanceof Error) {
      return { error: "payment_failed", message: error.message || "Failed to process card payment" };
    }
    return { error: "network_error", message: "Error de conexión al procesar el pago" };
  }
}

// Nueva función para pagar con tarjeta guardada (token)
export async function payWithSavedCard(
  props: Omit<CardPaymentData, "cardNumber" | "cardExpMonth" | "cardExpYear" | "cardCvc"> & { cardId: string }
): Promise<{ redirectionUrl: string } | { error: string; message: string }> {
  try {
    const data = await apiPost<{ redirectionUrl: string }>('/api/payments/epayco/saved-card', {
      ...props,
      dues: props.dues.trim() === "" ? "1" : props.dues,
    });
    return data;
  } catch (error) {
    console.error("Error processing saved card payment:", error);
    if (error instanceof Error) {
      return { error: "payment_failed", message: error.message || "Failed to process saved card payment" };
    }
    return { error: "network_error", message: "Error de conexión al procesar el pago" };
  }
}

export async function payWithPse(props: PsePaymentData): Promise<{ redirectUrl: string } | { error: string; message: string }> {
  try {
    const data = await apiPost<{ redirectUrl: string }>('/api/payments/epayco/pse', props);
    return data;
  } catch (error) {
    console.error("Error processing PSE payment:", error);
    if (error instanceof Error) {
      return { error: "payment_failed", message: error.message || "Failed to process PSE payment" };
    }
    return { error: "network_error", message: "Error de conexión al procesar el pago" };
  }
}

export async function fetchBanks() {
  try {
    const data = await apiGet('/api/payments/epayco/banks');
    return data;
  } catch (error) {
    // Provide detailed error information for debugging
    if (error instanceof Error) {
      console.error('API error fetching banks:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Unknown error fetching banks:', {
        error,
        timestamp: new Date().toISOString(),
      });
    }
    throw error;
  }
}
