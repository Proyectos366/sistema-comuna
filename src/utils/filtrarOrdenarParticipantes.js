import { logicaEspecialModulosRegex } from "@/utils/regex/logicaEspecialModulosRegex";

export function filtrarOrdenarParticipantes(
  lista,
  usuarios,
  busqueda,
  ordenCampo,
  ordenDireccion,
  camposBusqueda,
) {
  let filtrados = lista;

  // --- Filtrado ---
  if (busqueda) {
    const lower = busqueda.toLowerCase();
    filtrados = filtrados.filter((item) =>
      camposBusqueda.some((campo) =>
        String(item[campo] || "")
          .toLowerCase()
          .includes(lower),
      ),
    );
  }

  // --- Ordenamiento ---
  const asc = ordenDireccion === "asc";

  filtrados.sort((a, b) => {
    let valorA = a[ordenCampo];
    let valorB = b[ordenCampo];

    // Lógica especial para módulos
    const matchModulo = ordenCampo.match(logicaEspecialModulosRegex);
    if (matchModulo) {
      const index = parseInt(matchModulo[1], 10) - 1;
      const asistenciaA = a.asistencias?.[index]?.presente ? 1 : 0;
      const asistenciaB = b.asistencias?.[index]?.presente ? 1 : 0;
      return asc ? asistenciaA - asistenciaB : asistenciaB - asistenciaA;
    }

    // Strings
    if (typeof valorA === "string" && typeof valorB === "string") {
      return asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    }

    // Números
    if (typeof valorA === "number" && typeof valorB === "number") {
      return asc ? valorA - valorB : valorB - valorA;
    }

    return 0;
  });

  return filtrados;
}
