import axios from "axios";
export const cambiarUsuarioAcceso = async (
  valido,
  usuarioId,
  setTodosUsuarios,
  abrirMensaje,
  ejecutarAccionesConRetraso,
  cerrarModal,
  setEstado
) => {
  try {
    const response = await axios.patch("/api/usuarios/cambiar-acceso", {
      idUsuario: usuarioId,
      validado: valido,
    });

    const usuarioActualizado = response.data.usuario;

    setTodosUsuarios((usuarios = []) => {
      return usuarios.map((u) =>
        u.id === usuarioActualizado.id ? usuarioActualizado : u
      );
    });

    abrirMensaje(response.data.message);
    ejecutarAccionesConRetraso([
      { accion: cerrarModal, tiempo: 3000 },
      { accion: () => setEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
    ]);
  } catch (error) {
    abrirMensaje(error?.response?.data?.message || "Error, al cambiar acceso");
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  }
};
