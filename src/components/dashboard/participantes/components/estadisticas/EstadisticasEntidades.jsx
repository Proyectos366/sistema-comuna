"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import Titulos from "@/components/Titulos";
import Section from "@/components/padres/Section";
import BloqueInfo from "@/components/BloqueInfo";
import { analizarEntidadesAtendidas } from "@/components/dashboard/participantes/function/analizarEntidadesAtendidas";
import BotonMostrarDetalles from "@/components/botones/BotonMostrarDetalles";

import { formatearFecha } from "@/utils/Fechas";
import Div from "@/components/padres/Div";
import SectionParroquiasAgrupadas from "./SectionParroquiasAgrupadas";
import SectionEntidad from "./SectionEntidad";

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
      />

      <SectionEntidad
        datos={analisis.consejos}
        genero={true}
        entidad={"consejos"}
        nombre={"consejo"}
      />
    </>
  );
}

{
  /* {Object.entries(analisis.comunas.agrupadas_por_parroquia).map(
          ([parroquiaNombre, grupo]) => (
            <Div key={parroquiaNombre} className="mb-8">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                {parroquiaNombre} ({grupo.cantidad} comunas)
              </h3>
              <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grupo.entidades.map((comuna) => (
                  <Div
                    key={comuna.id}
                    className="border border-blue-200 rounded-lg p-4 bg-blue-50"
                  >
                    <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                    <p className="text-sm text-gray-600">ID: {comuna.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 Primera:{" "}
                      {new Date(
                        comuna.fecha_primer_atendido,
                      ).toLocaleDateString()}
                    </p>
                  </Div>
                ))}
              </Div>
            </Div>
          ),
        )} */
}

