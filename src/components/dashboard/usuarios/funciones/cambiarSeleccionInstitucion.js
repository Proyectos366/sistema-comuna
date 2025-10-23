export const cambiarSeleccionInstitucion = (
  e,
  setSeleccionarInstitucion,
  setIdInstitucion
) => {
  const valor = parseInt(e.target.value);

  // Si el valor es vacío o no es un número válido, vaciar selección
  if (isNaN(valor)) {
    setSeleccionarInstitucion([]);
    setIdInstitucion("");
    return;
  }

  const nuevo = { id: valor };

  setSeleccionarInstitucion((prev) => {
    const existe = prev.some((institucion) => institucion.id === valor);
    return existe
      ? prev.filter((institucion) => institucion.id !== valor)
      : [...prev, nuevo];
  });

  setIdInstitucion(valor);
};
