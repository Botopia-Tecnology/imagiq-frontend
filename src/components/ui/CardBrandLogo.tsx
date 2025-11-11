import React from "react";
import { CreditCard } from "lucide-react";
import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover, SiDinersclub } from "react-icons/si";

interface CardBrandLogoProps {
  brand: string | undefined;
  size?: "sm" | "md" | "lg";
}

const CardBrandLogo: React.FC<CardBrandLogoProps> = ({ brand, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-5",
    md: "w-11 h-6",
    lg: "w-14 h-8",
  };

  if (!brand) {
    return <CreditCard className={`${sizeClasses[size]} text-gray-400`} />;
  }

  const brandLower = brand.toLowerCase();

  // VISA
  if (brandLower.includes("visa")) {
    return <SiVisa className={`${sizeClasses[size]} text-[#1A1F71]`} />;
  }

  // Mastercard
  if (brandLower.includes("mastercard") || brandLower.includes("master")) {
    return <SiMastercard className={`${sizeClasses[size]} text-[#EB001B]`} />;
  }

  // American Express
  if (brandLower.includes("amex") || brandLower.includes("american")) {
    return <SiAmericanexpress className={`${sizeClasses[size]} text-[#006FCF]`} />;
  }

  // Discover
  if (brandLower.includes("discover")) {
    return <SiDiscover className={`${sizeClasses[size]} text-[#FF6000]`} />;
  }

  // Diners Club
  if (brandLower.includes("diners")) {
    return <SiDinersclub className={`${sizeClasses[size]} text-[#0079BE]`} />;
  }

  // Default fallback con nombre de marca
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-700 text-white text-xs font-bold px-2 rounded`}>
      {brand.substring(0, 4).toUpperCase()}
    </div>
  );
};

export default CardBrandLogo;
