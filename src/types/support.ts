export interface SupportOrderResponse {
  obtenerDocumentosResult: ObtenerDocumentosResult;
}

export interface ObtenerDocumentosResult {
  estado: string;
  documentos: Documento[];
}

export interface Documento {
  diffgrId: string;
  rowOrder: number;
  hasChanges: string;
  registro: string;
  tipo: string;
  cliente: string;
  estadoNombre: string;
  estadoCodigo: string;
  documento: string;
  fecha: string;
  concepto: string;
  valor: string;
  url: string;
}
