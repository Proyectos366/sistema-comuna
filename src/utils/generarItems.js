export function generarItems(cantidad, opciones = {}) {
  const {
    inicio = 1,
    formatoDigitos = 2,
    prefijo = "",
    indice = false,
    nombreCero = null, // Nuevo: nombre personalizado para el 0
  } = opciones;

  const result = [];
  const start = indice ? 0 : inicio;
  const total = indice ? cantidad + 1 : cantidad;

  for (let i = start; i < start + total; i++) {
    let id = i.toString().padStart(formatoDigitos, "0");
    let nombre = id;

    // Si es el primer elemento (0) y se proporcionó nombreCero
    if (indice && i === 0 && nombreCero) {
      nombre = nombreCero;
    }

    if (prefijo) {
      id = `${prefijo}${id}`;
      if (nombre !== id) nombre = `${prefijo}${nombre}`;
    }

    result.push({ id: id, nombre: nombre });
  }

  return result;
}

export function generarItemsIncluirCero(cantidad, opciones = {}) {
  const {
    inicio = 1,
    formatoDigitos = 2,
    prefijo = "",
    indice = false, // Nuevo parámetro
  } = opciones;

  const result = [];

  // Si indice es true, empezamos desde 0
  const start = indice ? 0 : inicio;
  // Si indice es true, la cantidad incluye el 0 como extra
  const total = indice ? cantidad + 1 : cantidad;

  for (let i = start; i < start + total; i++) {
    let id = i.toString().padStart(formatoDigitos, "0");
    if (prefijo) id = `${prefijo}${id}`;
    result.push({ id: id, nombre: id });
  }

  return result;
}

export function generarItemsExcluirCero(cantidad, opciones = {}) {
  const { inicio = 1, formatoDigitos = 2, prefijo = "" } = opciones;
  const result = [];
  for (let i = inicio; i < inicio + cantidad; i++) {
    let id = i.toString().padStart(formatoDigitos, "0");
    if (prefijo) id = `${prefijo}${id}`;
    result.push({ id: id, nombre: id });
  }
  return result;
}

export function generarItemsSecciones(cantidad, opciones = {}) {
  const { inicio = 1, prefijo = "" } = opciones;
  const result = [];
  for (let i = inicio; i < inicio + cantidad; i++) {
    let id = i.toString(); // Sin padStart, solo el número
    if (prefijo) id = `${prefijo}${id}`;
    result.push({ id: id, nombre: id });
  }
  return result;
}

// // Usos:
// const niveles = generarItems(10);   // ["01"..."10"]
// const secciones = generarItems(5, { inicio: 1, formatoDigitos: 2 }); // ["01"..."05"]
// const modulos = generarItems(8, { inicio: 0, formatoDigitos: 2 });    // ["00"..."07"]
