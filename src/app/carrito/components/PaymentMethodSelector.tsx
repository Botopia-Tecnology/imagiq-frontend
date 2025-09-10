"use client";
import Image from "next/image";
import visaLogo from "@/img/carrito/visa_logo.png";
import mastercardLogo from "@/img/carrito/masterdcard_logo.png";
import amexLogo from "@/img/carrito/amex_logo.png";
import dinersLogo from "@/img/carrito/logo4.png";
import { PaymentMethod } from "../types";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <div
      className="rounded-xl overflow-hidden mb-6"
      style={{
        boxShadow: "0 2px 8px #0001",
        background: "#F3F3F3",
        border: "1px solid #E5E5E5",
        padding: 0,
      }}
    >
      {/* Header with credit card option and logos */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E5E5",
        }}
      >
        <label className="flex items-center gap-2 m-0">
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === "tarjeta"}
            onChange={() => onMethodChange("tarjeta")}
            className="accent-blue-600 w-5 h-5"
          />
          <span className="font-medium text-black">Pago con tarjeta</span>
        </label>
        <span className="flex gap-3">
          <Image
            src={visaLogo}
            alt="Visa"
            width={40}
            height={24}
            style={{ objectFit: "contain" }}
          />
          <Image
            src={mastercardLogo}
            alt="Mastercard"
            width={40}
            height={24}
            style={{ objectFit: "contain" }}
          />
          <Image
            src={amexLogo}
            alt="Amex"
            width={40}
            height={24}
            style={{ objectFit: "contain" }}
          />
          <Image
            src={dinersLogo}
            alt="Diners"
            width={40}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </span>
      </div>
    </div>
  );
}
