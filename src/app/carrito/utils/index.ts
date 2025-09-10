"use client";
import { AddiPaymentData } from "../types";

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
