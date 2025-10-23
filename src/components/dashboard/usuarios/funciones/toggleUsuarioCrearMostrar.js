export const toggleUsuarioCrearMostrar = (setCrearMostrar, setOpcion) => {
  setCrearMostrar((prev) => !prev);
  setOpcion((prev) => (prev === "" ? "crear" : ""));
};
