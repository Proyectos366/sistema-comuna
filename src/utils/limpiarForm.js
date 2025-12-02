export const limpiarCampos = (objetoEstados) => {
  // Iterar sobre los setters y actualizar cada uno con una cadena vacía
  Object.keys(objetoEstados).forEach((key) => {
    objetoEstados[key](""); // Llama a cada setter con una cadena vacía
  });
};
