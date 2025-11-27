// utils/storageBuilder.js
import { promises as fs } from "fs";
import path from "path";

export class CrearCarpetasStorage {
  constructor(baseFolder = "storage/instituciones") {
    this.currentPath = path.join(process.cwd(), baseFolder);
  }

  async crearCarpeta(nombreCarpeta) {
    this.currentPath = path.join(this.currentPath, nombreCarpeta);

    try {
      await fs.mkdir(this.currentPath, { recursive: true });
    } catch (error) {
      console.log("Error al crear carpeta: ", error);
    }

    return this.currentPath;
  }

  async crearArchivo(nombreArchivo, contenido) {
    try {
      // 1. Validar nombre
      if (!nombreArchivo || nombreArchivo.trim() === "") {
        throw new Error("Nombre de archivo inválido o vacío.");
      }

      // 2. Validar contenido
      if (!contenido || contenido.trim() === "") {
        throw new Error(
          "No se puede crear un archivo vacío. Debe tener contenido."
        );
      }

      // 3. Construir ruta (ya asumimos que la carpeta existe)
      const archivoPath = path.join(this.currentPath, nombreArchivo);

      // 4. Crear archivo con contenido
      await fs.writeFile(archivoPath, contenido);
      console.log(`Archivo creado: ${archivoPath}`);

      return archivoPath;
    } catch (error) {
      console.error("Error al crear archivo:", error.message);
      return { error: true, message: error.message };
    }
  }

  /** 
    async crearArchivo(nombreArchivo) {
      const archivoPath = path.join(this.currentPath, nombreArchivo);

      try {
        // Crear carpeta padre si no existe
        await fs.mkdir(path.dirname(archivoPath), { recursive: true });

        // Crear archivo vacío si no existe
        await fs.writeFile(archivoPath, "");
        console.log(`Archivo listo: ${archivoPath}`);
      } catch (error) {
        console.error("Error al crear archivo:", error);
      }

      return archivoPath;
    }
  */

  /** 
    async crearArchivo(nombreArchivo, contenido) {
      try {
        // 1. Validar nombre de archivo
        if (
          !nombreArchivo ||
          typeof nombreArchivo !== "string" ||
          nombreArchivo.trim() === ""
        ) {
          throw new Error("Nombre de archivo inválido o vacío.");
        }

        // 2. Validar contenido
        if (!contenido || contenido.trim() === "") {
          throw new Error(
            "No se puede crear un archivo vacío. Debe tener contenido."
          );
        }

        // 3. Construir ruta
        const archivoPath = path.join(this.currentPath, nombreArchivo);

        // 4. Crear carpeta padre si no existe
        await fs.mkdir(path.dirname(archivoPath), { recursive: true });

        // 5. Crear archivo con contenido
        await fs.writeFile(archivoPath, contenido);
        console.log(`Archivo creado: ${archivoPath}`);

        return archivoPath;
      } catch (error) {
        console.error("Error al crear archivo:", error.message);
        return { error: true, message: error.message };
      }
    }
  */
}
