"use client";
import Image from "next/image";
import addiLogo from "@/img/carrito/addi_logo.png";
import { PaymentMethod } from "../types";

interface AlternativePaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: PaymentMethod) => void;
}

export default function AlternativePaymentMethods({
  selectedMethod,
  onMethodChange,
}: AlternativePaymentMethodsProps) {
  return (
    <div
      className="px-6 pb-2 flex flex-col gap-2"
      style={{ background: "#fff" }}
    >
      {/* PSE Option */}
      <label className="flex items-center gap-2 mt-4">
        <input
          type="radio"
          name="payment"
          checked={selectedMethod === "pse"}
          onChange={() => onMethodChange("pse")}
          className="accent-blue-600 w-5 h-5"
        />
        <span className="font-medium text-black">PSE</span>
      </label>

      {/* Addi Option */}
      <label className="flex items-center gap-2 justify-between">
        <span className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === "addi"}
            onChange={() => onMethodChange("addi")}
            className="accent-blue-600 w-5 h-5"
          />
          <span className="font-medium text-black">Addi - Paga después</span>
        </span>
        <span
          className="flex items-center justify-center bg-white rounded-full"
          style={{
            width: 54,
            height: 54,
            border: "2px solid #111",
            boxSizing: "border-box",
            padding: 0,
            marginRight: 0,
            background: "#fff",
          }}
        >
          <Image
            src={addiLogo}
            alt="Addi"
            width={38}
            height={38}
            style={{
              objectFit: "contain",
              filter: "invert(0) brightness(0) saturate(100%)",
            }}
          />
        </span>
      </label>
    </div>
  );
}
