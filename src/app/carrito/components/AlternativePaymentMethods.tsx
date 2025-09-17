"use client";
import Image from "next/image";
import addiLogo from "@/img/carrito/addi_logo.png";
import { PaymentMethod } from "../types";
import { useEffect, useState } from "react";
import { fetchBanks } from "../utils";

// Lista de bancos disponibles para PSE en Colombia
interface AlternativePaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: PaymentMethod) => void;
  selectedBank?: string;
  onBankChange?: (bank: string) => void;
}

export default function AlternativePaymentMethods({
  selectedMethod,
  onMethodChange,
  selectedBank,
  onBankChange,
}: AlternativePaymentMethodsProps) {
  const [banks, setBanks] = useState<{ bankCode: string; bankName: string }[]>(
    []
  );
  useEffect(() => {
    fetchBanks().then((res) => {
      setBanks(res)
    })
  }, [])
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

      {/* Bank selector for PSE */}
      {selectedMethod === "pse" && (
        <div className="ml-7 mt-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona tu banco
          </label>
          <select
            value={selectedBank || ""}
            onChange={(e) => onBankChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required={selectedMethod === "pse"}
          >
            <option value="">Elige tu banco...</option>
            {banks.map((bank) => (
              <option key={bank.bankCode} value={bank.bankCode}>
                {bank.bankName}
              </option>
            ))}
          </select>
        </div>
      )}

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
