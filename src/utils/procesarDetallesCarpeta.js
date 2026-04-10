/**
 Procesa las carpetas para calcular pesos totales y detalles de los archivos
 @param {Array} todasCarpetas - Lista de carpetas obtenidos de Prisma
 @returns {Array} - Carpetas procesadas con pesos y totales
*/
export default function procesarDetallesCarpeta(todasCarpetas) {
  if (!todasCarpetas || todasCarpetas.length === 0) {
    return [];
  }

  return todasCarpetas.map((carpeta) => ({
    ...carpeta,
    pesoTotal:
      carpeta.archivos?.reduce(
        (sum, archivo) => sum + (archivo.size || 0),
        0,
      ) || 0,
    totalArchivos: carpeta._count?.archivos || 0,
    archivos: carpeta.archivos || [],
  }));
}
