"use client";
import { formatearFecha } from "@/utils/Fechas";
import ListaDetallesVocero from "./ListaDetalleVocero";
import BotonEditar from "../botones/BotonEditar";
import { formatearCedula } from "@/utils/formatearCedula";
import { formatearTelefono } from "@/utils/formatearTelefono";

import { useEffect, useRef } from "react";

export default function DetallesListadoVoceros({
  abierto,
  index,
  vocero,
  editar,
  setAbierto, // ← Necesitarás pasar esta función desde el padre
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setAbierto(null); // o `false`, depende cómo estés manejando el estado
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setAbierto]);

  return (
    <>
      {abierto === index && (
        <div
          ref={wrapperRef}
          className="bg-white text-gray-800 text-base sm:text-sm rounded-b-md p-4 shadow-lg"
        >
          <div className="relative w-full flex items-center">
            <ListaDetallesVocero
              indice={1}
              nombre={"Cédula"}
              valor={formatearCedula(vocero.cedula)}
            />

            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <BotonEditar editar={() => editar(vocero)} />
            </div>
          </div>

          <ListaDetallesVocero indice={1} nombre={"Edad"} valor={vocero.edad} />
          <ListaDetallesVocero
            indice={1}
            nombre={"Género"}
            valor={vocero.genero ? "Masculino" : "Femenino"}
          />
          <ListaDetallesVocero
            indice={1}
            nombre={"Correo"}
            valor={vocero.correo}
          />
          <ListaDetallesVocero
            indice={1}
            nombre={"Teléfono"}
            valor={formatearTelefono(vocero.telefono)}
          />

          <ListaDetallesVocero
            indice={1}
            nombre={"Cargo"}
            valor={vocero?.cargos?.[0]?.nombre ?? "No asignado"}
          />

          <ListaDetallesVocero
            indice={1}
            nombre={"Comuna"}
            valor={vocero.comunas?.nombre || "Sin comuna"}
          />
          <ListaDetallesVocero
            indice={1}
            nombre={"Consejo comunal"}
            valor={vocero.consejos?.nombre || "No asignado"}
          />

          {vocero.cursos?.length > 0 ? (
            vocero.cursos.map((curso, i) => (
              <div key={i} className="mt-4 border-t border-gray-300 pt-2">
                <ListaDetallesVocero
                  indice={1}
                  nombre={"Formación"}
                  valor={curso.formaciones?.nombre || "Sin formación"}
                />

                <ListaDetallesVocero
                  indice={2}
                  nombre={"Verificado"}
                  valor={curso.verificado}
                />

                <ListaDetallesVocero
                  indice={2}
                  nombre={"Certificado"}
                  valor={curso.certificado}
                />

                <ul className="mt-2 list-disc list-inside text-sm text-gray-700 flex flex-col gap-2">
                  {curso.asistencias.map((asistencia, j) => {
                    return (
                      <li key={j} className="flex gap-2">
                        <ListaDetallesVocero
                          indice={3}
                          nombre={asistencia.modulos?.nombre}
                          valor={asistencia.presente}
                          fecha={formatearFecha(asistencia.fecha_registro)}
                          formador={asistencia.formador}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <p className="mt-4 italic text-gray-500">
              Este vocero no ha participado en cursos.
            </p>
          )}
        </div>
      )}
    </>
  );
}