/** 
export default function EstadisticasEntidades({}) {
  const { cursos } = useSelector((state) => state.cursos);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos } = useSelector((state) => state.consejos);

  const [abierto, setAbierto] = useState("");

  const analisis = analizarEntidadesAtendidas(
    cursos,
    comunas,
    circuitos,
    consejos,
  );

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  return (
    <Div className="border">
      <BotonMostrarDetalles
        toggleDetalles={toggleVocero}
        nombre={"Detalles estadistica"}
        index={1}
      />

      {abierto && (
        <>
          <Section className="bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Comunas
              <span className="ml-2 text-sm font-normal text-gray-600">
                {analisis.comunas.total_atendidos} atendidas /{" "}
                {analisis.comunas.total_no_atendidos} no atendidas
              </span>
            </h2>

            <Div className="mb-8">
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Comunas Atendidas ({analisis.comunas.total_atendidos})
              </h3>
              <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analisis.comunas.atendidos?.map((comuna) => (
                  <Div
                    key={comuna.id}
                    className="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ID: {comuna.id}
                    </p>

                    <Div className="mt-3">
                      <p className="text-xs text-gray-500">
                        📅 Primera atención:{" "}
                        {new Date(
                          comuna.fecha_primer_atendido,
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        📅 Última atención:{" "}
                        {new Date(
                          comuna.fecha_ultimo_atendido,
                        ).toLocaleDateString()}
                      </p>
                    </Div>

                    <Div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Módulos atendidos ({comuna.modulos.length}):
                      </p>
                      <Div className="space-y-1 mt-1">
                        {comuna.modulos.map((modulo, idx) => (
                          <Div
                            key={idx}
                            className="text-xs bg-white p-2 rounded border"
                          >
                            <span className="font-medium">
                              Módulo {modulo.id}
                            </span>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded ${modulo.validado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {modulo.validado ? "✓ Validado" : "Pendiente"}
                            </span>
                            <p className="text-gray-500 mt-0.5">
                              {new Date(
                                modulo.fecha_validada,
                              ).toLocaleDateString()}
                            </p>
                          </Div>
                        ))}
                      </Div>
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>

            <Div>
              <h3 className="text-lg font-semibold text-red-700 mb-3">
                Comunas No Atendidas ({analisis.comunas.total_no_atendidos})
              </h3>
              <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analisis.comunas.no_atendidos?.map((comuna) => (
                  <Div
                    key={comuna.id}
                    className="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ID: {comuna.id}
                    </p>
                    <Div className="mt-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-full">
                        Sin atención
                      </span>
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>
          </Section>

          <Section className="bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Circuitos Comunales
              <span className="ml-2 text-sm font-normal text-gray-600">
                {analisis.circuitos.total_atendidos} atendidos /{" "}
                {analisis.circuitos.total_no_atendidos} no atendidos
              </span>
            </h2>

            {analisis.circuitos.atendidos.length > 0 ? (
              <Div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Circuitos Atendidos ({analisis.circuitos.total_atendidos})
                </h3>
                <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analisis.circuitos.atendidos.map((circuito) => (
                    <Div
                      key={circuito.id}
                      className="border border-blue-200 rounded-lg p-4 bg-blue-50"
                    >
                      <h4 className="font-bold text-gray-800">
                        {circuito.nombre}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {circuito.id}</p>
                    </Div>
                  ))}
                </Div>
              </Div>
            ) : (
              <p className="text-gray-500 italic">
                No hay circuitos atendidos registrados.
              </p>
            )}

            {analisis.circuitos.no_atendidos.length > 0 && (
              <Div>
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  Circuitos No Atendidos (
                  {analisis.circuitos.total_no_atendidos})
                </h3>
                <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {analisis.circuitos.no_atendidos.map((circuito) => (
                    <Div
                      key={circuito.id}
                      className="border border-red-200 rounded-lg p-3 bg-red-50"
                    >
                      <h4 className="font-medium text-gray-800 text-sm">
                        {circuito.nombre}
                      </h4>
                      <p className="text-xs text-gray-600">ID: {circuito.id}</p>
                    </Div>
                  ))}
                </Div>
              </Div>
            )}
          </Section>

          <Section className="bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Consejos Comunales
              <span className="ml-2 text-sm font-normal text-gray-600">
                {analisis.consejos.total_atendidos} atendidos /{" "}
                {analisis.consejos.total_no_atendidos} no atendidos
              </span>
            </h2>

            {analisis.consejos.atendidos.length > 0 ? (
              <Div className="mb-8">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">
                  Consejos Atendidos ({analisis.consejos.total_atendidos})
                </h3>
                <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analisis.consejos.atendidos.map((consejo) => (
                    <Div
                      key={consejo.id}
                      className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                    >
                      <h4 className="font-bold text-gray-800">
                        {consejo.nombre}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {consejo.id}</p>
                    </Div>
                  ))}
                </Div>
              </Div>
            ) : (
              <p className="text-gray-500 italic">
                No hay consejos atendidos registrados.
              </p>
            )}

            {analisis.consejos.no_atendidos.length > 0 && (
              <Div>
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  Consejos No Atendidos ({analisis.consejos.total_no_atendidos})
                </h3>
                <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {analisis.consejos.no_atendidos.map((consejo) => (
                    <Div
                      key={consejo.id}
                      className="border border-red-200 rounded-lg p-3 bg-red-50"
                    >
                      <h4 className="font-medium text-gray-800 text-sm">
                        {consejo.nombre}
                      </h4>
                      <p className="text-xs text-gray-600">ID: {consejo.id}</p>
                    </Div>
                  ))}
                </Div>
              </Div>
            )}
          </Section>
        </>
      )}
    </Div>
  );
}
*/

