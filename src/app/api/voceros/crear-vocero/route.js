import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearVocero from "@/services/validarCrearVocero";

export async function POST(request) {
  try {
    const {
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono,
      direccion,
      proyecto,
      certificado,
      verificado,
      id_parroquia,
      id_comuna,
      id_consejo,
      id_circuito,
    } = await request.json();

    const validaciones = await validarCrearVocero(
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono,
      direccion,
      proyecto,
      certificado,
      verificado,
      id_parroquia,
      id_comuna,
      id_consejo,
      id_circuito
    );

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const nuevoVocero = await prisma.vocero.create({
      data: {
        nombre: validaciones.nombre,
        nombre_dos: validaciones.nombreDos,
        apellido: validaciones.apellido,
        apellido_dos: validaciones.apellidoDos,
        cedula: validaciones.cedula,
        genero: validaciones.genero,
        edad: validaciones.edad,
        telefono: validaciones.telefono,
        direccion: validaciones.direccion,
        correo: validaciones.correo,
        token: validaciones.token,
        proyecto: validaciones.proyecto,
        certificado: validaciones.certificado,
        verificado: validaciones.verificado,
        borrado: validaciones.borrado,
        id_usuario: validaciones.id_usuario,
        id_comuna: validaciones.id_comuna,
        id_consejo: validaciones.id_consejo,
        id_circuito: validaciones.id_circuito,
        id_parroquia: validaciones.id_parroquia,
      },
    });

    if (!nuevoVocero) {
      return generarRespuesta(
        "error",
        "Error, no se creo el vocero...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Vocero creado...",
        {
          vocero: nuevoVocero,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (crear vocero): ` + error);

    return generarRespuesta("error", "Error, interno (crear vocero)", {}, 500);
  }
}
