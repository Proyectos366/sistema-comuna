import { useState, useEffect, useRef } from "react";
import { Paginator } from "primereact/paginator";
import { Ripple } from "primereact/ripple";

export default function Paginador({
  first,
  setFirst,
  rows,
  setRows,
  totalRecords,
  colorFondo,
  abierto, setAbierto
}) {

  const color = "#082158";

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const template = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",

    PrevPageLink: (options) => (
      <button
        type="button"
        className={`border py-1 me-1 text-sm rounded-md font-semibold ${
          options.disabled
            ? "border border-gray-300 bg-white text-[color]"
            : `border bg-[${color}] text-white`
        } cursor-pointer transition hover:scale-105 duration-500`}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className="py-2 px-3">Anterior</span>
        <Ripple />
      </button>
    ),
    NextPageLink: (options) => (
      <button
        type="button"
        className={`border py-1 mx-1 text-sm rounded-md font-semibold ${
          options.disabled
            ? "border border-gray-300 bg-white text-[color]"
            : `border bg-[${color}] text-white`
        } cursor-pointer transition hover:scale-105 duration-500`}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className="py-2 px-3">Siguiente</span>
        <Ripple />
      </button>
    ),
    PageLinks: (options) => {
      const isEllipsis =
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages);

      if (isEllipsis) {
        return <span className="text-gray-400 ">...</span>;
      }

      return (
        <button
          type="button"
          className={`px-2 rounded mx-[3px] ${
            options.page === options.currentPage
              ? `bg-[${color}] text-white`
              : "bg-white border border-gray-300"
          } cursor-pointer transition hover:scale-105 duration-500`}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: () => {
      
      const dropdownRef = useRef(null);
      const opcionesBase = [1, 10, 25, 50, 100];
      const incluirTodos = totalRecords > 100;
      const opciones = incluirTodos
        ? [...opcionesBase, "todos"]
        : opcionesBase;

      useEffect(() => {
        const cerrar = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setAbierto(false);
          }
        };
        document.addEventListener("click", cerrar);
        return () => document.removeEventListener("click", cerrar);
      }, []);

      return (
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setAbierto(!abierto)}
            className={`flex justify-between items-center text-sm px-4 py-1 rounded-md shadow-md bg-white cursor-pointer transition hover:scale-105 duration-500 border ${
              abierto ? `border-[${color}]` : "border-gray-300"
            }`}
          >
            <span className={`text-[${color}] font-semibold`}>
              {rows} por página
            </span>
          </div>

          {abierto && (
            <ul className="absolute z-10 mt-1 w-full flex flex-col gap-2 bg-white p-2 rounded-md shadow-lg border border-[#082158] max-h-[200px] overflow-y-auto no-scrollbar">
              {opciones.map((valor) => {
                const esActivo =
                  (valor === "todos" && rows === totalRecords) ||
                  rows === valor;

                return (
                  <li
                    key={`rows-${valor}`}
                    onClick={() => {
                      setFirst(0);
                      setRows(valor === "todos" ? totalRecords : valor);
                      setAbierto(false);
                    }}
                    className={`px-4 py-1 text-sm rounded-md cursor-pointer transition font-semibold ${
                      esActivo
                        ? "bg-gray-200 border border-gray-500"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {valor === "todos" ? "Mostrar todos" : `${valor}`}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    },
    CurrentPageReport: (options) => (
      <span className={`px-2 py-1 text-[${color}] text-sm`}>
        Página {options.currentPage} de {options.totalPages}
      </span>
    ),
  };

  return (
    <Paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
      template={template}
      className={`!flex ${colorFondo ? colorFondo : '!bg-gray-200'}  !border !border-gray-300 !rounded-md !shadow-md`}
    />
  );
}