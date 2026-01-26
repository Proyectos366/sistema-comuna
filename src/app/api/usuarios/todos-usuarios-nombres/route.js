/**
 @fileoverview Controlador de API para consultar todos los nombres de los usuarios registrados
 en el sistema. Este endpoint valida el acceso, realiza la consulta en la base de datos, excluye
 ciertos correos específicos y retorna la lista de usuarios ordenados por nombre. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/usuarios/consultarTodos
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarConsultarTodosUsuariosNombres from "@/services/usuarios/validarConsultarTodosUsuariosNombres"; // Servicio para validar la consulta

/**
 Maneja las solicitudes HTTP GET para obtener todos los nombres de usuarios del sistema.
 Valida el contexto de la solicitud, consulta la base de datos excluyendo ciertos correos
 y retorna una respuesta estructurada con la lista de usuarios.
 @async
 @function GET
 @returns {Promise<Response>} Respuesta HTTP con la lista de usuarios o un mensaje de error.
*/

export async function GET(request) {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarConsultarTodosUsuariosNombres();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Consulta todos los usuarios, excluyendo correos específicos
    const todosUsuarios = await prisma.usuario.findMany({
      where: {
        correo: {
          not: "carlosjperazab@gmail.com",
        },
        MiembrosInstitucion: {
          some: {
            id: validaciones.id_institucion,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        },
      },
    });

    // 4. Verifica si se obtuvieron resultados válidos
    if (!todosUsuarios) {
      return generarRespuesta("error", "Error, no hay usuarios", {}, 404);
    }

    // 5. Retorna la lista de usuarios en una respuesta exitosa
    return generarRespuesta(
      "error",
      "Usuarios encontrados",
      { usuarios: todosUsuarios },
      200,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno, todos usuarios nombres: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno, todos usuarios nombres",
      {},
      500,
    );
  }
}
