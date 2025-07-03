export function capitalizarTitulo(texto) {
  return texto
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
}

export function formatoTituloPersonalizado(texto) {
  const palabras = texto.trim().split(" ");
  if (palabras.length === 1) {
    return (
      palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1).toLowerCase()
    );
  }

  const primera =
    palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1).toLowerCase();
  const resto = palabras
    .slice(1)
    .map((p) => p.toUpperCase())
    .join(" ");
  return `${primera} ${resto}`;
}
