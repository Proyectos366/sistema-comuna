import fs from "fs";
import path from "path";
import {
  generarRespuesta,
  generarRespuestaBinaria,
} from "@/utils/respuestasAlFront";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return generarRespuesta(
        "error",
        "Error, no se encuentra la imagen...",
        {},
        400
      );
    }

    const fullPath = path.join(process.cwd(), "storage", imagePath);
    if (!fs.existsSync(fullPath)) {
      return generarRespuesta("error", "Error imagen no encontrada", {}, 404);
    }

    const imageBuffer = fs.readFileSync(fullPath);

    const ext = path.extname(imagePath).slice(1);
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

    return generarRespuestaBinaria(imageBuffer, mimeType, 200);
  } catch (error) {
    console.log("Error interno al mostrar img perfil: " + error);

    return generarRespuesta(
      "error",
      "Error interno, mostrar img perfil...",
      {},
      400
    );
  }
}
