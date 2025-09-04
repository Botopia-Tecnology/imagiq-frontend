"use client";

import MyPageSubHeader from "../../../components/MyPageSubHeader";
import Footer from "../../../components/Footer";
import { 
  ProductRegistrationSection,
  WhyRegisterSection
} from "../../../components/repair_service";

export default function ReservarRepararPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sub-header con pestañas */}
      <MyPageSubHeader />

      {/* Sección de registro de productos */}
      <ProductRegistrationSection />

      {/* ¿Por qué debo registrar mis productos? */}
      <WhyRegisterSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
