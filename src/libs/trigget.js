/**
 @fileoverview Funciones para registrar eventos en la base de datos. Este módulo permite guardar
 acciones realizadas por los usuarios en una tabla de auditoría, incluyendo información como IP,
 descripción, y estado antes y después de la acción. Utiliza Prisma como ORM y una utilidad para
 obtener la IP desde la solicitud. @module utils/registrarEvento
*/

import obtenerIp from "@/utils/obtenerIp"; // Utilidad para extraer la IP desde la solicitud HTTP
import prisma from "./prisma"; // Cliente Prisma para interactuar con la base de datos

/**
 Registra un evento directamente en la base de datos. Se utiliza internamente por funciones más
 seguras que validan y enriquecen los datos.
 @async
 @function registrarEvento
 @param {string} nombreTabla - Nombre de la tabla afectada.
 @param {string} accion - Tipo de acción realizada (crear, actualizar, eliminar, etc.).
 @param {number} idObjeto - ID del objeto afectado por la acción.
 @param {number} usuarioId - ID del usuario que realizó la acción.
 @param {string} [ip=""] - Dirección IP desde donde se realizó la acción.
 @param {string} [descripcion=""] - Descripción adicional del evento.
 @param {Object|null} [datosAntes=null] - Estado del objeto antes de la acción.
 @param {Object|null} [datosDespues=null] - Estado del objeto después de la acción.
 @returns {Promise<void>} No retorna datos, pero registra el evento en la base.
*/
async function registrarEvento(
  nombreTabla,
  accion,
  idObjeto,
  usuarioId,
  ip = "",
  descripcion = "",
  datosAntes = null,
  datosDespues = null
) {
  try {
    await prisma.eventos.create({
      data: {
        tabla: nombreTabla,
        accion,
        id_objeto: idObjeto,
        id_usuario: usuarioId,
        ip,
        descripcion,
        datosAntes,
        datosDespues,
      },
    });
  } catch (error) {
    console.log("[registrarEvento] Error al registrar evento:", error.message);
  }
}

/**
 Función segura para registrar eventos, enriqueciendo los datos con IP y valores por defecto. Ideal
 para ser utilizada desde controladores o servicios que manejan solicitudes HTTP.
 @async
 @function registrarEventoSeguro
 @param {Request} request - Objeto de solicitud HTTP para extraer la IP.
 @param {Object} opciones - Datos del evento a registrar.
 @param {string} opciones.tabla - Nombre de la tabla afectada.
 @param {string} opciones.accion - Tipo de acción realizada.
 @param {number} [opciones.id_objeto=0] - ID del objeto afectado.
 @param {number} [opciones.id_usuario=0] - ID del usuario que realizó la acción.
 @param {string} [opciones.descripcion="Evento no especificado"] - Descripción del evento.
 @param {Object|null} [opciones.datosAntes=null] - Estado previo del objeto.
 @param {Object|null} [opciones.datosDespues=null] - Estado posterior del objeto.
 @returns {Promise<void>} No retorna datos, pero registra el evento en la base.
*/
export default async function registrarEventoSeguro(
  request,
  {
    tabla,
    accion,
    id_objeto = 0,
    id_usuario = 0,
    descripcion = "Evento no especificado",
    datosAntes = null,
    datosDespues = null,
  }
) {
  try {
    // 1. Obtiene la IP desde la solicitud
    const ip = obtenerIp(request);

    // 2. Registra el evento con todos los datos disponibles
    await registrarEvento(
      tabla,
      accion,
      id_objeto,
      id_usuario,
      ip,
      descripcion,
      datosAntes,
      datosDespues
    );
  } catch (error) {
    // 3. Manejo de errores inesperados durante el registro del evento
    console.log("Fallo al guardar evento: " + error);
  }
}
