import prisma from "@/libs/prisma";
import validarCrearUsuario from "@/services/validarCrearUsuario";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/crear_usuario/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/crear_usuario/msjCorrectos.json";
import AuthTokens from "@/libs/AuthTokens";

export async function POST(request) {
  try {
    const { cedula, nombre, correo, claveUno, claveDos, departamento } =
      await request.json();

    const validaciones = await validarCrearUsuario(
      cedula,
      nombre,
      correo,
      claveUno,
      claveDos
    );

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const token = AuthTokens.tokenValidarUsuario(10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        cedula,
        nombre,
        correo: validaciones.correo,
        token: token,
        clave: validaciones.claveEncriptada,
        borrado: false,
        id_rol: 4,
        MiembrosDepartamentos: {
          connect: departamento.map(({ id }) => ({ id })),
        },
      },
    });

    if (!nuevoUsuario) {
      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorCrearUsuario.creandoUsuario,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okCrearUsuario.creandoUsuario,
        { redirect: "/" },
        msjCorrectos.codigo.codigo201
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);

    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorCrearUsuario.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
