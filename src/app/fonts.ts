import localFont from "next/font/local";

export const samsungSharpSans = localFont({
  src: [
    {
      path: "../../public/fonts/samsungsharpsans.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/samsungsharpsans-medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/samsungsharpsans-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-samsung-sharp-sans",
  display: "swap",
});
