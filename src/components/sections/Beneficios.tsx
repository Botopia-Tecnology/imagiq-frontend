// Sección de Beneficios - Samsung Style
import React from "react";
import Image from "next/image";
import ChieldCheck from "../../img/iconos/Chield_check_light.png";
import PackageCar from "../../img/iconos/package_car.png";
import PercentLight from "../../img/iconos/Percent_light.png";
import SettingLine from "../../img/iconos/Setting_line.png";
import IntercambioCel from "../../img/iconos/intercambio_cel.png";

const beneficios = [
  {
    icon: ChieldCheck,
    text: "1 Año de Garantía con Samsung Colombia",
  },
  {
    icon: PackageCar,
    text: "Envío gratis a nivel Nacional",
  },
  {
    icon: PercentLight,
    text: "0% de interés con bancos aliados",
  },
  {
    icon: SettingLine,
    text: "Samsung servicio técnico autorizado",
  },
  {
    icon: IntercambioCel,
    text: "Plan recambio",
  },
];

export default function Beneficios() {
  return (
    <section className="bg-white py-12 mb-10">
      <div className="max-w-10xl mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-8 text-[#0F2A4A]">
          Beneficios
        </h2>
        <div className="flex flex-wrap justify-center gap-18">
          {beneficios.map((b, i) => (
            <div key={i} className="flex flex-col items-center w-40">
              <div className="mb-3">
                <span
                  className="flex items-center justify-center rounded-full bg-[#0F2A4A]"
                  style={{ width: 78, height: 78 }}
                >
                  <Image
                    src={b.icon}
                    alt={b.text}
                    width={40}
                    height={40}
                    className="mx-auto"
                  />
                </span>
              </div>
              <span className="text-sm text-[#0F2A4A] text-center font-medium leading-tight">
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
