export default class FormatearPeso {
  static formatearPesoEstante(pesoEnBytes) {
    try {
      let resultadoFormateado;

      if (isNaN(pesoEnBytes) || pesoEnBytes <= 0 || !pesoEnBytes) {
        resultadoFormateado = `0 Bytes`; // Si es menor que 1 KB, lo dejamos en bytes
      } else if (pesoEnBytes < 1024) {
        resultadoFormateado = `${pesoEnBytes} Bytes`; // Si es menor que 1 KB, lo dejamos en bytes
      } else if (pesoEnBytes < 1024 * 1024) {
        resultadoFormateado = `${(pesoEnBytes / 1024).toFixed(2)} KB`; // Convertimos a KB
      } else if (pesoEnBytes < 1024 * 1024 * 1024) {
        resultadoFormateado = `${(pesoEnBytes / (1024 * 1024)).toFixed(2)} MB`; // Convertimos a MB
      } else {
        resultadoFormateado = `${(pesoEnBytes / (1024 * 1024 * 1024)).toFixed(
          2
        )} GB`;
      }

      // Retornamos la respuesta estructurada
      return {
        status: "ok",
        message: "Peso formateado correctamente.",
        resultado: resultadoFormateado,
      };
    } catch (error) {
      // Manejo de errores
      console.error(`Error al formatear el peso: ${error.message}`);
      return {
        status: "error",
        message: "Error al formatear el peso.",
        resultado: null,
      };
    }
  }
}
