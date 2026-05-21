export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const unidades = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Para Bytes, no usar decimales
  const decimales = i === 0 ? 0 : 2;

  return `${(bytes / Math.pow(k, i)).toFixed(decimales)} ${unidades[i]}`;
}
