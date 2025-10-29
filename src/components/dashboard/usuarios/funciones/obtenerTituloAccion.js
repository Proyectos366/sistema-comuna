export const obtenerTituloAccion = (accion) => {
  switch (accion) {
    case "cambiarDepartamento":
      return "¿Cambiar departamento?";
    case "asignarDepartamento":
      return "¿Asignar al departamento?";
    case "cambiarRol":
      return "¿Cambiar rol?";
    case "nuevoUsuario":
      return "¿Crear usuario?";
    default:
      return () => {}; // función vacía si no hay acción
  }
};
