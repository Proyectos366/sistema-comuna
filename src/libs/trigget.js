import obtenerIp from "@/utils/obtenerIp";
import prisma from "./prisma";

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
    const ip = obtenerIp(request);

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
  } catch (errorEvento) {
    console.log(
      "[registrarEventoSeguro] Fallo al guardar evento:",
      errorEvento.message
    );
  }
}
