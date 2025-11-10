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

export const getRandomColor = () => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

export const getFirstName = (fullName: string) => {
  return fullName.split(" ")[0];
};

export const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

export const GOOGLE_REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJz-9BQ5qaP44Rw2bfo6bHRLo&q=*&authuser=0&hl=en&gl=US";
