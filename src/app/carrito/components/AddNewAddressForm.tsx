"use client";
import { Direccion } from "@/types/user";
import React, { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AddNewAddressFormProps {
  onAddressAdded?: (address: Direccion) => void;
  onCancel?: () => void;
}

export default function AddNewAddressForm({
  onAddressAdded,
  onCancel,
}: AddNewAddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    linea_uno: "",
    ciudad: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.linea_uno.trim()) {
      newErrors.linea_uno = "La dirección es requerida";
    }

    if (!formData.ciudad || formData.ciudad === "0") {
      newErrors.codigo_dane = "Selecciona una ciudad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Encontrar el nombre de la ciudad basado en el código

      // Obtener email del usuario desde localStorage
      const userInfo = JSON.parse(localStorage.getItem("imagiq_user") || "{}");

      const response = await fetch(`${API_BASE_URL}/api/users/address/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userInfo.id || "",
          addressInfo: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar dirección");
      }
      const savedAddress: Direccion[] = await response.json();
      onAddressAdded?.(savedAddress[0]);

      // Limpiar formulario
      setFormData({
        linea_uno: "",
        ciudad: "",
      });
    } catch (error) {
      console.error("Error al agregar dirección:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCityChange = (codigo: string) => {
    setFormData((prev) => ({
      ...prev,
      ciudad: codigo,
    }));
    if (errors.codigo_dane) {
      setErrors((prev) => ({ ...prev, codigo_dane: "" }));
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Agregar nueva dirección
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección completa *
          </label>
          <input
            type="text"
            value={formData.linea_uno}
            onChange={(e) => handleInputChange("linea_uno", e.target.value)}
            placeholder="Ej: Calle 123 # 45-67, Apto 301"
            className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.linea_uno ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.linea_uno && (
            <p className="text-red-500 text-xs mt-1">{errors.linea_uno}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <select
            value={formData.ciudad}
            onChange={(e) => handleCityChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.codigo_dane ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Elige una ciudad --</option>
            <option value="50006000">ACACIAS</option>
            <option value="41006000">ACEVEDO</option>
            <option value="20011000">AGUACHICA</option>
            <option value="25001000">AGUA DE DIOS</option>
            <option value="85010000">AGUAZUL</option>
            <option value="20013000">AGUSTIN CODAZZI</option>
            <option value="41016000">AIPE</option>
            <option value="25035000">ANAPOIMA</option>
            <option value="76036000">ANDALUCIA</option>
            <option value="17042000">ANSERMA</option>
            <option value="05045000">APARTADO</option>
            <option value="66045000">APIA</option>
            <option value="68051000">ARATOCA</option>
            <option value="81001000">ARAUCA</option>
            <option value="25053000">ARBELAEZ</option>
            <option value="05055000">ARGELIA</option>
            <option value="63001000">ARMENIA</option>
            <option value="68077000">BARBOSA</option>
            <option value="68079000">BARICHARA</option>
            <option value="68081000">BARRANCABERMEJA</option>
            <option value="44078000">BARRANCAS</option>
            <option value="08001000">BARRANQUILLA</option>
            <option value="18094000">BELEN DE LOS ANDAQUIES</option>
            <option value="66088000">BELEN DE UMBRIA</option>
            <option value="05088000">BELLO</option>
            <option value="11001000">Bogota</option>
            <option value="25099000">BOJACA</option>
            <option value="76100000">BOLIVAR</option>
            <option value="20060000">BOSCONIA</option>
            <option value="68001000">Bucaramanga</option>
            <option value="76109000">BUENAVENTURA</option>
            <option value="76113000">BUGALAGRANDE</option>
            <option value="76122000">CAICEDONIA</option>
            <option value="73124000">CAJAMARCA</option>
            <option value="25126000">CAJICA</option>
            <option value="63130000">CALARCA</option>
            <option value="05129000">CALDAS</option>
            <option value="76001000">Cali</option>
            <option value="41132000">CAMPOALEGRE</option>
            <option value="76130000">CANDELARIA</option>
            <option value="25148000">CAPARRAPI</option>
            <option value="25151000">CAQUEZA</option>
            <option value="73148000">CARMEN DE APICALA</option>
            <option value="25154000">CARMEN DE CARUPA</option>
            <option value="13001000">CARTAGENA</option>
            <option value="18150000">CARTAGENA DEL CHAIRA</option>
            <option value="76147000">CARTAGO</option>
            <option value="50150000">CASTILLA LA NUEVA</option>
            <option value="05154000">CAUCASIA</option>
            <option value="23162000">CERETE</option>
            <option value="68167000">CHARALA</option>
            <option value="25175000">CHIA</option>
            <option value="05172000">CHIGORODO</option>
            <option value="23168000">CHIMA</option>
            <option value="54172000">CHINACOTA</option>
            <option value="17174000">CHINCHINA</option>
            <option value="25178000">CHIPAQUE</option>
            <option value="15176000">CHIQUINQUIRA</option>
            <option value="20178000">CHIRIGUANA</option>
            <option value="47189000">CIENAGA</option>
            <option value="23189000">CIENAGA DE ORO</option>
            <option value="63190000">CIRCASIA</option>
            <option value="76233004">CISNEROS</option>
            <option value="05101000">CIUDAD BOLIVAR</option>
            <option value="25200000">COGUA</option>
            <option value="05209000">CONCORDIA</option>
            <option value="05212000">COPACABANA</option>
            <option value="63212000">CORDOBA</option>
            <option value="19212000">CORINTO</option>
            <option value="70215000">COROZAL</option>
            <option value="15215000">CORRALES</option>
            <option value="25214000">COTA</option>
            <option value="50223000">CUBARRAL</option>
            <option value="25224000">CUCUNUBA</option>
            <option value="54001000">CUCUTA</option>
            <option value="54223000">CUCUTILLA</option>
            <option value="05237000">DON MATIAS</option>
            <option value="05591004">Doradal</option>
            <option value="66170000">DOSQUEBRADAS</option>
            <option value="15238000">DUITAMA</option>
            <option value="47245000">EL BANCO</option>
            <option value="76246000">EL CAIRO</option>
            <option value="13244000">EL CARMEN DE</option>
            <option value="05148000">EL CARMEN DE VIBORAL</option>
            <option value="76248000">EL CERRITO</option>
            <option value="25245000">EL COLEGIO</option>
            <option value="18247000">EL DONCELLO</option>
            <option value="20250000">EL PASO</option>
            <option value="25260000">EL ROSAL</option>
            <option value="52256000">EL ROSARIO</option>
            <option value="05266000">ENVIGADO</option>
            <option value="73268000">ESPINAL</option>
            <option value="25269000">FACATATIVA</option>
            <option value="63272000">FILANDIA</option>
            <option value="73275000">FLANDES</option>
            <option value="18001000">FLORENCIA</option>
            <option value="76275000">FLORIDA</option>
            <option value="68276000">FLORIDABLANCA</option>
            <option value="44279000">FONSECA</option>
            <option value="19532008">FREDONIA</option>
            <option value="47288000">FUNDACION</option>
            <option value="25286000">FUNZA</option>
            <option value="25290000">FUSAGASUGA</option>
            <option value="25293000">GACHALA</option>
            <option value="25295000">GACHANCIPA</option>
            <option value="08296000">GALAPA</option>
            <option value="20295000">GAMARRA</option>
            <option value="15299000">GARAGOA</option>
            <option value="41298000">GARZON</option>
            <option value="41306000">GIGANTE</option>
            <option value="25307000">GIRARDOT</option>
            <option value="05308000">GIRARDOTA</option>
            <option value="68307000">GIRON</option>
            <option value="50313000">GRANADA</option>
            <option value="76318000">GUACARI</option>
            <option value="25317000">GUACHETA</option>
            <option value="76111000">GUADALAJARA DE BUGA</option>
            <option value="25320000">GUADUAS</option>
            <option value="50318000">GUAMAL</option>
            <option value="70265000">GUARANDA</option>
            <option value="05318000">GUARNE</option>
            <option value="25322000">GUASCA</option>
            <option value="25326000">GUATAVITA</option>
            <option value="15322000">GUATEQUE</option>
            <option value="66318000">GUATICA</option>
            <option value="25328000">GUAYABAL DE SIQUIMA</option>
            <option value="85125000">HATO COROZAL</option>
            <option value="05353000">HISPANIA</option>
            <option value="73001000">Ibague</option>
            <option value="94001000">INIRIDA</option>
            <option value="52356000">IPIALES</option>
            <option value="41357000">IQUIRA</option>
            <option value="27361000">ISTMINA</option>
            <option value="05360000">ITAGUI</option>
            <option value="76364000">JAMUNDI</option>
            <option value="05364000">JARDIN</option>
            <option value="05368000">JERICO</option>
            <option value="08372000">JUAN DE ACOSTA</option>
            <option value="25377000">LA CALERA</option>
            <option value="05376000">LA CEJA</option>
            <option value="76377000">LA CUMBRE</option>
            <option value="17380000">LA DORADA</option>
            <option value="05380000">LA ESTRELLA</option>
            <option value="86865000">La hormiga</option>
            <option value="25386000">LA MESA</option>
            <option value="41396000">LA PLATA</option>
            <option value="52399000">LA UNION</option>
            <option value="25402000">LA VEGA</option>
            <option value="76403000">LA VICTORIA</option>
            <option value="66400000">LA VIRGINIA</option>
            <option value="68406000">LEBRIJA</option>
            <option value="73408000">LERIDA</option>
            <option value="91001000">LETICIA</option>
            <option value="73411000">LIBANO</option>
            <option value="23417000">LORICA</option>
            <option value="70418000">LOS PALMITOS</option>
            <option value="54405000">LOS PATIOS</option>
            <option value="05425000">MACEO</option>
            <option value="25426000">MACHETA</option>
            <option value="25430000">MADRID</option>
            <option value="13430000">MAGANGUE</option>
            <option value="44430000">MAICAO</option>
            <option value="68432000">MALAGA</option>
            <option value="08433000">MALAMBO</option>
            <option value="85139000">MANI</option>
            <option value="17001000">MANIZALES</option>
            <option value="17433000">MANZANARES</option>
            <option value="05440000">MARINILLA</option>
            <option value="73443000">MARIQUITA</option>
            <option value="05001000">MEDELLIN</option>
            <option value="25438000">MEDINA</option>
            <option value="73449000">MELGAR</option>
            <option value="15455000">MIRAFLORES</option>
            <option value="19455000">MIRANDA</option>
            <option value="66456000">MISTRATO</option>
            <option value="97001000">MITU</option>
            <option value="86001000">MOCOA</option>
            <option value="68464000">MOGOTES</option>
            <option value="13468000">MOMPOS</option>
            <option value="15469000">MONIQUIRA</option>
            <option value="23466000">MONTELIBANO</option>
            <option value="23001000">Monteria</option>
            <option value="85162000">MONTERREY</option>
            <option value="70473000">MORROA</option>
            <option value="25473000">MOSQUERA</option>
            <option value="25483000">NARIÑO</option>
            <option value="05490000">NECOCLI</option>
            <option value="17486000">NEIRA</option>
            <option value="41001000">NEIVA</option>
            <option value="15491000">NOBSA</option>
            <option value="54498000">OCANA</option>
            <option value="68500000">OIBA</option>
            <option value="15507000">OTANCHE</option>
            <option value="25513000">PACHO</option>
            <option value="17513000">PACORA</option>
            <option value="20517000">PAILITAS</option>
            <option value="15516000">PAIPA</option>
            <option value="08001000">PALMAR DE VARELA</option>
            <option value="76520000">PALMIRA</option>
            <option value="73520000">PALOCABILDO</option>
            <option value="54518000">PAMPLONA</option>
            <option value="25530000">PARATEBUENO</option>
            <option value="52001000">PASTO</option>
            <option value="85250000">PAZ DE ARIPORO</option>
            <option value="66001000">PEREIRA</option>
            <option value="15542000">PESCA</option>
            <option value="68547000">PIEDECUESTA</option>
            <option value="19548000">PIENDAMO</option>
            <option value="41548000">PITAL</option>
            <option value="41551000">PITALITO</option>
            <option value="73555000">PLANADAS</option>
            <option value="47555000">PLATO</option>
            <option value="19001000">POPAYAN</option>
            <option value="23570000">PUEBLO NUEVO</option>
            <option value="86568000">PUERTO ASIS</option>
            <option value="05579000">PUERTO BERRIO</option>
            <option value="15572000">PUERTO BOYACA</option>
            <option value="08638000">PUERTO COLOMBIA</option>
            <option value="50450000">PUERTO CONCORDIA</option>
            <option value="50568000">PUERTO GAITAN</option>
            <option value="50573000">PUERTO LOPEZ</option>
            <option value="05658000">PUERTO RICO</option>
            <option value="19573000">PUERTO TEJADA</option>
            <option value="05591000">PUERTO TRIUNFO</option>
            <option value="25594000">QUETAME</option>
            <option value="27001000">QUIBDO</option>
            <option value="63594000">QUIMBAYA</option>
            <option value="05604000">REMEDIOS</option>
            <option value="50606000">RESTREPO</option>
            <option value="05607000">RETIRO</option>
            <option value="25612000">RICAURTE</option>
            <option value="44001000">RIOHACHA</option>
            <option value="05615000">RIONEGRO</option>
            <option value="63594000">RIOSUCIO</option>
            <option value="41615000">RIVERA</option>
            <option value="76622000">ROLDANILLO</option>
            <option value="08638000">SABANALARGA</option>
            <option value="05631000">SABANETA</option>
            <option value="23660000">SAHAGUN</option>
            <option value="73671000">SALDANA</option>
            <option value="15646000">SAMACA</option>
            <option value="41668000">SAN AGUSTIN</option>
            <option value="20710000">SAN ALBERTO</option>
            <option value="23672000">SAN ANTERO</option>
            <option value="25645000">SAN ANTONIO DEL TEQUENDAMA</option>
            <option value="25658000">SAN FRANCISCO</option>
            <option value="68679000">SAN GIL</option>
            <option value="13654000">SAN JACINTO</option>
            <option value="95001000">SAN JOSE DEL GUAVIARE</option>
            <option value="44650000">SAN JUAN DEL CESAR</option>
            <option value="25662000">SAN JUAN DE RIO SECO</option>
            <option value="52687000">SAN LORENZO</option>
            <option value="05660000">SAN LUIS</option>
            <option value="50689000">SAN MARTIN</option>
            <option value="13670000">SAN PABLO</option>
            <option value="70717000">SAN PEDRO</option>
            <option value="47001000">SANTA MARTA</option>
            <option value="15686000">SANTANA</option>
            <option value="19698000">SANTANDER DE QUILICHAO</option>
            <option value="66682000">SANTA ROSA DE CABAL</option>
            <option value="05686000">SANTA ROSA DE OSOS</option>
            <option value="15693000">SANTA ROSA DE VITERBO</option>
            <option value="08685000">SANTO TOMAS</option>
            <option value="68689000">SAN VICENTE DE CHUCURI</option>
            <option value="18753000">SAN VICENTE DEL CAGUAN</option>
            <option value="81736000">SARAVENA</option>
            <option value="05736000">SEGOVIA</option>
            <option value="76736000">SEVILLA</option>
            <option value="25740000">SIBATE</option>
            <option value="54743000">SILOS</option>
            <option value="19743000">SILVIA</option>
            <option value="70001000">SINCELEJO</option>
            <option value="25754000">SOACHA</option>
            <option value="68755000">SOCORRO</option>
            <option value="15759000">SOGAMOSO</option>
            <option value="08758000">SOLEDAD</option>
            <option value="15761000">SOMONDOCO</option>
            <option value="05756000">SONSON</option>
            <option value="25758000">SOPO</option>
            <option value="68770000">SUAITA</option>
            <option value="25769000">SUBACHOQUE</option>
            <option value="25772000">SUESCA</option>
            <option value="17777000">SUPIA</option>
            <option value="25785000">TABIO</option>
            <option value="81794000">TAME</option>
            <option value="41791000">TARQUI</option>
            <option value="05792000">TARSO</option>
            <option value="85410000">TAURAMENA</option>
            <option value="41799000">TELLO</option>
            <option value="25799000">TENJO</option>
            <option value="15804000">TIBANA</option>
            <option value="54810000">TIBU</option>
            <option value="23807000">TIERRALTA</option>
            <option value="41807000">TIMANA</option>
            <option value="19807000">TIMBIO</option>
            <option value="15808000">TINJACA</option>
            <option value="25817000">TOCANCIPA</option>
            <option value="70823000">TOLU VIEJO</option>
            <option value="76823000">TORO</option>
            <option value="76834000">TULUA</option>
            <option value="52835000">TUMACO</option>
            <option value="15001000">TUNJA</option>
            <option value="52838000">TUQUERRES</option>
            <option value="13836000">TURBACO</option>
            <option value="05837000">TURBO</option>
            <option value="15835000">TURMEQUE</option>
            <option value="25841000">UBAQUE</option>
            <option value="05847000">URRAO</option>
            <option value="68855000">VALLE DE SAN JOSE</option>
            <option value="20001000">VALLEDUPAR</option>
            <option value="68861000">VELEZ</option>
            <option value="73861000">VENADILLO</option>
            <option value="05861000">VENECIA</option>
            <option value="25862000">VERGARA</option>
            <option value="05679004">VERSALLES</option>
            <option value="15407000">VILLA DE LEYVA</option>
            <option value="54874000">VILLA DEL ROSARIO</option>
            <option value="25843000">VILLA DE SAN DIEGO DE UBATE</option>
            <option value="73870000">VILLAHERMOSA</option>
            <option value="17873000">VILLAMARIA</option>
            <option value="85440000">VILLANUEVA</option>
            <option value="19845000">VILLA RICA</option>
            <option value="50001000">Villavicencio</option>
            <option value="25875000">VILLETA</option>
            <option value="25878000">VIOTA</option>
            <option value="17877000">VITERBO</option>
            <option value="05887000">YARUMAL</option>
            <option value="85001000">YOPAL</option>
            <option value="76892000">YUMBO</option>
            <option value="05895000">ZARAGOZA</option>
            <option value="76895000">ZARZAL</option>
            <option value="15897000">ZETAQUIRA</option>
            <option value="25899000">ZIPAQUIRA</option>
          </select>
          {errors.codigo_dane && (
            <p className="text-red-500 text-xs mt-1">{errors.codigo_dane}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Agregar dirección"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
