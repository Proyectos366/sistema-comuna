export const obtenerAccion = (
  accion,
  cambiarUsuarioDepartamento,
  asignarUsuarioDepartamento,
  cambiarUsuarioRol,
  eliminarRestaurarUsuario,
  cambiarUsuarioAcceso
) => {
  switch (accion) {
    case "cambiarDepartamento":
      return cambiarUsuarioDepartamento;
    case "asignarDepartamento":
      return asignarUsuarioDepartamento;
    case "cambiarRol":
      return cambiarUsuarioRol;
    case "cambiarEstado":
      return eliminarRestaurarUsuario;
    case "cambiarAutorizacion":
      return cambiarUsuarioAcceso;
    default:
      return () => {}; // función vacía si no hay acción
  }
};
