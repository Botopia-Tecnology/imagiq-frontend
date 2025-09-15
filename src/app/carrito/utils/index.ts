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

export async function payWithCard(props: CardPaymentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/epayco/credit-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });
    if (!res.ok) {
      throw new Error("Failed to process card payment");
    }
    const data = await res.json();
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
      throw new Error("Failed to fetch banks");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    return [];
  }
}
