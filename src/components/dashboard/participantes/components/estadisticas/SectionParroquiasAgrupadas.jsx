import { useState } from "react";

import BotonMostrarDetalles from "@/components/botones/BotonMostrarDetalles";
import Section from "@/components/padres/Section";
import Div from "@/components/padres/Div";
import Titulos from "@/components/Titulos";
import BloqueInfo from "@/components/BloqueInfo";
import { formatearFecha } from "@/utils/Fechas";

export default function SectionParroquiasAgrupadas({ analisis }) {
  const [abierto, setAbierto] = useState("");

  const toggleComunasAgrupadasParroquia = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  return (
    <>
      <BotonMostrarDetalles
        toggleDetalles={toggleComunasAgrupadasParroquia}
        nombre={"Comunas agrupadas por parroquia"}
        index={1}
      />

      {abierto && (
        <>
          <Section className="flex flex-col gap-2 rounded-md p-2 border border-[#d1d5dc] hover:border-[#2FA807]">
            {Object.entries(analisis.comunas.agrupadas_por_parroquia).map(
              ([parroquiaNombre, grupo]) => (
                <Div key={parroquiaNombre} className="flex flex-col  p-2">
                  <Titulos
                    indice={6}
                    titulo={`${parroquiaNombre}`}
                    className={`uppercase`}
                  />

                  <Div className="border rounded-md flex gap-4 p-2">
                    {grupo.entidades.map((comuna) => (
                      <Div key={comuna.id} className="flex flex-col gap-1">
                        <BloqueInfo nombre={"Comuna"} valor={comuna.nombre} />
                        <BloqueInfo
                          nombre={"Formación"}
                          valor={comuna?.formacion?.nombre}
                        />
                        <BloqueInfo
                          nombre={"Primera atención"}
                          valor={formatearFecha(comuna.fecha_primer_atendido)}
                        />
                        <BloqueInfo
                          nombre={"Última atención"}
                          valor={formatearFecha(comuna.fecha_ultimo_atendido)}
                        />
                      </Div>
                    ))}
                  </Div>
                </Div>
              ),
            )}
          </Section>
        </>
      )}
    </>
  );
}
