/**
 * @module ColombianPolicy
 * @description Política de Tratamiento de Información de Samsung Colombia
 */

import React from "react";
import Chapter1 from "./colombian-sections/Chapter1";
import Chapter2 from "./colombian-sections/Chapter2";
import Chapter3 from "./colombian-sections/Chapter3";
import Chapter45 from "./colombian-sections/Chapter45";

const ColombianPolicy: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-700">
      {/* Introducción */}
      <section>
        <p className="leading-relaxed">
          Samsung Electronics Colombia S.A. se compromete con el tratamiento legal y legítimo
          de datos personales, asegurando confidencialidad, integridad y disponibilidad conforme
          al régimen normativo colombiano.
        </p>
      </section>

      <Chapter1 />
      <Chapter2 />
      <Chapter3 />
      <Chapter45 />
    </div>
  );
};

export default ColombianPolicy;
