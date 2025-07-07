export function formatearCedula(cedula) {
  const valor = cedula.toString().replace(/\D/g, ""); // quitar caracteres no numéricos
  let partes = [];

  if (valor.length >= 7) {
    // Ejemplo: 20202202 → V-20.202.202
    partes.push(valor.slice(0, valor.length - 6));
    partes.push(valor.slice(-6, -3));
    partes.push(valor.slice(-3));
  } else if (valor.length >= 6) {
    // Ejemplo: 220220 → V-2.202.20
    partes.push(valor.slice(0, valor.length - 6));
    partes.push(valor.slice(-6, -3));
    partes.push(valor.slice(-3));
  } else {
    // Cédula corta → formateo básico
    return `V-${valor}`;
  }

  return `V-${partes.join(".")}`;
}
