/**
 * Datos de Dispositivos Usados Aplicables
 * Promoción: Entrego y Estreno
 * Vigencia: 1 de noviembre de 2025 hasta el 30 de noviembre de 2025
 *
 * Valores de retoma según el modelo y estado (grado) del equipo usado.
 * Fuente: 20251115T&C_Entrego_y_Estreno_iMagiQ.pdf - Anexo 1
 */

export interface DispositivoUsado {
  modelo: string;
  categoria: "Smartphone" | "SmartWatch" | "Tablet";
  gradoPerfecto: string;
  gradoDeteriorado: string;
  gradoMalo: string;
}

export const dispositivosUsados: DispositivoUsado[] = [
  // SMARTPHONES - Parte 1: Apple iPhone y Samsung Galaxy
  {
    modelo: "Apple Iphone 16 Pro 1024GB",
    categoria: "Smartphone",
    gradoPerfecto: "3,073,200.00",
    gradoDeteriorado: "491,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Pro Max 1024GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,994,400.00",
    gradoDeteriorado: "479,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,947,100.00",
    gradoDeteriorado: "471,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Pro Max 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,836,800.00",
    gradoDeteriorado: "453,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,742,200.00",
    gradoDeteriorado: "438,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Pro Max 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,690,200.00",
    gradoDeteriorado: "430,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,460,900.00",
    gradoDeteriorado: "393,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,442,800.00",
    gradoDeteriorado: "390,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro Max 1024GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,334,800.00",
    gradoDeteriorado: "317,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,293,900.00",
    gradoDeteriorado: "367,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,215,900.00",
    gradoDeteriorado: "354,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold6 5G 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "2,184,900.00",
    gradoDeteriorado: "279,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro Max 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,133,800.00",
    gradoDeteriorado: "293,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro 1024GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,113,900.00",
    gradoDeteriorado: "275,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold6 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,055,600.00",
    gradoDeteriorado: "267,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,045,600.00",
    gradoDeteriorado: "327,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,029,100.00",
    gradoDeteriorado: "324,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro Max 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "2,023,800.00",
    gradoDeteriorado: "303,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "2,003,400.00",
    gradoDeteriorado: "268,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro Max 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,985,100.00",
    gradoDeteriorado: "277,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16e 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,970,000.00",
    gradoDeteriorado: "315,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold6 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,930,300.00",
    gradoDeteriorado: "250,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 Ultra 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,925,600.00",
    gradoDeteriorado: "288,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,917,500.00",
    gradoDeteriorado: "261,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro Max 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,903,900.00",
    gradoDeteriorado: "285,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 Ultra 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,869,700.00",
    gradoDeteriorado: "280,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,859,700.00",
    gradoDeteriorado: "254,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 Ultra 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,841,900.00",
    gradoDeteriorado: "276,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,784,000.00",
    gradoDeteriorado: "285,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro Max 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,751,200.00",
    gradoDeteriorado: "262,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,705,300.00",
    gradoDeteriorado: "255,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,694,400.00",
    gradoDeteriorado: "254,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,651,200.00",
    gradoDeteriorado: "247,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro Max 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,650,700.00",
    gradoDeteriorado: "247,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,647,300.00",
    gradoDeteriorado: "247,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,647,300.00",
    gradoDeteriorado: "247,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 Ultra 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,631,800.00",
    gradoDeteriorado: "244,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 6 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,631,400.00",
    gradoDeteriorado: "226,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,624,100.00",
    gradoDeteriorado: "243,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,622,900.00",
    gradoDeteriorado: "243,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 6 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,589,200.00",
    gradoDeteriorado: "206,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 Ultra 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,584,600.00",
    gradoDeteriorado: "237,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 Ultra 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,560,900.00",
    gradoDeteriorado: "234,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,522,400.00",
    gradoDeteriorado: "228,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,518,300.00",
    gradoDeteriorado: "240,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16e 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,516,900.00",
    gradoDeteriorado: "242,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 6 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,466,900.00",
    gradoDeteriorado: "190,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,458,900.00",
    gradoDeteriorado: "233,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,445,200.00",
    gradoDeteriorado: "216,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,434,600.00",
    gradoDeteriorado: "185,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,421,900.00",
    gradoDeteriorado: "186,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S25 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,412,500.00",
    gradoDeteriorado: "182,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO MAX 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,408,900.00",
    gradoDeteriorado: "188,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,399,400.00",
    gradoDeteriorado: "209,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,376,400.00",
    gradoDeteriorado: "206,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,376,300.00",
    gradoDeteriorado: "218,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO MAX 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,350,300.00",
    gradoDeteriorado: "181,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,316,400.00",
    gradoDeteriorado: "211,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO MAX 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,293,100.00",
    gradoDeteriorado: "174,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 16e 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,260,800.00",
    gradoDeteriorado: "201,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 ULTRA 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,258,200.00",
    gradoDeteriorado: "175,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 15 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,257,100.00",
    gradoDeteriorado: "204,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 ULTRA 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,241,900.00",
    gradoDeteriorado: "168,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,237,300.00",
    gradoDeteriorado: "167,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO MAX 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,236,700.00",
    gradoDeteriorado: "167,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 ULTRA 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,212,000.00",
    gradoDeteriorado: "161,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,176,700.00",
    gradoDeteriorado: "240,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,160,400.00",
    gradoDeteriorado: "160,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,132,200.00",
    gradoDeteriorado: "148,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,129,500.00",
    gradoDeteriorado: "233,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,117,700.00",
    gradoDeteriorado: "153,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold5 5G 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,100,000.00",
    gradoDeteriorado: "142,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,082,500.00",
    gradoDeteriorado: "225,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 PLUS 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,053,600.00",
    gradoDeteriorado: "143,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 PRO MAX 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,049,800.00",
    gradoDeteriorado: "136,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 PLUS 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,038,000.00",
    gradoDeteriorado: "136,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,035,400.00",
    gradoDeteriorado: "155,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,035,400.00",
    gradoDeteriorado: "162,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold5 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,031,500.00",
    gradoDeteriorado: "130,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,028,100.00",
    gradoDeteriorado: "133,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold4 5G 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "1,016,400.00",
    gradoDeteriorado: "137,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 PLUS 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "1,008,200.00",
    gradoDeteriorado: "128,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 14 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "996,400.00",
    gradoDeteriorado: "149,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold5 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "990,000.00",
    gradoDeteriorado: "128,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 PRO 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "978,400.00",
    gradoDeteriorado: "127,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "976,000.00",
    gradoDeteriorado: "125,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold4 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "974,200.00",
    gradoDeteriorado: "136,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 FE 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "960,000.00",
    gradoDeteriorado: "129,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 PRO MAX 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "954,000.00",
    gradoDeteriorado: "124,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S22 ULTRA 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "941,200.00",
    gradoDeteriorado: "141,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold4 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "931,800.00",
    gradoDeteriorado: "135,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S22 ULTRA 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "916,900.00",
    gradoDeteriorado: "127,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 PRO 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "912,900.00",
    gradoDeteriorado: "118,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "908,600.00",
    gradoDeteriorado: "136,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S22 ULTRA 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "907,500.00",
    gradoDeteriorado: "120,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 PRO MAX 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "902,900.00",
    gradoDeteriorado: "117,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "902,800.00",
    gradoDeteriorado: "117,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 FE 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "894,700.00",
    gradoDeteriorado: "134,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S22 ULTRA 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "894,200.00",
    gradoDeteriorado: "134,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "885,200.00",
    gradoDeteriorado: "132,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "883,500.00",
    gradoDeteriorado: "114,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S24 FE 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "871,700.00",
    gradoDeteriorado: "130,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "850,600.00",
    gradoDeteriorado: "127,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S23 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "849,400.00",
    gradoDeteriorado: "110,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 MINI 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "838,600.00",
    gradoDeteriorado: "125,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 5 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "827,700.00",
    gradoDeteriorado: "106,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 PRO 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "813,200.00",
    gradoDeteriorado: "105,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 5 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "804,400.00",
    gradoDeteriorado: "104,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 MINI 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "792,000.00",
    gradoDeteriorado: "118,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 PRO 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "789,100.00",
    gradoDeteriorado: "102,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 13 MINI 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "745,400.00",
    gradoDeteriorado: "111,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S22 5G Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "677,200.00",
    gradoDeteriorado: "89,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G Ultra 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "659,100.00",
    gradoDeteriorado: "85,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G Ultra 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "658,800.00",
    gradoDeteriorado: "85,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 12 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "654,900.00",
    gradoDeteriorado: "85,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G Ultra 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "642,600.00",
    gradoDeteriorado: "83,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "641,500.00",
    gradoDeteriorado: "83,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 PRO MAX 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "639,000.00",
    gradoDeteriorado: "83,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S22 5G Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "637,100.00",
    gradoDeteriorado: "82,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold3 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "620,300.00",
    gradoDeteriorado: "80,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold3 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "612,500.00",
    gradoDeteriorado: "79,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 PRO MAX 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "593,400.00",
    gradoDeteriorado: "77,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "591,000.00",
    gradoDeteriorado: "76,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Note 20 5G Ultra 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "584,500.00",
    gradoDeteriorado: "80,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S22 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "571,400.00",
    gradoDeteriorado: "78,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Note 20 5G Ultra 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "568,200.00",
    gradoDeteriorado: "73,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Note 20 5G Ultra 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "568,200.00",
    gradoDeteriorado: "73,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Note 20 Ultra 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "568,200.00",
    gradoDeteriorado: "73,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY NOTE 20 ULTRA 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "568,200.00",
    gradoDeteriorado: "73,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S22 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "559,200.00",
    gradoDeteriorado: "71,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 PRO 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "549,400.00",
    gradoDeteriorado: "71,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY Z FLIP 4 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "526,500.00",
    gradoDeteriorado: "68,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 64GB",
    categoria: "Smartphone",
    gradoPerfecto: "525,000.00",
    gradoDeteriorado: "68,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold2 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "522,800.00",
    gradoDeteriorado: "68,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 50 Ultra 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "520,100.00",
    gradoDeteriorado: "55,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Xiaomi 14T Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "515,700.00",
    gradoDeteriorado: "67,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Fold2 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "515,100.00",
    gradoDeteriorado: "67,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY Z FLIP 4 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "514,900.00",
    gradoDeteriorado: "66,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 PRO 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "513,000.00",
    gradoDeteriorado: "66,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY Z FLIP 4 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "502,200.00",
    gradoDeteriorado: "65,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 11 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "502,100.00",
    gradoDeteriorado: "65,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 PRO MAX 64GB",
    categoria: "Smartphone",
    gradoPerfecto: "502,100.00",
    gradoDeteriorado: "65,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 MINI 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "502,100.00",
    gradoDeteriorado: "65,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Xiaomi 14T 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "500,200.00",
    gradoDeteriorado: "65,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S23 FE 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "493,700.00",
    gradoDeteriorado: "109,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 50 Ultra 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "492,900.00",
    gradoDeteriorado: "52,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "485,100.00",
    gradoDeteriorado: "60,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 50 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "481,300.00",
    gradoDeteriorado: "58,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "479,300.00",
    gradoDeteriorado: "62,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 MINI 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "479,300.00",
    gradoDeteriorado: "62,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 40 Ultra 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "472,700.00",
    gradoDeteriorado: "47,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S23 FE 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "470,900.00",
    gradoDeteriorado: "102,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 40 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "470,500.00",
    gradoDeteriorado: "43,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "456,400.00",
    gradoDeteriorado: "59,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S23 FE 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "454,200.00",
    gradoDeteriorado: "95,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 50 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "450,100.00",
    gradoDeteriorado: "54,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G Plus 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "436,700.00",
    gradoDeteriorado: "56,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S21 PLUS 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "436,700.00",
    gradoDeteriorado: "56,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 12 MINI 64GB",
    categoria: "Smartphone",
    gradoPerfecto: "433,500.00",
    gradoDeteriorado: "56,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 40 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "433,300.00",
    gradoDeteriorado: "42,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Razr 40 Ultra 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "433,300.00",
    gradoDeteriorado: "43,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY NOTE 20 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "415,700.00",
    gradoDeteriorado: "55,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Iphone 11 Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "410,700.00",
    gradoDeteriorado: "53,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 ULTRA 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "410,700.00",
    gradoDeteriorado: "53,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 PRO 64GB",
    categoria: "Smartphone",
    gradoPerfecto: "398,200.00",
    gradoDeteriorado: "51,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno12 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "388,100.00",
    gradoDeteriorado: "46,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 ULTRA 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "388,000.00",
    gradoDeteriorado: "50,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei P60 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "385,400.00",
    gradoDeteriorado: "50,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor Magic7Lite 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "383,000.00",
    gradoDeteriorado: "46,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A56 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "370,800.00",
    gradoDeteriorado: "37,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 FE 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "368,700.00",
    gradoDeteriorado: "48,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 ULTRA 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "365,200.00",
    gradoDeteriorado: "47,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 200 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "349,300.00",
    gradoDeteriorado: "38,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A56 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "347,600.00",
    gradoDeteriorado: "34,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "APPLE IPHONE 11 64GB",
    categoria: "Smartphone",
    gradoPerfecto: "343,300.00",
    gradoDeteriorado: "44,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 PLUS 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "342,400.00",
    gradoDeteriorado: "44,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "339,600.00",
    gradoDeteriorado: "44,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 FE 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "339,600.00",
    gradoDeteriorado: "44,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 3 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "333,500.00",
    gradoDeteriorado: "43,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei P60 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "328,700.00",
    gradoDeteriorado: "42,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy S21 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "320,200.00",
    gradoDeteriorado: "41,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 PLUS 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "319,500.00",
    gradoDeteriorado: "41,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno12F 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "319,100.00",
    gradoDeteriorado: "37,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 3 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "318,000.00",
    gradoDeteriorado: "41,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A54 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "317,000.00",
    gradoDeteriorado: "34,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Edge 50 Ultra 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "315,100.00",
    gradoDeteriorado: "31,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi 10 t",
    categoria: "Smartphone",
    gradoPerfecto: "313,200.00",
    gradoDeteriorado: "40,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno11 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "310,500.00",
    gradoDeteriorado: "37,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 11F 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "309,600.00",
    gradoDeteriorado: "37,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 Pro Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "305,100.00",
    gradoDeteriorado: "36,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A54 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "298,200.00",
    gradoDeteriorado: "38,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 PLUS 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "291,100.00",
    gradoDeteriorado: "35,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 FE 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "277,800.00",
    gradoDeteriorado: "36,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Edge 50 Pro 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "275,700.00",
    gradoDeteriorado: "33,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 FE 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "273,900.00",
    gradoDeteriorado: "35,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor Magic6 Lite 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "271,700.00",
    gradoDeteriorado: "32,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Xiaomi 12 Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "271,700.00",
    gradoDeteriorado: "35,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A55 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "270,700.00",
    gradoDeteriorado: "26,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A55 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "259,500.00",
    gradoDeteriorado: "23,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei P60 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "249,100.00",
    gradoDeteriorado: "33,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei P60 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "249,100.00",
    gradoDeteriorado: "33,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei P60 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "249,100.00",
    gradoDeteriorado: "33,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Xiaomi 11T Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "248,800.00",
    gradoDeteriorado: "32,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY S20 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "242,600.00",
    gradoDeteriorado: "29,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto Edge50 Neo 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "240,000.00",
    gradoDeteriorado: "28,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A35 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "238,100.00",
    gradoDeteriorado: "23,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A35 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "238,100.00",
    gradoDeteriorado: "23,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A53 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "238,100.00",
    gradoDeteriorado: "27,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor X8C 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "237,700.00",
    gradoDeteriorado: "32,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Edge 50 Fusion 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "236,300.00",
    gradoDeteriorado: "28,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "228,800.00",
    gradoDeteriorado: "27,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY A73 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "226,600.00",
    gradoDeteriorado: "29,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY A73 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "226,600.00",
    gradoDeteriorado: "29,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 9 Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "226,000.00",
    gradoDeteriorado: "30,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 9 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "226,000.00",
    gradoDeteriorado: "30,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 10 Pro Plus 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "223,200.00",
    gradoDeteriorado: "26,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A53 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "215,200.00",
    gradoDeteriorado: "28,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor X8B 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "214,200.00",
    gradoDeteriorado: "25,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 90 Lite 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "206,600.00",
    gradoDeteriorado: "19,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 90 Lite 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "206,600.00",
    gradoDeteriorado: "19,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 Pro+ 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "205,200.00",
    gradoDeteriorado: "27,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor X8C 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "204,400.00",
    gradoDeteriorado: "21,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY A72 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "200,900.00",
    gradoDeteriorado: "26,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY A72 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "200,900.00",
    gradoDeteriorado: "26,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Poco F3 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "200,000.00",
    gradoDeteriorado: "25,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Poco F3 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "200,000.00",
    gradoDeteriorado: "25,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "196,900.00",
    gradoDeteriorado: "23,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Xiaomi Redmi Note 12 Turbo 1TB",
    categoria: "Smartphone",
    gradoPerfecto: "195,400.00",
    gradoDeteriorado: "26,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 200 Lite 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "25,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 200SMART 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "25,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 90 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "18,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor 90 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "18,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor Magic 6 Lite 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "18,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 10 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "26,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 10 Pro Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "26,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Xiaomi 12 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "194,000.00",
    gradoDeteriorado: "25,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "12x 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "186,100.00",
    gradoDeteriorado: "23,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "12x 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "186,100.00",
    gradoDeteriorado: "23,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Poco F3 GT 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "186,100.00",
    gradoDeteriorado: "23,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Poco F3 GT 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "186,100.00",
    gradoDeteriorado: "23,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A34 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "185,400.00",
    gradoDeteriorado: "24,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI 12 PRO 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "185,200.00",
    gradoDeteriorado: "24,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "MOTOROLA EDGE 30 PRO 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "180,000.00",
    gradoDeteriorado: "23,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Motorola Edge 30 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "180,000.00",
    gradoDeteriorado: "23,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Motorola Edge 30 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "180,000.00",
    gradoDeteriorado: "23,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A16 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "179,900.00",
    gradoDeteriorado: "11,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A16 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "179,900.00",
    gradoDeteriorado: "11,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI REDMI NOTE 12 PRO 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "176,700.00",
    gradoDeteriorado: "23,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI 12 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "173,300.00",
    gradoDeteriorado: "22,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Edge 40 neo 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "172,800.00",
    gradoDeteriorado: "22,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "GALAXY M54 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "170,600.00",
    gradoDeteriorado: "22,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "GALAXY M54 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "170,600.00",
    gradoDeteriorado: "22,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI REDMI NOTE 12 PRO 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "170,200.00",
    gradoDeteriorado: "22,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei Mate 50 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "167,000.00",
    gradoDeteriorado: "21,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei Mate 50 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "167,000.00",
    gradoDeteriorado: "21,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei Mate 50 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "167,000.00",
    gradoDeteriorado: "21,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei Mate 50 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "167,000.00",
    gradoDeteriorado: "21,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei Mate 50 Pro 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "167,000.00",
    gradoDeteriorado: "21,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "166,900.00",
    gradoDeteriorado: "23,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 Pro+ 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "166,900.00",
    gradoDeteriorado: "23,700.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A25 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "164,100.00",
    gradoDeteriorado: "15,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung A25 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "164,100.00",
    gradoDeteriorado: "15,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A34 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "162,200.00",
    gradoDeteriorado: "21,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI REDMI NOTE 12 TURBO 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "161,000.00",
    gradoDeteriorado: "21,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY A52 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "160,900.00",
    gradoDeteriorado: "18,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Mi10t 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "157,100.00",
    gradoDeteriorado: "20,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "12t Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "156,800.00",
    gradoDeteriorado: "19,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Honor X8B 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "155,200.00",
    gradoDeteriorado: "15,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "HUAWEI MATE 30 PRO 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "155,200.00",
    gradoDeteriorado: "20,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Moto G84 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "155,200.00",
    gradoDeteriorado: "18,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 9 Plus 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "155,200.00",
    gradoDeteriorado: "20,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Oppo Reno 9 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "155,200.00",
    gradoDeteriorado: "20,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "12t Pro 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "155,200.00",
    gradoDeteriorado: "19,600.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Z Flip 2020 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "154,400.00",
    gradoDeteriorado: "28,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI REDMI NOTE 12 PLUS 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "154,000.00",
    gradoDeteriorado: "19,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Edge 30 neo 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "153,200.00",
    gradoDeteriorado: "20,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Redmi Note 13 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "152,500.00",
    gradoDeteriorado: "18,200.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Edge 40 neo 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "149,100.00",
    gradoDeteriorado: "18,800.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Galaxy A06 64GB",
    categoria: "Smartphone",
    gradoPerfecto: "147,800.00",
    gradoDeteriorado: "7,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Galaxy A06 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "147,800.00",
    gradoDeteriorado: "7,900.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A52 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "147,300.00",
    gradoDeteriorado: "16,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "XIAOMI REDMI NOTE 12 TURBO 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "146,900.00",
    gradoDeteriorado: "18,300.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Huawei Mate 30 Pro 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "145,600.00",
    gradoDeteriorado: "18,400.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "SAMSUNG GALAXY A52S 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "145,600.00",
    gradoDeteriorado: "16,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A52s 5G 256GB",
    categoria: "Smartphone",
    gradoPerfecto: "145,600.00",
    gradoDeteriorado: "16,500.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A52 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "143,200.00",
    gradoDeteriorado: "16,100.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy A52s 5G 128GB",
    categoria: "Smartphone",
    gradoPerfecto: "143,200.00",
    gradoDeteriorado: "16,100.00",
    gradoMalo: "1,000.00"
  },

  // SMARTWATCHES
  {
    modelo: "Apple Watch Ultra 2 49MM (Cellular + GPS)",
    categoria: "SmartWatch",
    gradoPerfecto: "200,000.00",
    gradoDeteriorado: "100,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Watch Series 10 46MM (Cellular + GPS)",
    categoria: "SmartWatch",
    gradoPerfecto: "180,000.00",
    gradoDeteriorado: "90,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple Watch Series 10 42MM (Cellular + GPS)",
    categoria: "SmartWatch",
    gradoPerfecto: "150,000.00",
    gradoDeteriorado: "75,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Watch Ultra",
    categoria: "SmartWatch",
    gradoPerfecto: "120,000.00",
    gradoDeteriorado: "60,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Watch7 44MM (LTE)",
    categoria: "SmartWatch",
    gradoPerfecto: "100,000.00",
    gradoDeteriorado: "50,000.00",
    gradoMalo: "1,000.00"
  },

  // TABLETS
  {
    modelo: "Samsung Galaxy Tab S10 Ultra 5G 1TB",
    categoria: "Tablet",
    gradoPerfecto: "500,000.00",
    gradoDeteriorado: "250,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Samsung Galaxy Tab S10 Plus 5G 512GB",
    categoria: "Smartphone",
    gradoPerfecto: "400,000.00",
    gradoDeteriorado: "200,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple iPad Pro 13\" M4 2TB (Wi-Fi + Cellular)",
    categoria: "Tablet",
    gradoPerfecto: "800,000.00",
    gradoDeteriorado: "400,000.00",
    gradoMalo: "1,000.00"
  },
  {
    modelo: "Apple iPad Pro 11\" M4 1TB (Wi-Fi + Cellular)",
    categoria: "Tablet",
    gradoPerfecto: "600,000.00",
    gradoDeteriorado: "300,000.00",
    gradoMalo: "1,000.00"
  },
];
