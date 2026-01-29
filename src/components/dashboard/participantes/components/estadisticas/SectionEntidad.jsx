import BloqueInfo from "@/components/BloqueInfo";
import BotonMostrarDetalles from "@/components/botones/BotonMostrarDetalles";
import Div from "@/components/padres/Div";
import Section from "@/components/padres/Section";
import Titulos from "@/components/Titulos";
import { useState } from "react";

export default function SectionEntidad({ analisis, entidad, genero }) {
  const [abierto, setAbierto] = useState("");

  const toggleEntidadesAgrupadas = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  return (
    <>
      <BotonMostrarDetalles
        toggleDetalles={toggleEntidadesAgrupadas}
        nombre={"Entidades agrupadas"}
        index={1}
      />

      {abierto && (
        <Section className="flex flex-col gap-2 rounded-md p-2 border border-[#d1d5dc] hover:border-[#2FA807]">
          <Titulos indice={6} titulo={entidad} className={`uppercase`} />

          <div>
            <BloqueInfo
              nombre={genero ? 'Atendidos' : 'Atendidas'}
              valor={analisis.comunas.total_atendidos}
            />
            <BloqueInfo
              nombre={genero ? "No atendidos" : N}
              valor={analisis.comunas.total_no_atendidos}
            />
          </div>

          <Div className="mb-8">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              Comunas Atendidas ({analisis.comunas.total_atendidos})
            </h3>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analisis.comunas.atendidos.map((comuna) => (
                <Div
                  key={comuna.id}
                  className="border border-green-200 rounded-lg p-4 bg-green-50"
                >
                  <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                  <p className="text-sm text-gray-600">ID: {comuna.id}</p>
                  <p className="text-xs text-gray-500">
                    Parroquia: {comuna.parroquia?.nombre || "Sin parroquia"}
                  </p>
                </Div>
              ))}
            </Div>
          </Div>

          <Div>
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Comunas No Atendidas ({analisis.comunas.total_no_atendidos})
            </h3>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analisis.comunas.no_atendidos.map((comuna) => (
                <Div
                  key={comuna.id}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                  <p className="text-sm text-gray-600">ID: {comuna.id}</p>
                </Div>
              ))}
            </Div>
          </Div>
        </Section>
      )}
    </>
  );
}
