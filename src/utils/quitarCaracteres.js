export function quitarCaracteres(cadena) {
  return cadena.replace(/[a-zA-Z.\-]/g, "");
}