/** 
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
    <Div className="p-4 space-y-8">
      <Section className="bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Comunas
          <span className="ml-2 text-sm font-normal text-gray-600">
            {comunas.total_atendidos} atendidas / {comunas.total_no_atendidos}{" "}
            no atendidas
          </span>
        </h2>

        <Div className="mb-8">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            Comunas Atendidas ({comunas.total_atendidos})
          </h3>
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comunas.atendidas.map((comuna) => (
              <Div
                key={comuna.id}
                className="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                <p className="text-sm text-gray-600 mt-1">ID: {comuna.id}</p>

                <Div className="mt-3">
                  <p className="text-xs text-gray-500">
                    📅 Primera atención:{" "}
                    {new Date(
                      comuna.fecha_primer_atendido,
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    📅 Última atención:{" "}
                    {new Date(
                      comuna.fecha_ultimo_atendido,
                    ).toLocaleDateString()}
                  </p>
                </Div>

                <Div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Módulos atendidos ({comuna.modulos.length}):
                  </p>
                  <Div className="space-y-1 mt-1">
                    {comuna.modulos.map((modulo, idx) => (
                      <Div
                        key={idx}
                        className="text-xs bg-white p-2 rounded border"
                      >
                        <span className="font-medium">Módulo {modulo.id}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded ${modulo.validado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {modulo.validado ? "✓ Validado" : "Pendiente"}
                        </span>
                        <p className="text-gray-500 mt-0.5">
                          {new Date(modulo.fecha_validada).toLocaleDateString()}
                        </p>
                      </Div>
                    ))}
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>

        <Div>
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            Comunas No Atendidas ({comunas.total_no_atendidos})
          </h3>
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comunas.no_atendidas.map((comuna) => (
              <Div
                key={comuna.id}
                className="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <h4 className="font-bold text-gray-800">{comuna.nombre}</h4>
                <p className="text-sm text-gray-600 mt-1">ID: {comuna.id}</p>
                <Div className="mt-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-full">
                    Sin atención
                  </span>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      </Section>

      <Section className="bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Circuitos Comunales
          <span className="ml-2 text-sm font-normal text-gray-600">
            {circuitos.total_atendidos} atendidos /{" "}
            {circuitos.total_no_atendidos} no atendidos
          </span>
        </h2>

        {circuitos.atendidos.length > 0 ? (
          <Div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              Circuitos Atendidos ({circuitos.total_atendidos})
            </h3>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {circuitos.atendidos.map((circuito) => (
                <Div
                  key={circuito.id}
                  className="border border-blue-200 rounded-lg p-4 bg-blue-50"
                >
                  <h4 className="font-bold text-gray-800">{circuito.nombre}</h4>
                  <p className="text-sm text-gray-600">ID: {circuito.id}</p>
                </Div>
              ))}
            </Div>
          </Div>
        ) : (
          <p className="text-gray-500 italic">
            No hay circuitos atendidos registrados.
          </p>
        )}

        {circuitos.no_atendidos.length > 0 && (
          <Div>
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Circuitos No Atendidos ({circuitos.total_no_atendidos})
            </h3>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {circuitos.no_atendidos.map((circuito) => (
                <Div
                  key={circuito.id}
                  className="border border-red-200 rounded-lg p-3 bg-red-50"
                >
                  <h4 className="font-medium text-gray-800 text-sm">
                    {circuito.nombre}
                  </h4>
                  <p className="text-xs text-gray-600">ID: {circuito.id}</p>
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </Section>

      <Section className="bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Consejos Comunales
          <span className="ml-2 text-sm font-normal text-gray-600">
            {consejos.total_atendidos} atendidos / {consejos.total_no_atendidos}{" "}
            no atendidos
          </span>
        </h2>

        {consejos.atendidos.length > 0 ? (
          <Div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">
              Consejos Atendidos ({consejos.total_atendidos})
            </h3>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consejos.atendidos.map((consejo) => (
                <Div
                  key={consejo.id}
                  className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                >
                  <h4 className="font-bold text-gray-800">{consejo.nombre}</h4>
                  <p className="text-sm text-gray-600">ID: {consejo.id}</p>
                </Div>
              ))}
            </Div>
          </Div>
        ) : (
          <p className="text-gray-500 italic">
            No hay consejos atendidos registrados.
          </p>
        )}

        {consejos.no_atendidos.length > 0 && (
          <Div>
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Consejos No Atendidos ({consejos.total_no_atendidos})
            </h3>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {consejos.no_atendidos.map((consejo) => (
                <Div
                  key={consejo.id}
                  className="border border-red-200 rounded-lg p-3 bg-red-50"
                >
                  <h4 className="font-medium text-gray-800 text-sm">
                    {consejo.nombre}
                  </h4>
                  <p className="text-xs text-gray-600">ID: {consejo.id}</p>
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </Section>
    </Div>
  );
}
*/
