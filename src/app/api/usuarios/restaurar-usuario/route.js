import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarRestaurarUsuario from "@/services/usuarios/validarRestaurarUsuario";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { estado, idUsuario } = await request.json();

    const validaciones = await validarRestaurarUsuario(estado, idUsuario);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar usuario",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [restaurandoUsuario, usuarioActualizado] = await prisma.$transaction([
      // Primero se actualiza el usuario con solo el nuevo departamento
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_estado },
        data: {
          borrado: validaciones.borrado, // Asegúrate que este sea el nuevo rol
        },
      }),

      // Luego se consulta al usuario ya actualizado
      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_estado,
        },
        orderBy: { nombre: "asc" },
        include: { MiembrosDepartamentos: true },
      }),
    ]);

    // Validación de los resultados después de la transacción
    if (!restaurandoUsuario || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_RESTAURAR_USUARIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar el usuario",
        datosAntes: null,
        datosDespues: {
          restaurandoUsuario,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar usuario...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "RESTAURAR_USUARIO",
        id_objeto: usuarioActualizado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Usuario restaurado con exito",
        datosAntes: null,
        datosDespues: {
          restaurandoUsuario,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "ok",
        "Usuario restaurado correctamente...",
        {
          usuario: usuarioActualizado,
        },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno (restaurar usuario): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al restaurar usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (restaurar usuario)",
      {},
      500
    );
  }
}
