export const asignarUsuarioDepartamento = async (
  idUsuario,
  idDepartamento,
  setTodosUsuarios,
  abrirMensaje,
  ejecutarAccionesConRetraso
) => {
  try {
    const response = await axios.patch(
      "/api/usuarios/asignar-al-departamento",
      {
        idUsuario,
        idDepartamento,
      }
    );

    const usuarioActualizado = response.data.usuario;

    setTodosUsuarios((usuarios = []) => {
      return usuarios.map((u) =>
        u.id === usuarioActualizado.id ? usuarioActualizado : u
      );
    });

    abrirMensaje(response.data.message);
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  } catch (error) {
    abrirMensaje(
      error?.response?.data?.message || "Error al asignar departamento"
    );
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  }
};
