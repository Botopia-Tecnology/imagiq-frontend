export interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
}

export interface CorporateProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  features: string[];
  price?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: CorporateProduct[];
}

export interface ContactFormData {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  industry?: string;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

export interface SpecializedConsultationFormData {
  fullName: string;
  phone: string;
  company: string;
  email: string;
  solutionInterest: string[];
  message: string;
  acceptPrivacy: boolean;
  recaptchaToken: string | null;
}

export type SolutionInterestOption =
  | "mobile"
  | "electrodomesticos"
  | "pantallas"
  | "climatizacion";
