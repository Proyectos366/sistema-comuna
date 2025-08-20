import React from "react";
import ListaDetallesVocero from "./ListaDetalleVocero";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import { formatearFecha } from "@/utils/Fechas";

export default function ListadoNovedadDepartamento({
  novedad,
  index,
  abiertos,
  toggleDetalle,
  aceptarNovedad,
  idNovedad,
}) {
  const esPendiente = novedad.estatus === "pendiente";

  return (
    <div
      className={`border bg-[#eef1f5] ${
        esPendiente
          ? "border-[#E61C45] text-[#E61C45]"
          : "border-[#2FA807] text-[#2FA807]"
      } rounded-md`}
    >
      <button
        onClick={() => toggleDetalle(index)}
        className={`w-full sm:text-left font-semibold tracking-wide uppercase px-2 sm:px-6 py-2 cursor-pointer transition-colors duration-200
          ${
            abiertos[index]
              ? "rounded-t-md mb-2 sm:mb-0"
              : "rounded-md hover:rounded-b-none"
          }
          ${
            esPendiente
              ? "hover:bg-[#E61C45] text-[#E61C45] hover:text-white"
              : "hover:bg-[#15EA0E] text-[#2FA807] hover:text-white"
          }`}
      >
        {novedad.nombre}
      </button>

      {abiertos[index] && (
        <div className="flex flex-col gap-1 bg-white text-gray-800 text-base sm:text-sm px-2 sm:px-6 py-1 rounded-b-md shadow-lg">
          <ListaDetallesVocero
            indice={1}
            nombre="Descripción"
            valor={novedad.descripcion}
          />
          <ListaDetallesVocero
            indice={1}
            nombre="Prioridad"
            valor={novedad.prioridad}
          />
          <ListaDetallesVocero
            indice={1}
            nombre="Creada"
            valor={formatearFecha(novedad.fechaCreacion)}
          />

          {novedad.vista === "creador" ? (
            <ListaDetallesVocero
              indice={6}
              nombre="Estatus"
              valor={novedad.estatus}
            />
          ) : esPendiente ? (
            <div className="sm:max-w-1/3">
              <BotonAceptarCancelar
                indice="aceptar"
                aceptar={() => aceptarNovedad && aceptarNovedad(novedad)}
                nombre="Aceptar"
                campos={idNovedad}
              />
            </div>
          ) : (
            <ListaDetallesVocero
              indice={6}
              nombre="Estatus"
              valor={novedad.estatus}
            />
          )}
        </div>
      )}
    </div>
  );
}
