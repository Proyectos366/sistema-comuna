export function filtrarOrdenar(
  datos,
  busqueda,
  ordenCampo,
  ordenDireccion,
  camposBusqueda
) {
  const texto = busqueda.toLowerCase();

  const filtrados = datos.filter((usuario) =>
    camposBusqueda.some((campo) => {
      const valor = usuario[campo];
      return valor && String(valor).toLowerCase().includes(texto);
    })
  );

  const ordenados = [...filtrados].sort((a, b) => {
    const valorA = a[ordenCampo];
    const valorB = b[ordenCampo];

    if (valorA < valorB) return ordenDireccion === "asc" ? -1 : 1;
    if (valorA > valorB) return ordenDireccion === "asc" ? 1 : -1;
    return 0;
  });

  return ordenados;
}
