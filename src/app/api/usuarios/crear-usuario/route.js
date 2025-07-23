import prisma from "@/libs/prisma";
import validarCrearUsuario from "@/services/validarCrearUsuario";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/crear_usuario/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/crear_usuario/msjCorrectos.json";
import AuthTokens from "@/libs/AuthTokens";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const {
      cedula,
      nombre,
      apellido,
      correo,
      claveUno,
      claveDos,
      departamento,
    } = await request.json();

    const validaciones = await validarCrearUsuario(
      cedula,
      nombre,
      apellido,
      correo,
      claveUno,
      claveDos
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Validacion fallida al intentar crear usuario",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const token = AuthTokens.tokenValidarUsuario(10);

    const [nuevoUsuario, usuarioConDepartamentos] = await prisma.$transaction([
      // Se crea el nuevo usuario con departamentos conectados
      prisma.usuario.create({
        data: {
          cedula: validaciones.cedula,
          nombre: validaciones.nombre,
          apellido: validaciones.apellido,
          correo: validaciones.correo,
          token: token,
          clave: validaciones.claveEncriptada,
          borrado: false,
          id_rol: 4,
          MiembrosDepartamentos: {
            connect: departamento.map(({ id }) => ({ id })),
          },
        },
      }),

      // Se consulta el mismo usuario recién creado con sus departamentos
      prisma.usuario.findFirst({
        where: {
          correo: validaciones.correo,
        },
        include: {
          MiembrosDepartamentos: true,
        },
      }),
    ]);

    if (!nuevoUsuario) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_CREAR",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "No se pudo crear el usuario",
        datosAntes: null,
        datosDespues: nuevoUsuario,
      });

      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorCrearUsuario.creandoUsuario,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "CREAR",
        id_objeto: usuarioConDepartamentos?.MiembrosDepartamentos?.[0]?.id ?? 0,
        id_usuario: nuevoUsuario.id,
        descripcion: `Usuario creado y se agrego al departamento ${
          usuarioConDepartamentos?.MiembrosDepartamentos?.[0]?.nombre ??
          "sin departamento"
        }`,
        datosAntes: null,
        datosDespues: nuevoUsuario,
      });

      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okCrearUsuario.creandoUsuario,
        { redirect: "/" },
        msjCorrectos.codigo.codigo201
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorCrearUsuario.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
