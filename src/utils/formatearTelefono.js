export function formatearTelefono(numero) {
  const limpio = numero.toString().replace(/\D/g, ""); // quita todo lo que no es número

  if (limpio.length !== 11) return "Número inválido"; // validar longitud típica (04xx + 7 dígitos)

  const prefijo = limpio.slice(0, 4); // Ej: 0414
  const parte1 = limpio.slice(4, 7); // Ej: 202
  const parte2 = limpio.slice(7, 9); // Ej: 20
  const parte3 = limpio.slice(9); // Ej: 20

  return `${prefijo}-${parte1}.${parte2}.${parte3}`;
}
