import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarFormacion(
  nombre,
  cantidadModulos,
  descripcion,
  id_formacion
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const correoUsuarioActivo = descifrarToken.correo;

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correoUsuarioActivo },
      select: {
        id: true,
      },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario invalido...",
        {},
        400
      );
    }

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposEditarFormacion(
      nombre,
      cantidadModulos,
      descripcion,
      id_formacion
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: idUsuario.id,
        }
      );
    }

    const existente = await prisma.formacion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_formacion, // excluye el cargo que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la formación ya existe",
        { id_usuario: idUsuario.id },
        400
      );
    }

    // 🔍 Obtener los módulos antes de actualizar
    const formacionAntes = await prisma.formacion.findUnique({
      where: { id: validandoCampos.id_formacion },
      include: { modulos: true },
    });

    const todoscantidadModulos = await prisma.modulo.findMany({
      where: { borrado: false },
      select: { id: true },
      take: validandoCampos.cantidadModulos,
      orderBy: {
        id: "asc",
      },
    });

    if (!todoscantidadModulos || todoscantidadModulos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no hay cantidad modulos...",
        {
          id_usuario: idUsuario.id,
        }
      );
    }

    // 🛠️ Actualizar formación con nuevos módulos
    const actualizarFormacion = await prisma.formacion.update({
      where: { id: validandoCampos.id_formacion },
      data: {
        nombre: validandoCampos.nombre,
        descripcion: validandoCampos.descripcion,
        modulos: {
          set: todoscantidadModulos.map(({ id }) => ({ id })),
        },
      },
    });

    if (!actualizarFormacion) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no se actualizo la formacion...",
        {
          id_usuario: idUsuario.id,
        }
      );
    }

    const formacionId = validandoCampos.id_formacion;

    const cursos = await prisma.curso.findMany({
      where: {
        id_formacion: formacionId,
        borrado: false,
      },
    });

    const formacionConModulos = await prisma.formacion.findUnique({
      where: { id: formacionId },
      include: { modulos: true },
    });

    const modulosActualizados = formacionConModulos?.modulos || [];

    for (const curso of cursos) {
      const asistenciasActuales = await prisma.asistencia.findMany({
        where: { id_curso: curso.id, borrado: false },
      });

      const modulosActualesIds = asistenciasActuales.map((a) => a.id_modulo);
      const nuevosModulos = modulosActualizados.filter(
        (modulo) => !modulosActualesIds.includes(modulo.id)
      );

      for (const modulo of nuevosModulos) {
        await prisma.asistencia.create({
          data: {
            id_vocero: curso.id_vocero,
            id_modulo: modulo.id,
            id_curso: curso.id,
            id_usuario: curso.id_usuario,
            presente: false,
            fecha_registro: new Date(),
          },
        });
      }

      // Eliminar asistencias que ya no tienen módulo
      const modulosPermitidos = modulosActualizados.map((m) => m.id);
      const asistenciasAEliminar = asistenciasActuales.filter(
        (a) => !modulosPermitidos.includes(a.id_modulo)
      );

      /**
        await Promise.all(
          asistenciasAEliminar.map((a) =>
            prisma.asistencia.delete({
              where: { id: a.id },
            })
          )
        );
      */

      await Promise.all(
        asistenciasAEliminar.map((a) =>
          prisma.asistencia.update({
            where: { id: a.id },
            data: { borrado: true }, // Marcamos como "borrado"
          })
        )
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      cantidadModulos: validandoCampos.cantidadModulos,
      descripcion: validandoCampos.descripcion,
      todosModulos: todoscantidadModulos,
      formacionAntes: formacionAntes,
      id_usuario: idUsuario.id,
      id_formacion: validandoCampos.id_formacion,
    });
  } catch (error) {
    console.log(`Error, interno al editar formación: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar formación..."
    );
  }
}
