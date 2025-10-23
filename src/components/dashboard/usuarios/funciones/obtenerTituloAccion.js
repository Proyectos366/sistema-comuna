export const obtenerTituloAccion = (accion, estado, validado) => {
  switch (accion) {
    case "cambiarDepartamento":
      return "¿Cambiar departamento?";
    case "asignarDepartamento":
      return "¿Asignar al departamento?";
    case "cambiarRol":
      return "¿Cambiar rol?";
    case "cambiarEstado":
      return estado ? "¿Habilitar este usuario?" : "¿Inhabilitar este usuario?";
    case "cambiarAutorizacion":
      return validado
        ? "¿Restringir este usuario?"
        : "¿Autorizar este usuario?";
    case "nuevoUsuario":
      return "¿Crear usuario?";
    default:
      return () => {}; // función vacía si no hay acción
  }
};
