import { useState } from "react";

import BloqueInfo from "@/components/BloqueInfo";
import BotonMostrarDetalles from "@/components/botones/BotonMostrarDetalles";
import Div from "@/components/padres/Div";
import Section from "@/components/padres/Section";
import Titulos from "@/components/Titulos";
import DivEntidadAtendida from "./DivEntidadAtendida";
import DivEntidadNoAtendida from "./DivEntidadNoAtendida";

export default function SectionEntidad({ datos, entidad, genero, nombre }) {
  const [abierto, setAbierto] = useState("");

  const toggleEntidadesAgrupadas = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  console.log(datos);
  

  return (
    <>
      <BotonMostrarDetalles
        toggleDetalles={toggleEntidadesAgrupadas}
        nombre={"Entidades agrupadas"}
        index={1}
      />

      {abierto && (
        <Section className="flex flex-col gap-2 rounded-md p-2 border border-[#d1d5dc] hover:border-[#2FA807]">
          <Div className="flex justify-between">
            <Titulos indice={6} titulo={entidad} className={`uppercase`} />

            <BloqueInfo
              nombre={genero ? "Atendidos" : "Atendidas"}
              valor={datos.total_atendidos}
            />
            <BloqueInfo
              nombre={genero ? "No atendidos" : "No atendidas"}
              valor={datos.total_no_atendidos}
            />
          </Div>

          <DivEntidadAtendida
            datos={datos}
            entidad={genero ? "atendidos" : "atendidas"}
            nombre={nombre}
          />
          <DivEntidadNoAtendida
            datos={datos}
            entidad={genero ? "no atendidos" : "no atendidas"}
            nombre={nombre}
          />
        </Section>
      )}
    </>
  );
}
