import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const estados = [
      {
        nombre: "amazonas",
        capital: "puerto ayacucho",
        cod_postal: "7101",
        serial: "ven-01",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "anzoátegui",
        capital: "barcelona",
        cod_postal: "6001",
        serial: "ven-02",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "apure",
        capital: "san fernando de apure",
        cod_postal: "7001",
        serial: "ven-03",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "aragua",
        capital: "maracay",
        cod_postal: "2101",
        serial: "ven-04",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "barinas",
        capital: "barinas",
        cod_postal: "5201",
        serial: "ven-05",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "bolívar",
        capital: "ciudad bolívar",
        cod_postal: "8001",
        serial: "ven-06",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "carabobo",
        capital: "valencia",
        cod_postal: "2001",
        serial: "ven-07",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "cojedes",
        capital: "san carlos",
        cod_postal: "2201",
        serial: "ven-08",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "delta amacuro",
        capital: "tucupita",
        cod_postal: "6401",
        serial: "ven-09",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "falcón",
        capital: "coro",
        cod_postal: "4101",
        serial: "ven-10",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "guárico",
        capital: "san juan de los morros",
        cod_postal: "2301",
        serial: "ven-11",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "lara",
        capital: "barquisimeto",
        cod_postal: "3001",
        serial: "ven-12",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "mérida",
        capital: "mérida",
        cod_postal: "5101",
        serial: "ven-13",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "miranda",
        capital: "los teques",
        cod_postal: "1201",
        serial: "ven-14",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "monagas",
        capital: "maturín",
        cod_postal: "6201",
        serial: "ven-15",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "nueva esparta",
        capital: "la asunción",
        cod_postal: "6301",
        serial: "ven-16",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "portuguesa",
        capital: "guanare",
        cod_postal: "3350",
        serial: "ven-17",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "sucre",
        capital: "cumaná",
        cod_postal: "6101",
        serial: "ven-18",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "tachira",
        capital: "san cristóbal",
        cod_postal: "5001",
        serial: "ven-19",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "trujillo",
        capital: "trujillo",
        cod_postal: "3150",
        serial: "ven-20",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "vargas",
        capital: "la guaira",
        cod_postal: "1160",
        serial: "ven-21",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "yaracuy",
        capital: "san felipe",
        cod_postal: "3201",
        serial: "ven-22",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "zulia",
        capital: "maracaibo",
        cod_postal: "4001",
        serial: "ven-23",
        id_pais: 1,
        id_usuario: 1,
      },
    ];

    const existentes = await prisma.estado.findMany({
      where: {
        serial: {
          in: estados.map((e) => e.serial),
        },
      },
    });

    const existentesMap = new Map(existentes.map((e) => [e.serial, e]));

    for (const estado of estados) {
      const existente = existentesMap.get(estado.serial);

      if (!existente) {
        await prisma.estado.create({ data: estado });
      } else {
        await prisma.estado.update({
          where: { id: existente.id },
          data: estado,
        });
      }
    }

    return generarRespuesta(
      "ok",
      "Estados creados o actualizados correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al guardar estados:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar estados.",
      {},
      500
    );
  }
}
