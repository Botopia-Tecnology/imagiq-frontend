/**
 * Servicio para enviar respuestas de formularios dinámicos
 */

import { apiPost } from "@/lib/api-client";

export interface FormSubmissionData {
  page_id: string;
  data: Record<string, unknown>;
}

/**
 * Envía una respuesta de formulario al backend
 * @param pageId - ID de la página del formulario
 * @param data - Datos del formulario como objeto key-value
 */
export async function submitFormResponse(
  pageId: string,
  data: Record<string, unknown>
): Promise<void> {
  await apiPost<void>("/api/multimedia/form-submissions", {
    page_id: pageId,
    data,
  });
}
