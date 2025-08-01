import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const usuarios = [
      {
        cedula: 21259230,
        nombre: "carlos",
        apellido: "peraza",
        correo: "carlosjperazab@gmail.com",
        token: "6w2r5ks4rb1gd4r1",
        borrado: false,
        validado: true,
        id_rol: 1,
        clave: "$2a$05$qv5dKCZmInzicTS5D0BFu.ThM5g99ScAkKKDjqKfQzMraQjhRnqgS",
      },
      {
        cedula: 20960870,
        nombre: "jhorjan",
        apellido: "cordova",
        correo: "jhorjan2013@gmail.com",
        token: "cs9vot27ih0vm4tb",
        borrado: false,
        validado: true,
        id_rol: 2,
        clave: "$2a$05$029a1Dus7qStop21IuIKCOgGtrge/F6LvDwGgb9pnxz5/uqEQ3MU.",
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
            validado: user.validado,
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
