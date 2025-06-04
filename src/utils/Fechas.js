export const fechaLimite = new Date().toISOString().split("T")[0];

export function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
    return `${seconds} segundos`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutos`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} horas`;
  } else if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} días`;
  } else if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `${weeks} semanas`;
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months} meses`;
  } else if (seconds > 31536000) {
    const years = Math.floor(seconds / 31536000);
    return `${years} años`;
  } else {
    return "0 segundos";
  }
}

export function formatearFecha(fechaISO) {
  try {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, "0");
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11, por eso sumamos 1
    const año = fecha.getUTCFullYear();

    return `${dia}/${mes}/${año}`;
  } catch (error) {
    console.error(`Error al formatear la fecha: ${error.message}`);
    return "Fecha inválida";
  }
}
