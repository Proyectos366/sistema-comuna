"use client";

import { useSelector } from "react-redux";

import { analizarEntidadesAtendidas } from "@/components/dashboard/participantes/function/analizarEntidadesAtendidas";
import SectionParroquiasAgrupadas from "@/components/dashboard/participantes/components/estadisticas/SectionParroquiasAgrupadas";
import SectionEntidad from "@/components/dashboard/participantes/components/estadisticas/SectionEntidad";

export default function EstadisticasEntidades({}) {
  const { cursos } = useSelector((state) => state.cursos);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos } = useSelector((state) => state.consejos);

  const analisis = analizarEntidadesAtendidas(
    cursos,
    comunas,
    circuitos,
    consejos,
  );

  return (
    <>
      <SectionParroquiasAgrupadas analisis={analisis} />

      <SectionEntidad
        datos={analisis.comunas}
        genero={false}
        entidad={"comunas"}
        nombre={"comuna"}
        nombreOrden={"Comunas agrupadas"}
      />

      <SectionEntidad
        datos={analisis.circuitos}
        genero={true}
        entidad={"circuitos"}
        nombre={"circuito"}
        nombreOrden={"Circuitos agrupados"}
      />

      <SectionEntidad
        datos={analisis.consejos}
        genero={true}
        entidad={"consejos"}
        nombre={"consejo"}
        nombreOrden={"Consejos comunales agrupados"}
      />
    </>
  );
}
