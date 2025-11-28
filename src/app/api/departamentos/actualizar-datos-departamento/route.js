/**
@fileoverview Controlador de API para la edición de un departamento existente. Este archivo
maneja la lógica para actualizar los detalles de un departamento en la base de datos a través
de una solicitud POST. Utiliza Prisma para la interacción con la base de datos, un servicio de
validaciónpara asegurar la validez de los datos, y un sistema de registro de eventos para la
auditoría.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarDepartamento from "@/services/departamentos/validarEditarDepartamento"; // Servicio para validar los datos de edición del departamento.
/**
Maneja las solicitudes HTTP POST para editar un departamento existente.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles del departamento a editar.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_institucion, id_departamento } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarDepartamento(
      nombre,
      descripcion,
      id_institucion,
      id_departamento
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar el departamento",
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

    // 4. Actualiza el departamento en la base de datos
    const [actualizado, departamentoActualizado] = await prisma.$transaction([
      prisma.departamento.update({
        where: { id: validaciones.id_departamento },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.departamento.findFirst({
        where: {
          id: validaciones.id_departamento,
          borrado: false,
        },
      }),
    ]);

    // 5. Condición de error si no se actualiza el departamento
    if (!departamentoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_UPDATE_DEPARTAMENTO",
        id_objeto: validaciones.id_departamento,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el departamento",
        datosAntes: { nombre, descripcion, id_departamento },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar el departamento actualizado",
        {},
        400
      );
    }
    
    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "UPDATE_DEPARTAMENTO",
      id_objeto: departamentoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Departamento actualizado con exito id: ${validaciones.id_departamento}`,
      datosAntes: {
        nombre: nombre,
        descripcion: descripcion,
        id_departamento: id_departamento,
      },
      datosDespues: departamentoActualizado,
    });

    // 6. Condición de éxito: el departamento fue actualizado correctamente
    return generarRespuesta(
      "ok",
      "Departamento actualizado...",
      { departamentos: departamentoActualizado },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar departamento)",
      {},
      500
    );
  }
}
