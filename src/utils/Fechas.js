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

export function calcularFechaNacimientoPorEdad(edad) {
  const ahora = new Date();
  const añoNacimiento = ahora.getFullYear() - edad;

  // Creamos la fecha con 1 de enero de ese año, a medianoche
  const fecha = new Date(`${añoNacimiento}-01-01T00:00:00.102Z`);

  return fecha.toISOString(); // devuelve algo como "2000-01-01T00:00:00.102Z"
}

export function calcularEdadPorFechaNacimiento(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = nacimiento.getMonth();
  const diaNacimiento = nacimiento.getDate();

  // Ajustamos si aún no ha cumplido años este año
  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }

  return edad;
}
