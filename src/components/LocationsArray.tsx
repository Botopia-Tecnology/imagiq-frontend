/**
 * 📍 DATOS DE UBICACIONES DE TIENDAS SAMSUNG - IMAGIQ
 *
 * Archivo centralizado con todas las ubicaciones de tiendas Samsung
 * - Datos organizados por ciudades
 * - Información completa de contacto y horarios
 * - Coordenadas geográficas precisas
 * - Fácil mantenimiento y actualización
 */

// Store type definition
export type Store = {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  city: string;
  position: [number, number];
  mall?: string;
};

// Complete stores data for all locations
export const stores: Store[] = [
  // Bogotá
  {
    name: "Samsung Store Calle 116",
    address: "Calle 116 #15b-94",
    phone: "7441176 Ext 1093",
    email: "ses116@imagiq.co",
    hours:
      "Lunes-viernes 9:30 am - 6:00pm; Sábados 10:00 am - 5:00pm; Domingos y Festivos cerrado",
    city: "Bogotá",
    position: [4.701, -74.0426],
  },
  {
    name: "Samsung Store Centro Comercial Andino",
    address: "Carrera 11 # 82-71 Segundo piso al lado de Galeria Cano",
    phone: "7441176 Ext 1103",
    email: "sesandino@imagiq.co",
    hours:
      "Lunes a Jueves 10:00 am- 8:00 pm; Viernes a Sábado 10:00am - 9:00pm; Domingos y Festivo 12:00m - 6:00pm",
    city: "Bogotá",
    position: [4.6669, -74.0534],
    mall: "Centro Comercial Andino",
  },
  {
    name: "Samsung Store Centro Comercial Centro Mayor",
    address: "Cl. 38A Sur #34d-51 Primer piso al lado de Samsonite",
    phone: "7441176 Ext 1101",
    email: "sescentromayor@imagiq.co",
    hours:
      "Lunes a sábado 10:00am-8:00pm; Domingos y festivos de 10:00am-7:00pm",
    city: "Bogotá",
    position: [4.5718, -74.1374],
    mall: "Centro Comercial Centro Mayor",
  },
  {
    name: "Samsung Store Centro Comercial Gran Plaza Bosa",
    address: "Cl. 65 Sur #51 N° 78 H Frente a YOI",
    phone: "744 1176 Ext 1109",
    email: "sesgranplazabosa@imagiq.co",
    hours: "Lunes a Domingo 10:00am - 7:00pm",
    city: "Bogotá",
    position: [4.5355, -74.1847],
    mall: "Centro Comercial Gran Plaza Bosa",
  },
  {
    name: "Samsung Store Centro Comercial Hayuelos",
    address: "Cl. 20 # 82 - 52 Primer piso frente a Falabella y Starbucks",
    phone: "7441176 Ext 1077",
    email: "seshayuelos@imagiq.co",
    hours:
      "Lunes a Sábado 11:00am a 8:00pm; Domingos y Festivo 10:00am - 7:00pm",
    city: "Bogotá",
    position: [4.6681, -74.1335],
    mall: "Centro Comercial Hayuelos",
  },
  {
    name: "Samsung Store Centro Comercial Plaza Central",
    address: "Cra 65 # 11-50 Isla Primer piso al lado de Miniso",
    phone: "7441176 Ext 1099",
    email: "sesplazacentral@imagiq.co",
    hours:
      "Lunes a Sábado 10:00am - 8:00pm; Domingos y festivos 10:00am - 7:00pm",
    city: "Bogotá",
    position: [4.6282, -74.1064],
    mall: "Centro Comercial Plaza Central",
  },
  {
    name: "Samsung Store Centro Comercial Mallplaza (Calima)",
    address: "Avenida Cra 30 #19 Isla primer piso frente almacen BATA",
    phone: "7441176 Ext 1091",
    email: "sesmallplazabog@imagiq.co",
    hours: "Lunes a sábado 10:00am-8:00pm; Domingos y festivos 10:00am-7:00pm",
    city: "Bogotá",
    position: [4.6051, -74.0659],
    mall: "Centro Comercial Mallplaza",
  },
  {
    name: "Samsung Store Centro Comercial Multiplaza",
    address:
      "Calle 19 A # 72 - 57 Isla KA-09 Primer piso frente a Bosi y Chevignon",
    phone: "7441176 Ext 1079",
    email: "sesmultiplaza@imagiq.co",
    hours:
      "Lunes a Jueves 10:00am-8:00pm; Viernes a Sábado 10:00am - 9:00pm; Domingos 10:00am- 8:00pm",
    city: "Bogotá",
    position: [4.6419, -74.1115],
    mall: "Centro Comercial Multiplaza",
  },
  {
    name: "Samsung Store Centro Comercial Nuestro Bogotá",
    address:
      "Av. Carrera 86 # 55A - 75 Engativá Primer piso entrada principal frente a Miniso",
    phone: "745 1176 Ext 1107",
    email: "sesnuestrobogota@imagiq.co",
    hours: "Lunes a Sábado 11am-8:00pm; Domingo 10:00am-7:00pm",
    city: "Bogotá",
    position: [4.7056, -74.1439],
    mall: "Centro Comercial Nuestro Bogotá",
  },
  {
    name: "Samsung Store Centro Comercial Parque La Colina",
    address: "Cra 58D # 146 - 51. Local 256",
    phone: "7441176 Ext 1038",
    email: "sescolina@imagiq.co",
    hours:
      "Lunes a Jueves 10:00am- 9:00pm; Viernes a Sábado 10:00am - 9:00pm; Domingos y Festivos 10:00am-8:00pm",
    city: "Bogotá",
    position: [4.7532, -74.0645],
    mall: "Centro Comercial Parque La Colina",
  },
  {
    name: "Samsung Store Centro Comercial Plaza Imperial",
    address: "Avenida Cra 104 # 148-07 Isla Primer Piso frente a Koaj",
    phone: "7441176 Ext 1097",
    email: "sesplazaimperial@imagiq.co",
    hours:
      "Lunes a Jueves 10:00am-7:00pm; Viernes y Sábados 11:00am - 8:00pm; Domingos y festivos 10:00am a 7:00pm",
    city: "Bogotá",
    position: [4.7539, -74.1364],
    mall: "Centro Comercial Plaza Imperial",
  },
  {
    name: "Samsung Store Centro Comercial Santa Fe Bogotá",
    address:
      "Calle 185 No. 45 - 03 Isla primer piso plaza Francia frente a Jumbo",
    phone: "7441176 Ext 1044",
    email: "galaxystudio.sf@imagiq.co",
    hours:
      "Lunes a sábado de 10:00am-8:00pm; Domingos y festivos de 11:00am-7:00pm",
    city: "Bogotá",
    position: [4.7536, -74.0359],
    mall: "Centro Comercial Santa Fe",
  },
  {
    name: "Samsung Store Centro Comercial Tintal Plaza",
    address:
      "Cra. 86 # 6 - 37, Kennedy, Bogotá Primer piso por la entrada 4 al lado de la Isla de ETB",
    phone: "7441176 Ext 1032",
    email: "sestintal@imagiq.co",
    hours: "Lunes a Domingo 10:00am - 7:00pm",
    city: "Bogotá",
    position: [4.6475, -74.1609],
    mall: "Centro Comercial Tintal Plaza",
  },
  {
    name: "Samsung Store Centro Comercial Unicentro Bogotá",
    address: "Carrera 15 # 124 - 30, Primer piso Isla frente a MNG",
    phone: "7441176 Ext 1041",
    email: "sesunicentro@imagiq.co",
    hours:
      "Lunes a Jueves 10:00am - 8:00pm; Viernes y Sábados 10:00am - 9:00pm; Domingos 11:00am - 8:00pm",
    city: "Bogotá",
    position: [4.6951, -74.0306],
    mall: "Centro Comercial Unicentro",
  },

  // Bucaramanga
  {
    name: "Samsung Store Centro Comercial Cacique",
    address: "Transversal 93 N° 34 ­ 99 El Tejar. Local 432",
    phone: "7441176 Ext 1070",
    email: "sescacique@imagiq.co",
    hours:
      "Lunes a Sábado 10:00am - 8:00pm; Domingos y Festivos 10:00am-7:00pm",
    city: "Bucaramanga",
    position: [7.1193, -73.1227],
    mall: "Centro Comercial Cacique",
  },
  {
    name: "Samsung Store Centro Comercial Caracolí",
    address:
      "Carrera 27 # 29-145 Cañaveral Isla primer piso frente a Velez y Adidas",
    phone: "7441176 Ext 1074",
    email: "sescaracoli@imagiq.co",
    hours: "Lunes a Sábado 10:00am-8:00pm; Domingos 10:00am-7:00pm",
    city: "Bucaramanga",
    position: [7.1254, -73.1198],
    mall: "Centro Comercial Caracolí",
  },

  // Cali
  {
    name: "Samsung Store Centro Comercial Chipichape",
    address: "Cl. 38 Nte. #6N – 45 Segundo Piso diagonal a Toy Smart",
    phone: "7441176 Ext 1117",
    email: "seschipichape@imagiq.co",
    hours: "Lunes a Domingo 10:00am-7:00pm",
    city: "Cali",
    position: [3.483, -76.5001],
    mall: "Centro Comercial Chipichape",
  },
  {
    name: "Samsung Store Centro Comercial Jardín Plaza Cali",
    address: "Cra 98 # 16-200. L-161",
    phone: "7441176 Ext 1063",
    email: "sesjplazacali@imagiq.co",
    hours: "Lunes a Domingo 10:00am-8:00pm",
    city: "Cali",
    position: [3.3719, -76.542],
    mall: "Centro Comercial Jardín Plaza",
  },
  {
    name: "Samsung Store Centro Comercial Mallplaza Cali",
    address:
      "Calle 5ta No. 52-140, Cali, está ubicado en el Nivel 1, al lado de las escaleras eléctricas, frente a Ikea",
    phone: "7441176 Ext 1125",
    email: "sesmallplazacali@imagiq.co",
    hours: "Lunes a Domingo 10:00am-7:00pm",
    city: "Cali",
    position: [3.3617, -76.5297],
    mall: "Centro Comercial Mallplaza",
  },
  {
    name: "Samsung Store Centro Comercial Unicentro Cali",
    address: "Cra. 100 #5-169, Las Vegas local 112",
    phone: "7441176 Ext 1059",
    email: "sesunicali@imagiq.co",
    hours: "Lunes a Sábado 10:00am-7:00pm; Domingo y festivos 10:00am-7:00pm",
    city: "Cali",
    position: [3.3731, -76.5421],
    mall: "Centro Comercial Unicentro",
  },

  // Chía
  {
    name: "Samsung Store Centro Comercial Fontanar (Chía)",
    address: "Vía Chía Km 2.5 Cajicá . Local 223",
    phone: "7441176 Ext 1047",
    email: "sesfontanar@imagiq.co",
    hours:
      "Lunes a jueves 10:00am-8:00pm; Viernes y sábado 10:00am-9:00pm; Domingos y festivo 10:00am-8:00pm",
    city: "Chía",
    position: [4.8609, -74.0276],
    mall: "Centro Comercial Fontanar",
  },

  // Cúcuta
  {
    name: "Samsung Store Centro Comercial Jardín Plaza Cúcuta",
    address: "Anillo vial oriental # 13-70. L-11C",
    phone: "7441176 Ext 1080",
    email: "sesjplazacucuta@imagiq.co",
    hours:
      "Lunes a Viernes 10:00am - 8:00pm; Sábados 10:00am 8:00pm; Domingos y Festivos 11:00am - 8:00pm",
    city: "Cúcuta",
    position: [7.8939, -72.5078],
    mall: "Centro Comercial Jardín Plaza",
  },

  // Ibagué
  {
    name: "Samsung Store Centro Comercial La Estación",
    address: "Cl. 60 #12-2 23 Local 119",
    phone: "7441176 Ext 1055",
    email: "sesibague@imagiq.co",
    hours: "Lunes a sábado 10:00am-8:00pm; Domingos y festivos 11:00am-8:00pm",
    city: "Ibagué",
    position: [4.4389, -75.2322],
    mall: "Centro Comercial La Estación",
  },

  // Manizales
  {
    name: "Samsung Store Centro Comercial Fundadores",
    address:
      "Calle 33 b # 20 03 Isla lateral al Banco Davivienda frente a BigJhon",
    phone: "7441176 Ext 1095",
    email: "sesfundadores@imagiq.co",
    hours:
      "Lunes a Jueves 10:00am - 8:00pm; Viernes y Sábados 10:00am - 9:00pm; Domingos y Festivos 11:00am - 8:00pm",
    city: "Manizales",
    position: [5.0703, -75.5138],
    mall: "Centro Comercial Fundadores",
  },
];
