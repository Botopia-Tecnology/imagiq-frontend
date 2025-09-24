import lavavajillasImg from "@/img/electrodomesticos/electrodomesticos4.png";
import refrigeradorImg from "@/img/electrodomesticos/electrodomesticos1.png";
import lavadoraImg from "@/img/electrodomesticos/electrodomesticos2.png";
import aspiradoraImg from "@/img/electrodomesticos/electrodomesticos3.png";
import microondasImg from "@/img/electrodomesticos/electrodomesticos4.png";
import { Category } from "../../components/CategorySlider";

export const applianceCategories: Category[] = [
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    subtitle: "",
    image: refrigeradorImg,
    href: "/productos/electrodomesticos?section=refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    subtitle: "",
    image: lavadoraImg,
    href: "/productos/electrodomesticos?section=lavadoras",
  },
  {
    id: "lavavajillas",
    name: "Lavavajillas",
    subtitle: "",
    image: lavavajillasImg,
    href: "/productos/electrodomesticos?section=lavavajillas",
  },
  {
    id: "microondas",
    name: "Microondas",
    subtitle: "",
    image: microondasImg,
    href: "/productos/electrodomesticos?section=microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    subtitle: "",
    image: aspiradoraImg,
    href: "/productos/electrodomesticos?section=aspiradoras",
  },
  {
    id: "aire-acondicionado",
    name: "Aire Acondicionado",
    subtitle: "",
    image: aspiradoraImg,
    href: "/productos/electrodomesticos?section=aire-acondicionado",
  },
];
