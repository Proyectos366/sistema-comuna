import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarCrearNovedad from "@/services/novedades/validarCrearNovedad";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_institucion, id_departamento, rango } =
      await request.json();

    const validaciones = await validarCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "INTENTO_FALLIDO_NOVEDAD",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear la novedad",
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

    const { nuevaNovedad } = await prisma.$transaction(async (tx) => {
      // Crear la novedad
      const novedadCreada = await tx.novedad.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          tipo: validaciones.tipo,
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      let recepciones = [];

      if (validaciones.tipo === "institucional") {
        // Buscar todos los departamentos de la institución
        const departamentos = await tx.departamento.findMany({
          where: { id_institucion: validaciones.id_institucion },
        });

        // Crear una recepción por cada departamento
        recepciones = await Promise.all(
          departamentos.map((d) =>
            tx.recepcionDepartamento.create({
              data: {
                id_novedad: novedadCreada.id,
                id_departamento: d.id,
              },
            })
          )
        );
      } else {
        // Crear una sola recepción para el departamento específico
        const recepcionCreada = await tx.recepcionDepartamento.create({
          data: {
            id_novedad: novedadCreada.id,
            id_departamento: validaciones.id_departamento,
          },
        });

        recepciones.push(recepcionCreada);
      }

      // Construir el objeto de respuesta
      const nuevaNovedad = {
        novedades: recepciones.map((r) => ({
          id: r.id,
          nombre: novedadCreada.nombre,
          descripcion: novedadCreada.descripcion,
          recibido: r.recibido,
          fechaRecibido: r.fechaRecibido,
          id_institucion: novedadCreada.id_institucion,
          id_novedad: r.id_novedad,
          id_departamento: r.id_departamento,
        })),
      };

      return { nuevaNovedad };
    });

    if (!nuevaNovedad) {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "ERROR_CREAR_NOVEDAD",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la novedad",
        datosAntes: null,
        datosDespues: nuevaNovedad,
      });

      return generarRespuesta("error", "Error, no se creo la novedad", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "CREAR_NOVEDAD",
        id_objeto: nuevaNovedad.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Novedad creada con exito",
        datosAntes: null,
        datosDespues: nuevaNovedad,
      });

      return generarRespuesta(
        "ok",
        "Novedad creada...",
        {
          novedades: nuevaNovedad?.novedades ? nuevaNovedad?.novedades[0] : [],
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (novedades): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "novedad",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear la novedad",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (novedades)", {}, 500);
  }
}
