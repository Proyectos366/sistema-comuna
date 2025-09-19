import prisma from "@/libs/prisma";
import { startOfWeek, endOfWeek } from "date-fns";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearNovedad(
  nombre,
  descripcion,
  id_institucion,
  id_departamento,
  rango,
  prioridad
) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarCampos = ValidarCampos.validarCamposCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
        { id_usuario: validaciones.id_usuario }
      );
    }

    let departamentos;

    if (validaciones.id_rol === 1) {
      departamentos = await prisma.departamento.findMany({
        where: {
          id_institucion: validarCampos.id_institucion,
        },
        select: {
          id: true,
        },
      });
    }

    const mapaPrioridad = {
      1: "alta",
      2: "media",
      3: "baja",
    };

    const nuevaNovedad = await prisma.novedad.create({
      data: {
        nombre: validarCampos.nombre,
        descripcion: validarCampos.descripcion,
        prioridad: validarCampos.prioridad,
        id_usuario: validarCampos.id_usuario,
        id_institucion: validarCampos.id_institucion,
      },
    });

    const noveDepa = await prisma.novedadDepartamento.createMany({
      data: {
        id_novedad: nuevaNovedad.id,
        id_departamento: validarCampos.id_departamento,
      },
    });

    const nuevaNotificacion = await prisma.notificacion.create({
      data: {
        mensaje: validarCampos.nombre,
        id_emisor: validarCampos.id_depa_origen,
        id_receptor: validarCampos.id_departamento,
      },
    });

    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rango: validarCampos.rango,
      prioridad: mapaPrioridad[validarCampos.prioridad],
      departamentos: departamentos ? departamentos : [],
      inicioSemana: inicioSemana,
      finSemana: finSemana,
      id_novedad: nuevaNovedad.id,
      id_institucion:
        validarCampos.rango === 1
          ? validarCampos.id_institucion
          : validaciones.id_institucion,
      id_departamento:
        validarCampos.rango === 1 ? null : validarCampos.id_departamento,
      id_depa_origen:
        validarCampos.rango === 1 ? null : validaciones.id_departamento,
    });
  } catch (error) {
    console.log("Error interno validar crear novedad: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear novedad"
    );
  }
}
