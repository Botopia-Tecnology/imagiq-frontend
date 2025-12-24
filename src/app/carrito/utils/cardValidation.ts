import { CardData, CardErrors } from "../components/CreditCardForm";

export function validateCardFields(
  card: CardData,
  isAmex: boolean
): { errors: CardErrors; hasError: boolean } {
  const errors: CardErrors = {
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
    docNumber: "",
  };
  let hasError = false;

  // Validación robusta de número de tarjeta (16 dígitos, formateado con espacios)
  const num = card.number.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(num)) {
    if (!num) {
      errors.number = "Por favor ingresa el número de tu tarjeta (16 dígitos).";
    } else if (num.length < 16) {
      errors.number = `El número de tarjeta es demasiado corto (${num.length}/16). Ingresa los 16 dígitos.`;
    } else if (num.length > 16) {
      errors.number = `El número de tarjeta es demasiado largo (${num.length}/16). Elimina los dígitos extra.`;
    } else {
      errors.number = "El número de tarjeta debe contener solo números.";
    }
    hasError = true;
  } else {
    // Luhn check
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    // Permitir finalizar pago aunque el número no pase Luhn, pero mostrar advertencia
    if (sum % 10 !== 0) {
      errors.number =
        "Advertencia: El número de tarjeta no es válido. Verifica que los dígitos sean correctos o consulta con tu banco.";
      // No bloquea el pago, solo advierte
    }
  }

  // Validar mes
  if (!card.expiryMonth || !/^\d{1,2}$/.test(card.expiryMonth)) {
    errors.expiryMonth = "Por favor ingresa un mes válido (01-12).";
    hasError = true;
  } else {
    const month = Number(card.expiryMonth);
    if (month < 1 || month > 12) {
      errors.expiryMonth = "El mes debe estar entre 01 y 12.";
      hasError = true;
    }
  }

  // Validar año
  if (!card.expiryYear || !/^\d{4}$/.test(card.expiryYear)) {
    errors.expiryYear = "Por favor ingresa un año válido (4 dígitos).";
    hasError = true;
  }

  // Validar que la fecha no esté vencida (solo si ambos campos son válidos)
  if (
    card.expiryMonth &&
    card.expiryYear &&
    !/^\d{1,2}$/.test(card.expiryMonth) === false &&
    !/^\d{4}$/.test(card.expiryYear) === false
  ) {
    const month = Number(card.expiryMonth);
    const year = Number(card.expiryYear);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (month >= 1 && month <= 12) {
      if (
        year < currentYear ||
        (year === currentYear && month <= currentMonth)
      ) {
        errors.expiryMonth =
          "La tarjeta está vencida. Ingresa una fecha vigente.";
        errors.expiryYear =
          "La tarjeta está vencida. Ingresa una fecha vigente.";
        hasError = true;
      }
    }
  }

  // CVC: 3 dígitos para Visa/Mastercard, 4 para Amex
  if (isAmex) {
    if (!/^\d{4}$/.test(card.cvc.trim())) {
      errors.cvc =
        "Por favor ingresa el código de seguridad (CVC) de 4 dígitos para American Express.";
      hasError = true;
    }
  } else {
    if (!/^\d{3}$/.test(card.cvc.trim())) {
      errors.cvc =
        "Por favor ingresa el código de seguridad (CVC) de 3 dígitos.";
      hasError = true;
    }
  }

  return { errors, hasError };
}
