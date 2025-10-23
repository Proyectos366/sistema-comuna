export const toggleAutorizar = (id, setAutorizar, autorizar) => {
  setAutorizar(autorizar === id ? "" : id); // Cambia el estado, permitiendo deselección
};
