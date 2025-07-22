import React, { useState, useMemo } from "react";
import Input from "../inputs/Input";
import DetallesListadoVoceros from "./DetallesListadoVoceros";
import Leyenda from "./Leyenda";
import OrdenarLista from "./Ordenar";
import Paginador from "../templates/PlantillaPaginacion";

export default function ListadoVoceros({ voceros, editar, open, setOpen }) {
  const [abierto, setAbierto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  // 🔍 Filtrado completo y optimizado
  const vocerosFiltrados = useMemo(() => {
    if (!searchTerm) return voceros;

    const lower = searchTerm.toLowerCase();

    return voceros?.filter((vocero) =>
      Object.values(vocero).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lower);
        }

        if (typeof value === "boolean") {
          return (value ? "masculino" : "femenino").includes(lower);
        }

        if (typeof value === "object" && value !== null) {
          if (
            value.nombre &&
            String(value.nombre).toLowerCase().includes(lower)
          )
            return true;
          if (Array.isArray(value)) {
            return value.some((item) =>
              Object.values(item).some((itemValue) => {
                if (
                  typeof itemValue === "string" ||
                  typeof itemValue === "number"
                ) {
                  return String(itemValue).toLowerCase().includes(lower);
                }
                if (typeof itemValue === "boolean") {
                  return (itemValue ? "sí" : "no").includes(lower);
                }
                if (
                  typeof itemValue === "object" &&
                  itemValue !== null &&
                  itemValue.nombre
                ) {
                  return String(itemValue.nombre).toLowerCase().includes(lower);
                }
                return false;
              })
            );
          }
        }

        return false;
      })
    );
  }, [voceros, searchTerm]);

  const ordenarVoceros = (lista, campo, asc) => {
    const listaClonada = [...lista];

    return listaClonada.sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];

      if (valorA == null || valorB == null) return 0;

      if (typeof valorA === "number" && typeof valorB === "number") {
        return asc ? valorA - valorB : valorB - valorA;
      }

      return asc
        ? String(valorA)
            .toLowerCase()
            .localeCompare(String(valorB).toLowerCase())
        : String(valorB)
            .toLowerCase()
            .localeCompare(String(valorA).toLowerCase());
    });
  };

  const vocerosOrdenados = ordenarVoceros(
    vocerosFiltrados,
    ordenCampo,
    ordenAscendente
  );
  const vocerosPagina = vocerosOrdenados.slice(first, first + rows);
  const totalRecords = vocerosFiltrados.length;

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  const totalVoceros = vocerosFiltrados.length;
  const totalHombres = vocerosFiltrados.filter((v) => v.genero === true).length;
  const totalMujeres = vocerosFiltrados.filter(
    (v) => v.genero === false
  ).length;
  const totalAdultosMayoresHombres = vocerosFiltrados.filter(
    (v) => v.genero === true && v.edad >= 60
  ).length;
  const totalAdultosMayoresMujeres = vocerosFiltrados.filter(
    (v) => v.genero === false && v.edad >= 55
  ).length;

  if (!Array.isArray(voceros) || voceros.length === 0) {
    return (
      <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
        <p className="text-[#E61C45] font-semibold">
          No hay voceros disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-1 sm:p-6 bg-[#f4f6f9] rounded-md shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 bg-[#eef1f5] p-1 sm:p-4 rounded-md shadow-lg">
        <Input
          type="text"
          placeholder="🔍 Buscar..."
          value={searchTerm}
          className={`bg-white ps-4 placeholder:px-5`}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFirst(0);
          }}
        />

        <OrdenarLista
          ordenCampo={ordenCampo}
          setOrdenCampo={setOrdenCampo}
          setOrdenAscendente={setOrdenAscendente}
          ordenAscendente={ordenAscendente}
        />
      </div>

      <div className="flex flex-col gap-4 border border-gray-300 hover:border-[#082158] p-1 sm:p-4 rounded-md bg-[#f4f6f9] shadow-lg">
        {vocerosPagina.length === 0 && searchTerm !== "" ? (
          <div className="p-4 bg-white rounded-lg text-center text-[#E61C45] font-semibold shadow-lg">
            No se encontraron voceros que coincidan con la búsqueda.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 bg-[#f4f6f9]">
              {vocerosPagina.map((vocero, index) => {
                const tieneCursosNoVerificados = vocero.cursos?.some(
                  (curso) => curso.verificado === true
                );

                const tieneCursosNoCertificados = vocero.cursos?.some(
                  (curso) => curso.certificado === true
                );

                return (
                  <div
                    key={vocero.cedula || index}
                    className={`bg-[#eef1f5] rounded-md shadow-lg border ${
                      tieneCursosNoCertificados
                        ? "border-[#2FA807] hover:text-white"
                        : tieneCursosNoVerificados
                        ? "border-[#E61C45] hover:text-white"
                        : "bg-gray-100 hover:bg-[#d3dce6] text-[#082158] border-gray-300"
                    } transition-all`}
                  >
                    <button
                      onClick={() => toggleVocero(index)}
                      className={`w-full text-left font-semibold tracking-wide uppercase px-6 py-2 cursor-pointer transition-colors duration-200
                        ${
                          abierto === index
                            ? "rounded-t-md mb-2 sm:mb-0"
                            : "rounded-md"
                        }
                        ${
                          tieneCursosNoCertificados
                            ? "border-[#2FA807] hover:bg-[#15EA0E] text-[#2FA807] hover:text-white"
                            : tieneCursosNoVerificados
                            ? "border-[#E61C45] hover:bg-[#E61C45] text-[#E61C45] hover:text-white"
                            : "bg-gray-100 hover:bg-[#d3dce6] text-[#082158]"
                        }`}
                    >
                      {vocero.nombre} {vocero.nombre_dos} {vocero.apellido}{" "}
                      {vocero.apellido_dos}
                    </button>

                    <DetallesListadoVoceros
                      abierto={abierto}
                      index={index}
                      vocero={vocero}
                      editar={editar}
                      setAbierto={setAbierto}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Paginador
                first={first}
                setFirst={setFirst}
                rows={rows}
                setRows={setRows}
                totalRecords={totalRecords}
                open={open}
                setOpen={setOpen}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <Leyenda
          titulo={"📋 Total voceros"}
          totalVoceros={totalVoceros}
          totalHombres={totalHombres}
          totalMujeres={totalMujeres}
        />
        <Leyenda
          titulo={"👵 Adultos mayores"}
          totalVoceros={totalAdultosMayoresHombres + totalAdultosMayoresMujeres}
          totalHombres={totalAdultosMayoresHombres}
          totalMujeres={totalAdultosMayoresMujeres}
        />
      </div>
    </div>
  );
}

/** 
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Slider } from 'primereact/slider';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';

export default function TemplateDemo() {
    const [first, setFirst] = useState([0, 0, 0]);
    const [rows, setRows] = useState([10, 10, 10]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageInputTooltip, setPageInputTooltip] = useState("Press 'Enter' key to go to this page.");

    const onPageChange = (e, index) => {
        setFirst(first.map((f, i) => (index === i ? e.first : f)));
        setRows(rows.map((r, i) => (index === i ? e.rows : r)));
    };

    const onPageInputChange = (event) => {
        setCurrentPage(event.target.value);
    };

    const onPageInputKeyDown = (event, options) => {
        if (event.key === 'Enter') {
            const page = parseInt(currentPage);

            if (page < 0 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            } else {
                let _first = [...first];

                _first[0] = currentPage ? options.rows * (page - 1) : 0;

                setFirst(_first);
                setPageInputTooltip("Press 'Enter' key to go to this page.");
            }
        }
    };

    const leftContent = <Button type="button" icon="pi pi-star" className="p-button-outlined" />;
    const rightContent = <Button type="button" icon="pi pi-search" />;

    const template1 = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 30, value: 30 },
                { label: 'All', value: options.totalRecords }
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText size="2" className="ml-1" value={currentPage} tooltip={pageInputTooltip} onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange} />
                </span>
            );
        }
    };

    const template2 = {
        layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 120, value: 120 }
            ];

            return (
                <React.Fragment>
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                        Items per page:{' '}
                    </span>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                </React.Fragment>
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };
    const template3 = {
        layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',
        RowsPerPageDropdown: (options) => {
            return (
                <div className="flex align-items-center">
                <Tooltip target=".slider>.p-slider-handle" content={`${options.value} / page`} position="top" event="focus" />

                    <span className="mr-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                        Items per page:{' '}
                    </span>
                    <Slider className="slider" value={options.value} onChange={options.onChange} min={10} max={120} step={30} style={{ width: '10rem' }} />
                </div>
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };

    return (
        <div className="card">
            <Paginator template={template1} first={first[0]} rows={rows[0]} totalRecords={120} onPageChange={(e) => onPageChange(e, 0)} leftContent={leftContent} rightContent={rightContent} />
            <Divider />
            <Paginator template={template2} first={first[1]} rows={rows[1]} totalRecords={120} onPageChange={(e) => onPageChange(e, 1)} className="justify-content-end" />
            <Divider />
            <Paginator template={template3} first={first[2]} rows={rows[2]} totalRecords={120} onPageChange={(e) => onPageChange(e, 2)} className="justify-content-start" />
        </div>
    )
}
        

*/

// import { useState, useMemo } from "react";
// import Input from "../inputs/Input";
// import DetallesListadoVoceros from "./DetallesListadoVoceros";
// import Leyenda from "./Leyenda";

// import { Paginator } from "primereact/paginator";

// export default function ListadoVoceros({ voceros, editar }) {
//   const [abierto, setAbierto] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [first, setFirst] = useState(0);
//   const [rows, setRows] = useState(10);

//   const datosFiltrados = voceros?.filter((vocero) => {
//     const termino = searchTerm?.toLowerCase();

//     return (
//       vocero.nombre?.toLowerCase().includes(termino) ||
//       vocero.nombre_dos?.toLowerCase().includes(termino) ||
//       vocero.apellido?.toLowerCase().includes(termino) ||
//       vocero.apellido_dos?.toLowerCase().includes(termino) ||
//       vocero.cedula?.toString().includes(termino) ||
//       vocero.correo?.toLowerCase().includes(termino) ||
//       vocero.telefono?.toString().includes(termino) ||
//       vocero.edad?.toString().includes(termino)
//     );
//   });

//   const vocerosPagina = datosFiltrados.slice(first, first + rows);
//   const totalRecords = datosFiltrados.length;

//   const onPageChange = (event) => {
//     setFirst(event.first);
//     setRows(event.rows);
//   };

//   const vocerosFiltrados = useMemo(() => {
//     if (!searchTerm) return voceros;
//     const lower = searchTerm.toLowerCase();
//     return voceros.filter((vocero) =>
//       Object.values(vocero).some((value) => {
//         if (typeof value === "string" || typeof value === "number") {
//           return String(value).toLowerCase().includes(lower);
//         }
//         if (typeof value === "boolean") {
//           return (value ? "masculino" : "femenino").includes(lower);
//         }
//         if (typeof value === "object" && value !== null) {
//           if (
//             value.nombre &&
//             String(value.nombre).toLowerCase().includes(lower)
//           )
//             return true;
//           if (Array.isArray(value)) {
//             return value.some((item) =>
//               Object.values(item).some((itemValue) => {
//                 if (
//                   typeof itemValue === "string" ||
//                   typeof itemValue === "number"
//                 ) {
//                   return String(itemValue).toLowerCase().includes(lower);
//                 }
//                 if (typeof itemValue === "boolean") {
//                   return (itemValue ? "sí" : "no").includes(lower);
//                 }
//                 if (
//                   typeof itemValue === "object" &&
//                   itemValue !== null &&
//                   itemValue.nombre
//                 ) {
//                   return String(itemValue.nombre).toLowerCase().includes(lower);
//                 }
//                 return false;
//               })
//             );
//           }
//         }
//         return false;
//       })
//     );
//   }, [voceros, searchTerm]);

//   // Estadísticas
//   const totalVoceros = vocerosFiltrados?.length;
//   const totalHombres = vocerosFiltrados?.filter(
//     (v) => v.genero === true
//   ).length;
//   const totalMujeres = vocerosFiltrados?.filter(
//     (v) => v.genero === false
//   ).length;
//   const totalAdultosMayoresHombres = vocerosFiltrados?.filter(
//     (v) => v.genero === true && v.edad >= 60
//   ).length;
//   const totalAdultosMayoresMujeres = vocerosFiltrados?.filter(
//     (v) => v.genero === false && v.edad >= 55
//   ).length;

//   const toggleVocero = (index) => {
//     setAbierto(abierto === index ? null : index);
//   };

//   if (!Array.isArray(voceros) || voceros.length === 0) {
//     return (
//       <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
//         <p className="text-[#E61C45] font-semibold">
//           No hay voceros disponibles.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-6 bg-[#f4f6f9] rounded-md shadow-lg space-y-6 text-gray-800">
//       <div className=" bg-[#eef1f5] p-4 rounded-md shadow-lg gap-4 border border-gray-300">
//         <Input
//           type="text"
//           placeholder="🔍 Buscar por nombre, cédula, parroquia, curso..."
//           value={searchTerm}
//           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6c7aa1] text-gray-800 bg-white placeholder-gray-500 transition-all duration-200"
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//           }}
//         />
//       </div>

//       <div className="flex flex-col gap-4 border border-gray-300 hover:border-[#082158] p-4 rounded-md bg-[#f4f6f9] shadow-lg">
//         {vocerosPagina.length === 0 && searchTerm !== "" ? (
//           <div className="p-4 bg-white rounded-lg text-center text-[#E61C45] font-semibold shadow-lg">
//             No se encontraron voceros que coincidan con la búsqueda.
//           </div>
//         ) : (
//           <>
//             <div className="flex flex-col gap-3">
//               {vocerosPagina.map((vocero, index) => {
//                 const tieneCursosNoVerificados = vocero.cursos?.some(
//                   (curso) => curso.verificado === true
//                 );

//                 return (
//                   <div
//                     key={vocero.cedula || index}
//                     className="bg-[#eef1f5] rounded-md shadow-lg border border-gray-300 transition-all"
//                   >
//                     <button
//                       onClick={() => toggleVocero(index)}
//                       className={`w-full text-left font-semibold tracking-wide uppercase px-6 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
//                         tieneCursosNoVerificados
//                           ? "bg-green-500 hover:bg-green-600 text-white"
//                           : "bg-[#e2e8f0] hover:bg-[#d3dce6] text-[#082158]"
//                       }`}
//                     >
//                       {vocero.nombre} {vocero.nombre_dos} {vocero.apellido}{" "}
//                       {vocero.apellido_dos}
//                     </button>

//                     <DetallesListadoVoceros
//                       abierto={abierto}
//                       index={index}
//                       vocero={vocero}
//                       editar={editar}
//                     />
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="mt-6">
//               <Paginator
//                 first={first}
//                 rows={rows}
//                 totalRecords={totalRecords}
//                 onPageChange={onPageChange}
//                 rowsPerPageOptions={[5, 10, 20, 30]}
//               />
//             </div>
//           </>
//         )}
//       </div>

//       <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
//         <Leyenda
//           titulo={"📋 Total voceros"}
//           totalVoceros={totalVoceros}
//           totalHombres={totalHombres}
//           totalMujeres={totalMujeres}
//         />
//         <Leyenda
//           titulo={"👵 Adultos mayores"}
//           totalVoceros={totalAdultosMayoresHombres + totalAdultosMayoresMujeres}
//           totalHombres={totalAdultosMayoresHombres}
//           totalMujeres={totalAdultosMayoresMujeres}
//         />
//       </div>
//     </div>
//   );
// }
