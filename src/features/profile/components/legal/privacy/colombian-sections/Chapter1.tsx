/**
 * @module Chapter1
 * @description Capítulo 1 de la Política Colombiana: Alcance de la Política
 */

import React from "react";

const Chapter1: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        CAPÍTULO 1: ALCANCE DE LA POLÍTICA
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">1.1 Objetivo y Alcance</h4>
          <p className="leading-relaxed">
            Establecer los criterios bajo los cuales Samsung realiza el tratamiento de la
            información personal que reposa en las bases de datos y en archivos físicos y
            electrónicos.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">1.2 Cumplimiento Normativo</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Artículo 15 y 20 de la Constitución Política</li>
            <li>Ley 1581 de 2012 sobre protección de datos personales</li>
            <li>Decretos reglamentarios, especialmente Capítulo 25 del Decreto 1074 de 2015</li>
            <li>Sentencia C-748 de 2011</li>
            <li>Disposiciones de la Superintendencia de Industria y Comercio</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">1.3 Responsable del Tratamiento</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Razón Social:</strong> Samsung Electronics Colombia S.A.</p>
            <p><strong>NIT:</strong> 830.028.931-5</p>
            <p><strong>Domicilio:</strong> Carrera 7 No. 113-43 Of. 607, Torre Samsung, Bogotá</p>
            <p><strong>Teléfono:</strong> (1) 4870707</p>
            <p><strong>Correo de Privacidad:</strong> <a href="mailto:tusdatos.co@samsung.com" className="text-blue-600 hover:underline">tusdatos.co@samsung.com</a></p>
            <p><strong>Página Web:</strong> <a href="https://www.samsung.com.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.samsung.com.co</a></p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">1.4 Titulares a Quienes Va Dirigida</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Empleados y colaboradores</li>
            <li>Clientes corporativos y personas naturales</li>
            <li>Usuarios finales</li>
            <li>Proveedores y contratistas</li>
            <li>Encargados de la información</li>
            <li>Cualquier titular vinculado con Samsung</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">1.5 Definiciones Clave</h4>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Autorización:</p>
              <p className="text-sm">Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Dato Personal:</p>
              <p className="text-sm">Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Tratamiento:</p>
              <p className="text-sm">Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chapter1;
