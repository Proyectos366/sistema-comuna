export default async function procesarFormDataArchivo(request) {
  try {
    const formData = await request.formData();

    const nombre = formData.get("nombre");
    const descripcion = formData.get("descripcion");
    const alias = formData.get("alias");
    const archivo = formData.get("archivo");
    const idCarpeta = formData.get("idCarpeta");

    if (!archivo || archivo.size === 0) {
      return {
        status: "error",
        numero: 0,
        message: "No se ha proporcionado ningún archivo",
      };
    }

    const nombreOriginal = archivo.name;
    const tipo = archivo.type;
    const size = archivo.size;
    const ultimaModificacion = new Date(archivo.lastModified);
    const extension = nombreOriginal.split(".").pop()?.toLowerCase();
    const nombreSinExtension = nombreOriginal.substring(
      0,
      nombreOriginal.lastIndexOf("."),
    );
    const timestamp = Date.now();
    const randomSufix = Math.random().toString(36).substring(2, 8);
    const nombreSistemaFecha = `${nombreSinExtension}_${timestamp}_${randomSufix}.${extension}`;

    return {
      status: "ok",
      numero: 1,
      message: "Archivo procesado con éxito",
      nombre,
      descripcion,
      alias,
      idCarpeta,
      archivo,
      nombreOriginal,
      tipo,
      size,
      ultimaModificacion,
      extension,
      timestamp,
      randomSufix,
      nombreSistemaFecha,
    };
  } catch (error) {
    return {
      status: "error",
      numero: 0,
      message: `Error al procesar el archivo`,
    };
  }
}
