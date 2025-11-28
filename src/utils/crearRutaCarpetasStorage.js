// utils/CrearCarpetasStorage.js
import { promises as fs } from "fs";
import path from "path";

export class CrearCarpetasStorage {
  /**
   * Crear carpeta en la ruta indicada
   * @param {string} rutaBase - Ruta completa donde se creará la carpeta
   * @param {string} nombreCarpeta - Nombre de la carpeta
   * @returns {string} Ruta creada
   */
  async crearCarpeta(rutaBase, nombreCarpeta) {
    if (!nombreCarpeta || nombreCarpeta.trim() === "") {
      throw new Error("Nombre de carpeta inválido.");
    }

    const nuevaRuta = path.join(rutaBase, nombreCarpeta);
    await fs.mkdir(nuevaRuta, { recursive: true });
    //console.log(`Carpeta creada: ${nuevaRuta}`);
    return nuevaRuta;
  }

  /**
   * Crear archivo en la ruta indicada
   * @param {string} rutaBase - Ruta completa donde se creará el archivo
   * @param {string} nombreArchivo - Nombre del archivo
   * @param {string} contenido - Contenido del archivo
   * @returns {string} Ruta creada
   */
  async crearArchivo(rutaBase, nombreArchivo, contenido) {
    if (!nombreArchivo || nombreArchivo.trim() === "") {
      throw new Error("Nombre de archivo inválido.");
    }
    if (!contenido || contenido.trim() === "") {
      throw new Error("No se puede crear un archivo vacío.");
    }

    const archivoPath = path.join(rutaBase, nombreArchivo);
    await fs.writeFile(archivoPath, contenido);
    console.log(`Archivo creado: ${archivoPath}`);
    return archivoPath;
  }
}
