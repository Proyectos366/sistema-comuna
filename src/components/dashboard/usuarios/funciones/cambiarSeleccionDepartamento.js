export const cambiarSeleccionDepartamento = (
  e,
  setSeleccionarDepartamentos,
  setIdDepartamento
) => {
  const valor = parseInt(e.target.value);

  // Si el valor es vacío o no es un número válido, vaciar selección
  if (isNaN(valor)) {
    setSeleccionarDepartamentos([]);
    setIdDepartamento("");
    return;
  }

  const nuevo = { id: valor };

  setSeleccionarDepartamentos((prev) => {
    const existe = prev.some((departamento) => departamento.id === valor);
    return existe
      ? prev.filter((departamento) => departamento.id !== valor)
      : [...prev, nuevo];
  });

  setIdDepartamento(valor);
};
