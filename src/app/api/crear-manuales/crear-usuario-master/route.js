import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const usuarioMaster = {
      nombre: "master",
      correo: "master@gmail.com",
      token: "6w2r5ks4rb1gd4r1",
      borrado: false,
      id_rol: 1,
      clave: "$2a$05$AJYCQmmmCNb/1Mm08M13qOY6XX3SoYOJgiuogCrMMWi1kQoHzVDry",
    };

    await prisma.usuario.upsert({
      where: {
        nombre: usuarioMaster.nombre,
      },
      update: {
        correo: usuarioMaster.correo,
        token: usuarioMaster.token,
        clave: usuarioMaster.clave,
        id_rol: usuarioMaster.id_rol,
        borrado: usuarioMaster.borrado,
      },
      create: usuarioMaster,
    });

    return generarRespuesta(
      "ok",
      "Usuario master creado o actualizado correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al crear/actualizar usuario master:", error);
    return generarRespuesta(
      "error",
      "Error interno al crear o actualizar usuario master...",
      {},
      500
    );
  }
}
