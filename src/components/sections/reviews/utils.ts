/**
 * Utilidades para el componente de Reviews
 */

export const AVATAR_COLORS = [
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-orange-500 text-white",
  "bg-teal-500 text-white",
  "bg-indigo-500 text-white",
  "bg-red-500 text-white",
] as const;

// Función hash simple para generar un índice determinista basado en un string
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  return Math.abs(hash);
};

export const getColorFromId = (id: string) => {
  const index = hashString(id) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const getFirstName = (fullName: string) => {
  return fullName.split(" ")[0];
};

export const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

export const GOOGLE_REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJz-9BQ5qaP44Rw2bfo6bHRLo&q=*&authuser=0&hl=en&gl=US";
