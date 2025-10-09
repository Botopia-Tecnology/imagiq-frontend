"use client"
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = typeof window !== "undefined" ? withReactContent(Swal) : null;

// Notificación para registro exitoso
export async function notifyRegisterSuccess(email: string) {
  if (!MySwal) {
    console.warn("SweetAlert2 not available (SSR or import error)");
    return Promise.resolve();
  }
  try {
    const result = await MySwal.fire({
      title: "¡Registro exitoso!",
      text: `Se ha creado la cuenta para ${email}.`,
      icon: "success",
      confirmButtonText: "Continuar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: "swal2-popup",
        confirmButton: "swal2-confirm",
      },
    });
    return result;
  } catch (err) {
    console.error("SweetAlert2 error:", err);
    return Promise.resolve();
  }
}

// Notificación para login exitoso
export async function notifyLoginSuccess(name?: string) {
  if (!MySwal) {
    console.warn("SweetAlert2 not available (SSR or import error)");
    return Promise.resolve();
  }
  try {
    const result = await MySwal.fire({
      title: "¡Bienvenido!",
      text: name
        ? `Hola, ${name}! Has iniciado sesión correctamente.`
        : "Has iniciado sesión correctamente.",
      icon: "success",
      confirmButtonColor: "#002142",
      confirmButtonText: "Continuar",
      showClass: { popup: "swal2-show" },
      hideClass: { popup: "swal2-hide" },
    });
    return result;
  } catch (err) {
    console.error("SweetAlert2 error:", err);
    return Promise.resolve();
  }
}

// Notificación de error genérica
export async function notifyError(message: string, title = "Error") {
  if (!MySwal) {
    console.warn("SweetAlert2 not available (SSR or import error)");
    return Promise.resolve();
  }
  try {
    const result = await MySwal.fire({
      title,
      text: message,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "Cerrar",
      showClass: { popup: "swal2-show" },
      hideClass: { popup: "swal2-hide" },
    });
    return result;
  } catch (err) {
    console.error("SweetAlert2 error:", err);
    return Promise.resolve();
  }
}
