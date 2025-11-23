/**
 * Utilidades para cálculo de fechas y días hábiles en Colombia
 */

// Festivos de Colombia (fechas fijas y calculadas para varios años)
export function getColombianHolidays(year: number): Date[] {
  const holidays: Date[] = [];
  
  // Festivos fijos
  holidays.push(new Date(year, 0, 1));   // Año Nuevo
  holidays.push(new Date(year, 4, 1));   // Día del Trabajo
  holidays.push(new Date(year, 6, 20));  // Día de la Independencia
  holidays.push(new Date(year, 7, 7));   // Batalla de Boyacá
  holidays.push(new Date(year, 11, 8));  // Inmaculada Concepción
  holidays.push(new Date(year, 11, 25)); // Navidad
  
  // Festivos que dependen de la Semana Santa (calculados aproximadamente)
  // Para simplificar, usamos fechas aproximadas basadas en años comunes
  // En producción, sería mejor usar una librería o API de festivos
  const easterDates: Record<number, { month: number; day: number }> = {
    2024: { month: 2, day: 31 }, // 31 de marzo
    2025: { month: 3, day: 20 }, // 20 de abril
    2026: { month: 3, day: 5 },  // 5 de abril
    2027: { month: 2, day: 28 }, // 28 de marzo
    2028: { month: 3, day: 16 }, // 16 de abril
    2029: { month: 3, day: 1 },  // 1 de abril
  };
  
  const easter = easterDates[year];
  if (easter) {
    holidays.push(new Date(year, easter.month, easter.day - 3)); // Jueves Santo
    holidays.push(new Date(year, easter.month, easter.day - 2)); // Viernes Santo
    holidays.push(new Date(year, easter.month, easter.day + 43)); // Ascensión (43 días después)
    holidays.push(new Date(year, easter.month, easter.day + 64)); // Corpus Christi (64 días después)
    holidays.push(new Date(year, easter.month, easter.day + 71)); // Sagrado Corazón (71 días después)
  }
  
  return holidays;
}

// Verificar si una fecha es día hábil (lunes a viernes, no festivo)
export function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  // Excluir sábados (6) y domingos (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Verificar si es festivo
  const year = date.getFullYear();
  const holidays = getColombianHolidays(year);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();
  
  return !holidays.some(holiday => {
    return holiday.getFullYear() === dateYear &&
           holiday.getMonth() === dateMonth &&
           holiday.getDate() === dateDay;
  });
}

// Obtener el siguiente día hábil
export function getNextBusinessDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

// Calcular fecha agregando N días hábiles
export function addBusinessDays(startDate: Date, businessDays: number): Date {
  let currentDate = new Date(startDate);
  let daysAdded = 0;
  
  // Si la fecha de inicio es viernes o sábado, empezar el lunes siguiente
  const dayOfWeek = currentDate.getDay();
  if (dayOfWeek === 5) { // Viernes
    currentDate = getNextBusinessDay(currentDate); // Lunes siguiente
  } else if (dayOfWeek === 6) { // Sábado
    currentDate = getNextBusinessDay(currentDate); // Lunes siguiente
  }
  
  // Agregar días hábiles
  while (daysAdded < businessDays) {
    if (isBusinessDay(currentDate)) {
      daysAdded++;
    }
    if (daysAdded < businessDays) {
      currentDate = getNextBusinessDay(currentDate);
    }
  }
  
  return currentDate;
}

