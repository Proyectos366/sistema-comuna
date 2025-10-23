export const cambiarUsuarioRol = async (
  idUsuario,
  idRol,
  setTodosUsuarios,
  abrirMensaje,
  ejecutarAccionesConRetraso
) => {
  try {
    const response = await axios.patch("/api/usuarios/cambiar-rol", {
      idUsuario,
      idRol,
    });

    const usuarioActualizado = response.data.usuario;

    setTodosUsuarios((usuarios = []) => {
      return usuarios.map((u) =>
        u.id === usuarioActualizado.id ? usuarioActualizado : u
      );
    });

    abrirMensaje(response.data.message);
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  } catch (error) {
    abrirMensaje(error?.response?.data?.message || "Error, al cambiar rol");
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  }
};
