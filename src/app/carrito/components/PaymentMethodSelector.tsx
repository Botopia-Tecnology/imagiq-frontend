"use client";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
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
          <span className="font-medium text-black">Tarjeta</span>
        </label>
        <div className="flex gap-3 items-center">
          <SiVisa className="w-11 h-6 text-[#1A1F71]" />
          <SiMastercard className="w-11 h-6 text-[#EB001B]" />
          <SiAmericanexpress className="w-11 h-6 text-[#006FCF]" />
        </div>
      </div>
    </div>
  );
}
