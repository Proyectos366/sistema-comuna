export function generarItems(cantidad, opciones = {}) {
  const { inicio = 1, formatoDigitos = 2, prefijo = "" } = opciones;
  const result = [];
  for (let i = inicio; i < inicio + cantidad; i++) {
    let id = i.toString().padStart(formatoDigitos, "0");
    if (prefijo) id = `${prefijo}${id}`;
    result.push({ id: id, nombre: id });
  }
  return result;
}

// // Usos:
// const niveles = generarItems(10);   // ["01"..."10"]
// const secciones = generarItems(5, { inicio: 1, formatoDigitos: 2 }); // ["01"..."05"]
// const modulos = generarItems(8, { inicio: 0, formatoDigitos: 2 });    // ["00"..."07"]
