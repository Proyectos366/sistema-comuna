import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/consultar_todos_usuarios/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/consultar_todos_usuarios/msjCorrectos.json";
import validarConsultarTodosUsuarios from "@/services/validarConsultarTodosUsuarios";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodosUsuarios();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_TODOS_USUARIOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todos los usuarios",
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

    const todosUsuarios = await prisma.usuario.findMany({
      where: {
        correo: {
          not: {
            in: [validaciones.correo, "master@gmail.com"],
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
      include: {
        MiembrosDepartamentos: true,
      },
    });

    if (!todosUsuarios) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_GET_TODOS_USUARIOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todos los usuarios",
        datosAntes: null,
        datosDespues: {
          todosUsuarios,
        },
      });

      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorConsultarTodosUsuarios.usuariosNoEncontrados,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "GET_TODOS_USUARIOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todos los usuarios",
        datosAntes: null,
        datosDespues: {
          todosUsuarios,
        },
      });

      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okConsultarTodosUsuarios.usuariosEncontrados,
        { usuarios: todosUsuarios },
        msjCorrectos.codigo.codigo200
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_TODOS_USUARIOS",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todos los usuarios",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorConsultarTodosUsuarios.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
