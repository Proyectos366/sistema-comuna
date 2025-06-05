import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    let contador = 0; // Variable para hacer rif único

    const comunas = [
      "COMUNERO MAYOR MAESTRO ARISTOBULO IZTURIZ",
      "COMUNA SOCIALISTA AGRICOLA FRANCISCO DE MIRANDA",
      "AGROECOLOGICA LOS TANQUES",
      "CUENCA MEDIA ALTA DEL RIO GUARICO",
      "COMUNA EZEQUIEL ZAMORA LOS TOQUITOS",
      "COMUNA SOCIALISTA NUESTRA SEÑORA DE LAS MERCEDES",
      "AGROECOLOGICA SIERRA DEL SUR",
      "COMUNA SOCIALISTA MANUELITA SAENZ",
      "AGRICOLA VALLES DE TAGUAYGUAY",
      "PEDRO CAMEJO",
      "7 DE OCTUBRE",
      "AGRO-ECOLÓGICA LA VELASQUERA EL CHINO",
      "COMUNA JUAN BOLIVAR Y MARTINEZ DE VILLEGAS",
      "COMUNA PRODUCTIVA BATALLA DE BOCA CHICA",
      "GIGANTE HUGO CHAVEZ",
    ].map((nombre) => ({
      nombre,
      id_usuario: 1,
      id_parroquia: 1,
      borrado: false,
      norte: "",
      sur: "",
      este: "",
      oeste: "",
      direccion: "",
      punto: "",
      rif: `j-${Date.now() + contador++}`, // Incrementa milisegundos para hacerlo único
    }));

    for (const comuna of comunas) {
      const existente = await prisma.comuna.findUnique({
        where: { rif: comuna.rif },
      });

      if (!existente) {
        await prisma.comuna.create({ data: comuna });
      } else {
        await prisma.comuna.update({
          where: { id: existente.id },
          data: comuna,
        });
      }
    }

    return generarRespuesta(
      "ok",
      "Comunas creadas o actualizadas correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al guardar comunas:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar comunas.",
      {},
      500
    );
  }
}
