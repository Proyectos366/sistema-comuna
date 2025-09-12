/**
 @fileoverview Controlador de API para asignar un usuario a un departamento específico. Este
 endpoint valida los datos recibidos, actualiza la relación en la base de datos, registra eventos
 de auditoría y retorna el perfil actualizado del usuario. Utiliza Prisma como ORM, servicios
 personalizados para validación y auditoría, y una utilidad para respuestas HTTP estandarizadas.
 @module api/usuarios/asignarAlDepartamento
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarAsignarAlDepartamento from "@/services/usuarios/validarAsignarAlDepartamento"; // Servicio para validar asignación
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para asignar un usuario a un departamento.
 * Valida los datos recibidos, actualiza la relación en la base de datos,
 * registra eventos de auditoría y retorna el perfil actualizado del usuario.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con los IDs de usuario y departamento.
 * @returns {Promise<Response>} Respuesta HTTP con el usuario actualizado o mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { idDepartamento, idUsuario } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarAsignarAlDepartamento(
      idDepartamento,
      idUsuario
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_ASIGNAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar asignar un usuario a un departamento",
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

    // 4. Ejecuta transacción: actualiza el departamento y consulta el usuario actualizado
    const [asignadoALDepartamento, usuarioActualizado] =
      await prisma.$transaction([
        prisma.departamento.update({
          where: { id: validaciones.id_departamento },
          data: {
            miembros: {
              connect: { id: validaciones.id_usuario_miembro },
            },
          },
        }),

        prisma.usuario.findUnique({
          where: { id: validaciones.id_usuario_miembro },
          include: { MiembrosDepartamentos: true },
        }),
      ]);

    // 5. Si no se obtiene el usuario o la asignación falla, registra el error y retorna
    if (!usuarioActualizado || !asignadoALDepartamento) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_ASIGNAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo asignar al departamento",
        datosAntes: null,
        datosDespues: usuarioActualizado,
      });

      return generarRespuesta(
        "error",
        "No se pudo asignar al departamento",
        {},
        !asignadoALDepartamento ? 400 : 404
      );
    }

    // 6. Registro exitoso del evento y retorno del usuario actualizado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "UPDATE_ASIGNAR_DEPARTAMENTO",
      id_objeto: usuarioActualizado?.MiembrosDepartamentos?.[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Usuario asignado con exito al departamento ${usuarioActualizado?.MiembrosDepartamentos?.[0]?.nombre}`,
      datosAntes: null,
      datosDespues: usuarioActualizado,
    });

    return generarRespuesta(
      "ok",
      "Se asigno con exito al departamento",
      { usuario: usuarioActualizado },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (asignar al departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_ASIGNAR_DEPARTAMENTO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al asignar un usuario a un departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (asignar al departamento)",
      {},
      500
    );
  }
}
