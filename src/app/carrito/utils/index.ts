"use client";
import { AddiPaymentData, CardPaymentData, PsePaymentData } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function payWithAddi(
  props: AddiPaymentData
): Promise<{ redirectUrl: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/addi/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });
    if (!res.ok) {
      throw new Error("Failed to initiate Addi payment");
    }
    const data = (await res.json()) as { redirectUrl: string };
    return data;
  } catch (error) {
    console.error("Error initiating Addi payment:", error);
    return null;
  }
}

export async function payWithCard(
  props: CardPaymentData
): Promise<{ redirectionUrl: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/epayco/credit-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...props,
        dues: props.dues.trim() === "" ? "1" : props.dues,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to process card payment");
    }
    const data = (await res.json()) as { redirectionUrl: string };
    return data;
  } catch (error) {
    console.error("Error processing card payment:", error);
    return null;
  }
}

export async function payWithPse(props: PsePaymentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/epayco/pse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(props),
    });
    if (!res.ok) {
      throw new Error("Failed to process PSE payment");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error processing PSE payment:", error);
    return null;
  }
}

export async function fetchBanks() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/epayco/banks`);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status} - ${res.statusText}: ${errorText || 'No additional error details'}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Provide detailed error information for debugging
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error fetching banks - API server may be down:', {
        url: `${API_BASE_URL}/api/payments/epayco/banks`,
        error: error.message,
        timestamp: new Date().toISOString(),
        apiBaseUrl: API_BASE_URL
      });
      throw new Error(`Network error: Cannot connect to API server at ${API_BASE_URL}. Please check if the microservice is running.`);
    } else if (error instanceof Error) {
      console.error('API error fetching banks:', {
        message: error.message,
        url: `${API_BASE_URL}/api/payments/epayco/banks`,
        timestamp: new Date().toISOString(),
        apiBaseUrl: API_BASE_URL
      });
      throw error;
    } else {
      console.error('Unknown error fetching banks:', {
        error,
        url: `${API_BASE_URL}/api/payments/epayco/banks`,
        timestamp: new Date().toISOString(),
        apiBaseUrl: API_BASE_URL
      });
      throw new Error('Unknown error occurred while fetching banks');
    }
  }
}
