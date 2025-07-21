import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const usuarios = [
      {
        cedula: 21259230,
        nombre: "master",
        correo: "master@gmail.com",
        token: "6w2r5ks4rb1gd4r1",
        borrado: false,
        id_rol: 1,
        clave: "$2a$05$AJYCQmmmCNb/1Mm08M13qOY6XX3SoYOJgiuogCrMMWi1kQoHzVDry",
      },
      {
        cedula: 2222222,
        nombre: "admin",
        correo: "admin@gmail.com",
        token: "uw8j3v5ks6b82jh3",
        borrado: false,
        id_rol: 2,
        clave: "$2a$05$AJYCQmmmCNb/1Mm08M13qOY6XX3SoYOJgiuogCrMMWi1kQoHzVDry",
      },
      {
        cedula: 3333333,
        nombre: "director",
        correo: "director@gmail.com",
        token: "4hj24ksm9rr3uejf",
        borrado: false,
        id_rol: 3,
        clave: "$2a$05$AJYCQmmmCNb/1Mm08M13qOY6XX3SoYOJgiuogCrMMWi1kQoHzVDry",
      },
      {
        cedula: 4444444,
        nombre: "empleado",
        correo: "empleado@gmail.com",
        token: "7ds92msn1pp2keow",
        borrado: false,
        id_rol: 4,
        clave: "$2a$05$AJYCQmmmCNb/1Mm08M13qOY6XX3SoYOJgiuogCrMMWi1kQoHzVDry",
      },
    ];

    await Promise.all(
      usuarios.map((user) =>
        prisma.usuario.upsert({
          where: { token: user.token }, // o puedes usar 'cedula' o 'correo' si son únicos
          update: {
            correo: user.correo,
            clave: user.clave,
            id_rol: user.id_rol,
            borrado: user.borrado,
          },
          create: user,
        })
      )
    );

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
