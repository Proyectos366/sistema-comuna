"use client";

import { useState, useEffect, useRef } from "react";

import Button from "@/components/padres/Button";
import Div from "@/components/padres/Div";
import Li from "@/components/padres/Li";
import Span from "@/components/padres/Span";
import Ul from "@/components/padres/Ul";

export default function OrdenarLista({
  ordenCampo,
  setOrdenCampo,
  ordenDireccion,
  setOrdenDireccion,
  opcionesOrden,
}) {
  const [abierto, setAbierto] = useState(false);
  const selectRef = useRef(null);

  const seleccionActual = opcionesOrden.find((o) => o.id === ordenCampo);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Div className="flex gap-2 items-center relative" ref={selectRef}>
      <Div className="w-full">
        <Div
          className={` flex justify-between items-center border w-full py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer hover:font-semibold
            ${
              ordenDireccion === "asc"
                ? "border-[#2FA807] text-[#2FA807]"
                : "border-[#E61C45] text-[#E61C45]"
            }`}
          onClick={() => {
            console.log("aosjdhoajshd");
            setAbierto(!abierto);
          }}
        >
          <Span className="whitespace-nowrap">
            {seleccionActual?.nombre || "Seleccione"}
          </Span>
        </Div>

        {abierto && (
          <Ul
            className={`absolute z-10 mt-1 w-full bg-white px-2 no-scrollbar border ${
              ordenDireccion === "asc" ? "border-[#2FA807]" : "border-[#E61C45]"
            } rounded-md shadow-md max-h-[300px] overflow-y-auto`}
          >
            {opcionesOrden.map((opcion, index) => (
              <Li
                key={opcion.id}
                className={` p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer transition duration-150 rounded-md mt-2 ${
                  index === opcionesOrden.length - 1 ? "mb-2" : ""
                }`}
                onClick={() => {
                  setOrdenCampo(opcion.id);
                  setAbierto(false);
                }}
              >
                {opcion.nombre}
              </Li>
            ))}
          </Ul>
        )}
      </Div>

      <Button
        onClick={() =>
          setOrdenDireccion((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        className={`px-3 py-2 rounded-md text-white font-medium cursor-pointer transition-all shadow-md hover:scale-105 ${
          ordenDireccion === "asc" ? "bg-[#2FA807]" : "bg-[#E61C45]"
        }`}
      >
        <Span className="hidden sm:block">
          {ordenDireccion === "asc" ? "Ascendente" : "Descendente"}
        </Span>
        <Span className="block sm:hidden">
          {ordenDireccion === "asc" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M12 4l-8 8h6v8h4v-8h6z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M12 20l8-8h-6v-8h-4v8h-6z" />
            </svg>
          )}
        </Span>
      </Button>
    </Div>
  );
}
