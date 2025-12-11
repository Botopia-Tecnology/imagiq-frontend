export enum DocumentTypeAbbreviation {
  CC = "Cédula de Ciudadanía",
  CE = "Cédula de Extranjería",
  TE = "Tarjeta de Extranjería",
  TI = "Tarjeta de Identidad",
  NUIP = "Número Unico de Identificación Personal",
  RC = "Registro Civil",
  PA = "Pasaporte",
  PET = "Permiso Especial de Trabajo",
  PPT = "Permiso de Protección Temporal",
  NIT = "Número de Identificación Tributaria",
  CRS = "Cert Regis suces ilíq pers nat no doc id",
  SIL = "Sucesión ilíquida,exp. por notaria",
  DX = "Documento definido información exogena",
  NITEXT = "ID de extranjeros diferente al NIT",
  DIE = "Documento de identificación extranjero",
  PJEX = "Doc Identificación Ext Persona Jurídica",
  CD = "Carné Diplomático",
}

// Mapeo inverso (nombre -> abreviación)
const DocumentAbbreviationMap: Record<
  string,
  keyof typeof DocumentTypeAbbreviation
> = Object.entries(DocumentTypeAbbreviation).reduce((acc, [abbr, name]) => {
  acc[(name as string).toLowerCase()] =
    abbr as keyof typeof DocumentTypeAbbreviation;
  return acc;
}, {} as Record<string, keyof typeof DocumentTypeAbbreviation>);

// Intenta normalizar una cadena de entrada (quita diacríticos, caracteres no alfanuméricos)
function normalizeName(name: string) {
  return name
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

// Devuelve la abreviación (por ejemplo 'CC') si se puede reconocer el nombre o la abreviación
export function getDocumentAbbreviation(input: string): string | null {
  if (!input) return null;

  const raw = input.toString().trim();

  // Si ya viene en forma de abreviación (2-6 letras), normalizar y devolver
  const abbrCandidate = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (abbrCandidate && abbrCandidate in DocumentTypeAbbreviation) {
    return abbrCandidate;
  }

  // Normalizar nombre y buscar en el mapa inverso
  const normalized = normalizeName(raw);

  // Buscar coincidencia directa en nombres del enum
  const found = Object.entries(DocumentTypeAbbreviation).find(
    ([, name]) => normalizeName(name as string) === normalized
  );
  if (found) return found[0];

  // Buscar en el mapa que fue creado desde los nombres originales
  if (DocumentAbbreviationMap[normalized]) {
    return DocumentAbbreviationMap[normalized] as string;
  }

  return null;
}
