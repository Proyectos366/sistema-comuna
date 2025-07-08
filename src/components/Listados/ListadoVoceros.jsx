import { useState, useMemo } from "react";
import Input from "../inputs/Input";
import DetallesListadoVoceros from "./DetallesListadoVoceros";
import ItemsInputPorPagina from "./ItemsInputPorPagina";
import Leyenda from "./Leyenda";

export default function ListadoVoceros({ voceros, editar }) {
  const [abierto, setAbierto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);

  const vocerosFiltrados = useMemo(() => {
    if (!searchTerm) return voceros;
    const lower = searchTerm.toLowerCase();
    return voceros.filter((vocero) =>
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

  // Estadísticas
  const totalVoceros = vocerosFiltrados?.length;
  const totalHombres = vocerosFiltrados?.filter(
    (v) => v.genero === true
  ).length;
  const totalMujeres = vocerosFiltrados?.filter(
    (v) => v.genero === false
  ).length;
  const totalAdultosMayoresHombres = vocerosFiltrados?.filter(
    (v) => v.genero === true && v.edad >= 60
  ).length;
  const totalAdultosMayoresMujeres = vocerosFiltrados?.filter(
    (v) => v.genero === false && v.edad >= 55
  ).length;

  const totalPaginas = Math.ceil(totalVoceros / itemsPorPagina);

  const vocerosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return vocerosFiltrados.slice(inicio, fin);
  }, [vocerosFiltrados, paginaActual, itemsPorPagina]);

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const incrementarItems = () =>
    setItemsPorPagina((prev) => Math.min(prev + 1, 100));
  const reducirItems = () => setItemsPorPagina((prev) => Math.max(prev - 1, 1));

  if (!Array.isArray(voceros) || voceros.length === 0) {
    return (
      <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
        <p className="text-red-600 font-semibold">
          No hay voceros disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-[#f4f6f9] rounded-md shadow-lg space-y-6 text-gray-800">
      <div className="flex flex-col sm:flex-row items-end bg-[#eef1f5] p-4 rounded-md shadow-md gap-4 border border-gray-300">
        <div className="w-full sm:w-[75%]">
          <Input
            type="text"
            placeholder="🔍 Buscar por nombre, cédula, parroquia, curso..."
            value={searchTerm}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6c7aa1] text-gray-800 bg-white placeholder-gray-500 transition-all duration-200"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        <div className="w-full flex flex-col sm:flex-1 gap-1">
          <span className="w-full text-xs text-gray-600 text-center">
            Voceros por página
          </span>
          <ItemsInputPorPagina
            reducirItems={reducirItems}
            itemsPorPagina={itemsPorPagina}
            setItemsPorPagina={setItemsPorPagina}
            incrementarItems={incrementarItems}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border border-gray-300 hover:border-[#082158] p-4 rounded-md">
        {vocerosPagina.length === 0 && searchTerm !== "" ? (
          <div className="p-4 bg-white rounded-lg text-center text-red-600 font-semibold shadow-md">
            No se encontraron voceros que coincidan con la búsqueda.
          </div>
        ) : (
          vocerosPagina.map((vocero, index) => {
            const tieneCursosNoVerificados = vocero.cursos?.some(
              (curso) => curso.verificado === true
            );

            return (
              <div
                key={vocero.cedula || index}
                className="bg-[#eef1f5] rounded-md shadow-sm border border-gray-300"
              >
                <button
                  onClick={() => toggleVocero(index)}
                  className={`w-full text-left font-semibold tracking-wide uppercase px-6 py-2 rounded-md transition-colors duration-300 cursor-pointer ${
                    tieneCursosNoVerificados
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-[#e2e8f0] hover:bg-[#d3dce6] text-[#082158]"
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
                />
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white p-2 rounded-lg shadow-md flex justify-between items-center w-full border border-gray-300">
        <button
          onClick={irPaginaAnterior}
          disabled={paginaActual === 1}
          className={`px-4 py-2 sm:py-0 rounded-md font-semibold text-white flex-1 ${
            paginaActual === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#082158] hover:bg-[#061944] cursor-pointer"
          }`}
        >
          <span className="hidden sm:block py-1">Anterior</span>
          <span className="block sm:hidden">←</span>
        </button>

        <span className="text-sm font-medium w-1/2 text-center">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={irPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
          className={`px-4 py-2 sm:py-0 rounded-md font-semibold text-white flex-1 ${
            paginaActual === totalPaginas
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#082158] hover:bg-[#061944] cursor-pointer"
          }`}
        >
          <span className="hidden sm:block py-1">Siguiente</span>
          <span className="block sm:hidden">→</span>
        </button>
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
export function Administrador() {
  const [comprasNoVerificadas, setComprasNoVerificadas] = useState([]);
  const [comprasVerificadas, setComprasVerificadas] = useState([]);
  const [comprasTodas, setComprasTodas] = useState([]);
  const [verificado, setVerificado] = useState(false);
  const [personaVerificada, setPersonaVerificada] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [opcion, setOpcion] = useState("");
  const [itemPorPag, setItemPorPag] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const agregarNumeros = async () => {
    //const numBoletos = Array.from({ length: 10000 }, (_, i) => String(i).padStart(4, '0'));
    //const numBoletos = Array.from({ length: 10 }, (_, i) => String(i).padStart(2, "0"));
    //const numBoletos = Array(9000).fill().map((_, i) => i + 1000);
    const numBoletos = Array(2)
      .fill()
      .map((_, i) => i + 2);
    const { data: todosBoletos } = await supabase.from("todos_ticket").select();

    const disponible = true;

    for (const numero of numBoletos) {
      for (const boletos of todosBoletos) {
        if (numero == boletos.numero) {
          console.log(numero);
        } else {
          await guardarNumeros(numero, disponible);
        }
      }
      //await guardarNumeros(numero, disponible); // Espera a que se guarde cada número
    }
  };

  async function guardarNumeros(numero, disponible) {
    try {
      const { data, error } = await supabase
        .from("todos_ticket") // Reemplaza 'tu_tabla' con el nombre de tu tabla en Supabase
        .insert([{ numero: numero, disponible: disponible }]) // Inserta un solo objeto (puedes insertar múltiples si es un array)
        .select(); // Selecciona los datos insertados (opcional)

      if (error) {
        console.error("Error al insertar datos:", error);
      } else {
        console.log("Datos insertados con éxito:", data);
      }
    } catch (e) {
      console.error("Error inesperado:", e);
    }
  }

  useEffect(() => {
    obtenerTodasCompras(
      setComprasTodas,
      setComprasNoVerificadas,
      setComprasVerificadas
    );
  }, []);

  const cerrarVerificacion = () => {
    setVerificado(false);
  };

  const verificar = (datos) => {
    setVerificado(true);
  };

  const eliminar = (datos) => {
    setVerificado(true);
  };

  const buscando = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = comprasNoVerificadas.filter((item) => {
    // Aquí puedes personalizar la lógica de búsqueda según tus necesidades
    // Por ejemplo, buscar en múltiples propiedades:
    return item.refpago.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      {verificado && (
        <section className="fixed inset-0 bg-red-300 px-2 sm:px-0 bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-1/2 flex flex-col items-center space-y-4">
            <h2 className="text-2xl text-blue-600 font-semibold">
              {opcion === 1 ? "Datos verificados" : "Datos a eliminar"}
            </h2>
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-center px-10 border border-blue-500 rounded">
                <article className="flex flex-col py-4 w-2/3 sm:w-1/2">
                  <div className="flex space-x-14 sm:space-x-20">
                    <b>C.I: </b>
                    <span>{personaVerificada.cedula}</span>
                  </div>

                  <div className="space-x-2">
                    <b>Nombre: </b>
                    <span>{personaVerificada.nombre}</span>
                  </div>

                  <div className="flex space-x-2">
                    <b>Numeros: </b>
                    <div className="flex space-x-3">
                      {personaVerificada &&
                      personaVerificada.numboletos.length > 1 ? (
                        personaVerificada.numboletos.map((data, index) => (
                          <span key={index}>{data}</span>
                        ))
                      ) : (
                        <span>{personaVerificada.numboletos}</span>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cerrarVerificacion}
                className="mt-4 bg-blue-600 text-white rounded px-4 py-2"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  if (opcion === 1) {
                    aceptarVerificacion(
                      personaVerificada,
                      setComprasTodas,
                      setComprasNoVerificadas,
                      setVerificado,
                      setComprasVerificadas
                    );
                  } else {
                    eliminarVerificacion(
                      personaVerificada,
                      setComprasTodas,
                      setComprasNoVerificadas,
                      setVerificado,
                      setComprasVerificadas
                    );
                  }
                }}
                className="mt-4 bg-blue-600 text-white rounded px-4 py-2"
              >
                Aceptar
              </button>
            </div>
          </div>
        </section>
      )}

      <Header />
      <Main
        verificar={verificar}
        eliminar={eliminar}
        setPersonaVerificada={setPersonaVerificada}
        setVerificado={setVerificado}
        agregarNumeros={agregarNumeros}
        comprasTodas={comprasTodas}
        comprasNoVerificadas={comprasNoVerificadas}
        comprasVerificadas={comprasVerificadas}
        screenWidth={screenWidth}
        setOpcion={setOpcion}
        itemPorPag={itemPorPag}
        setItemPorPag={setItemPorPag}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        buscando={buscando}
        filteredData={filteredData}
      />
      <Footer />
    </>
  );
}

function Main({
  agregarNumeros,
  comprasTodas,
  setVerificado,
  setPersonaVerificada,
  verificar,
  eliminar,
  comprasNoVerificadas,
  comprasVerificadas,
  screenWidth,
  setOpcion,
  itemPorPag,
  setItemPorPag,
  searchTerm,
  setSearchTerm,
  buscando,
  filteredData,
}) {
  const retroceder = () => {
    if (itemPorPag > 9 && itemPorPag < 20) {
      const resto = itemPorPag - 10;
      setItemPorPag((prev) => Math.max(prev - resto, 0));
    } else {
      setItemPorPag((prev) => Math.max(prev - 10, 0));
    }
  };

  const adelantar = () => {
    setItemPorPag((prev) => prev + 10);
  };

  return (
    <main className="container mx-auto mt-10 space-y-5 px-2 sm:px-0">
      <Buscador searchTerm={searchTerm} buscando={buscando} />
      <section className="w-full space-y-4 mb-10">
        <h2 className="text-blue-500 font-semibold text-2xl w-full text-center">
          Listado de personas sin verificar
        </h2>
        {screenWidth >= 640 ? (
          <NumerosNoVerificadosPc
            comprasNoVerificadas={comprasNoVerificadas}
            setPersonaVerificada={setPersonaVerificada}
            verificar={verificar}
            eliminar={eliminar}
            setOpcion={setOpcion}
            itemPorPag={itemPorPag}
            setItemPorPag={setItemPorPag}
            adelantar={adelantar}
            retroceder={retroceder}
            searchTerm={searchTerm}
            filteredData={filteredData}
          />
        ) : (
          <NumerosNoVerificadosMobil
            comprasNoVerificadas={comprasNoVerificadas}
            setPersonaVerificada={setPersonaVerificada}
            verificar={verificar}
            eliminar={eliminar}
            setOpcion={setOpcion}
            itemPorPag={itemPorPag}
            setItemPorPag={setItemPorPag}
            adelantar={adelantar}
            retroceder={retroceder}
            searchTerm={searchTerm}
            filteredData={filteredData}
          />
        )}
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-blue-500 font-semibold text-2xl w-full text-center">
          Listado de personas verificadas
        </h2>
        {comprasVerificadas.map((datos) => (
          <article
            key={datos.id}
            className="border border-blue-500 rounded-md flex justify-between items-center space-x-4 px-2 hover:border hover:border-black transition-all ease-in-out duration-700"
          >
            <div className="flex flex-col w-1/3">
              <b>Cedula: </b>
              <span>{datos.cedula}</span>
            </div>

            <div className="flex flex-col w-1/3">
              <b>Nombre: </b>
              <span>{datos.nombre}</span>
            </div>

            <div className="flex flex-col w-1/3">
              <b>Nº comprados</b>
              <div className="flex justify-between flex-wrap">
                {datos.numboletos.length > 1 ? (
                  datos.numboletos.map((numBoleto, index) => (
                    <span key={index}>{numBoleto}</span>
                  ))
                ) : (
                  <span>{datos.numboletos[0]}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function NumerosNoVerificadosPc({
  comprasNoVerificadas,
  setPersonaVerificada,
  verificar,
  eliminar,
  setOpcion,
  itemPorPag,
  setItemPorPag,
  adelantar,
  retroceder,
  searchTerm,
  filteredData,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = itemPorPag;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const ultimaPagina = Math.ceil(comprasNoVerificadas.length / itemsPerPage);

  return (
    <>
      {searchTerm ? (
        filteredData && filteredData.length !== 0 ? (
          filteredData
            .slice(currentPage, currentPage + itemsPerPage)
            .map((datos) => (
              <article
                key={datos.id}
                className={`border border-blue-500 flex sm:justify-between py-2 sm:space-x-3 rounded-md items-center px-2 hover:border hover:border-black transition-all ease-in-out duration-700`}
              >
                <div className="flex flex-col w-1/5">
                  <b>Cedula: </b>
                  <span>{datos.cedula}</span>
                </div>

                <div className="flex flex-col w-1/5">
                  <b>Nombre: </b>
                  <span>{datos.nombre}</span>
                </div>

                <div className="flex flex-col w-1/5">
                  <b>Nº comprados</b>
                  <div className=" flex flex-wrap">
                    {datos.numboletos.length > 1 ? (
                      datos.numboletos.map((numBoleto, index) => (
                        <span className="me-2" key={index}>
                          {numBoleto}
                        </span>
                      ))
                    ) : (
                      <span>{datos.numboletos[0]}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col w-1/5">
                  <b>Ref. pago: </b>
                  <span>{datos.refpago}</span>
                </div>

                <div className="flex flex-col w-1/5">
                  <b>Total a pagar: </b>
                  <span>{datos.totalpagarbs}</span>
                </div>

                <div className="flex w-1/5 items-center justify-center space-x-3">
                  <button
                    className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                    onClick={() => {
                      setOpcion(1);
                      setPersonaVerificada(datos);
                      verificar(datos);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0 0 122.881 122.88"
                      enableBackground="new 0 0 122.881 122.88"
                    >
                      <g>
                        <path d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" />
                      </g>
                    </svg>
                  </button>

                  <button
                    className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                    onClick={() => {
                      setOpcion(0);
                      setPersonaVerificada(datos);
                      eliminar(datos);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      shapeRendering="geometricPrecision"
                      textRendering="geometricPrecision"
                      imageRendering="optimizeQuality"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      viewBox="0 0 512 462.799"
                    >
                      <path
                        fillRule="nonzero"
                        d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                      />
                    </svg>
                  </button>
                </div>
              </article>
            ))
        ) : (
          <article
            className={`border border-blue-500  py-2  rounded-md  px-2 hover:border hover:border-black transition-all ease-in-out duration-700`}
          >
            <div className="w-full text-center text-lg font-semibold">
              No hay coincidencias
            </div>
          </article>
        )
      ) : (
        comprasNoVerificadas
          .slice(currentPage, currentPage + itemsPerPage)
          .map((datos) => (
            <article
              key={datos.id}
              className={`border border-blue-500 flex sm:justify-between py-2 sm:space-x-3 rounded-md items-center px-2 hover:border hover:border-black transition-all ease-in-out duration-700`}
            >
              <div className="flex flex-col w-1/5">
                <b>Cedula: </b>
                <span>{datos.cedula}</span>
              </div>

              <div className="flex flex-col w-1/5">
                <b>Nombre: </b>
                <span>{datos.nombre}</span>
              </div>

              <div className="flex flex-col w-1/5">
                <b>Nº comprados</b>
                <div className=" flex flex-wrap">
                  {datos.numboletos.length > 1 ? (
                    datos.numboletos.map((numBoleto, index) => (
                      <span className="me-2" key={index}>
                        {numBoleto}
                      </span>
                    ))
                  ) : (
                    <span>{datos.numboletos[0]}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-1/5">
                <b>Ref. pago: </b>
                <span>{datos.refpago}</span>
              </div>

              <div className="flex flex-col w-1/5">
                <b>Total a pagar: </b>
                <span>{datos.totalpagarbs}</span>
              </div>

              <div className="flex w-1/5 items-center justify-center space-x-3">
                <button
                  className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                  onClick={() => {
                    setOpcion(1);
                    setPersonaVerificada(datos);
                    verificar(datos);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 122.881 122.88"
                    enableBackground="new 0 0 122.881 122.88"
                  >
                    <g>
                      <path d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" />
                    </g>
                  </svg>
                </button>

                <button
                  className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                  onClick={() => {
                    setOpcion(0);
                    setPersonaVerificada(datos);
                    eliminar(datos);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    viewBox="0 0 512 462.799"
                  >
                    <path
                      fillRule="nonzero"
                      d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))
      )}

      <div className="flex">
        <ReactPaginate
          className="w-full flex justify-between items-center"
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={Math.ceil(comprasNoVerificadas.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={" "}
          activeClassName={`bg-pink-300 w-8 py-1 text-center border border-blue-500 rounded`}
          previousLinkClassName={`${
            currentPage < 1 ? "cursor-not-allowed" : "cursor-pointer"
          } relative inline-flex items-center bg-pink-300 px-4 py-2 border border-blue-500 text-sm font-medium rounded-md hover:bg-pink-200`}
          nextLinkClassName={`${
            currentPage + 1 === ultimaPagina
              ? "cursor-not-allowed"
              : "cursor-pointer"
          } relative inline-flex items-center bg-pink-300 px-4 py-2 border border-blue-500 text-sm font-medium rounded-md hover:bg-pink-200`}
        />
      </div>
      <p className="w-full text-center">
        Página {currentPage + 1}/{ultimaPagina}
      </p>

      <ItemPorPagina
        itemsPerPage={itemsPerPage}
        itemPorPag={itemPorPag}
        comprasNoVerificadas={comprasNoVerificadas}
        setItemPorPag={setItemPorPag}
        adelantar={adelantar}
        retroceder={retroceder}
      />
    </>
  );
}

function NumerosNoVerificadosMobil({
  comprasNoVerificadas,
  setPersonaVerificada,
  verificar,
  eliminar,
  setOpcion,
  itemPorPag,
  setItemPorPag,
  adelantar,
  retroceder,
  searchTerm,
  filteredData,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = itemPorPag;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const ultimaPagina = Math.ceil(comprasNoVerificadas.length / itemsPerPage);

  return (
    <>
      {searchTerm ? (
        filteredData && filteredData.length !== 0 ? (
          filteredData
            .slice(currentPage, currentPage + itemsPerPage)
            .map((datos) => (
              <article
                key={datos.id}
                className="border border-blue-500 rounded-md flex space-x-5 sm:justify-between items-center p-2 hover:border hover:border-black transition-all ease-in-out duration-700"
              >
                <div className="w-1/2 flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <b className="text-center">Cedula: </b>
                    <span className="text-center">{datos.cedula}</span>
                  </div>

                  <div className="flex flex-col">
                    <b className="text-center">Nombre: </b>
                    <span className="text-center">{datos.nombre}</span>
                  </div>

                  <div className="flex flex-col">
                    <b className="text-center">Nº comprados</b>
                    <div
                      className={`${
                        datos.numboletos.length > 3
                          ? "flex flex-wrap justify-between"
                          : ""
                      }`}
                    >
                      {datos.numboletos.length > 1 ? (
                        datos.numboletos.map((numBoleto, index) => (
                          <span className="me-2" key={index}>
                            {numBoleto}
                          </span>
                        ))
                      ) : (
                        <span>{datos.numboletos[0]}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-1/2 flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <b className="text-center">Ref. pago: </b>
                    <span className="text-center">{datos.refpago}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <b>Total a pagar: </b>
                    <span>{datos.totalpagarbs}</span>
                  </div>

                  <div className="flex items-center justify-center space-x-3">
                    <button
                      className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                      onClick={() => {
                        setOpcion(1);
                        setPersonaVerificada(datos);
                        verificar(datos);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="30"
                        height="30"
                        viewBox="0 0 122.881 122.88"
                        enableBackground="new 0 0 122.881 122.88"
                      >
                        <g>
                          <path d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" />
                        </g>
                      </svg>
                    </button>

                    <button
                      className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                      onClick={() => {
                        setOpcion(0);
                        setPersonaVerificada(datos);
                        eliminar(datos);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        shapeRendering="geometricPrecision"
                        textRendering="geometricPrecision"
                        imageRendering="optimizeQuality"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        viewBox="0 0 512 462.799"
                      >
                        <path
                          fillRule="nonzero"
                          d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))
        ) : (
          <article
            className={`border border-blue-500  py-2  rounded-md  px-2 hover:border hover:border-black transition-all ease-in-out duration-700`}
          >
            <div className="w-full text-center text-lg font-semibold">
              No hay coincidencias
            </div>
          </article>
        )
      ) : (
        comprasNoVerificadas
          .slice(currentPage, currentPage + itemsPerPage)
          .map((datos) => (
            <article
              key={datos.id}
              className="border border-blue-500 rounded-md flex space-x-5 sm:justify-between items-center p-2 hover:border hover:border-black transition-all ease-in-out duration-700"
            >
              <div className="w-1/2 flex flex-col space-y-4">
                <div className="flex flex-col">
                  <b className="text-center">Cedula: </b>
                  <span className="text-center">{datos.cedula}</span>
                </div>

                <div className="flex flex-col">
                  <b className="text-center">Nombre: </b>
                  <span className="text-center">{datos.nombre}</span>
                </div>

                <div className="flex flex-col">
                  <b className="text-center">Nº comprados</b>
                  <div
                    className={`${
                      datos.numboletos.length > 3
                        ? "flex flex-wrap justify-between"
                        : ""
                    }`}
                  >
                    {datos.numboletos.length > 1 ? (
                      datos.numboletos.map((numBoleto, index) => (
                        <span className="me-2" key={index}>
                          {numBoleto}
                        </span>
                      ))
                    ) : (
                      <span>{datos.numboletos[0]}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex flex-col space-y-4">
                <div className="flex flex-col">
                  <b className="text-center">Ref. pago: </b>
                  <span className="text-center">{datos.refpago}</span>
                </div>

                <div className="flex flex-col items-center">
                  <b>Total a pagar: </b>
                  <span>{datos.totalpagarbs}</span>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                    onClick={() => {
                      setOpcion(1);
                      setPersonaVerificada(datos);
                      verificar(datos);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0 0 122.881 122.88"
                      enableBackground="new 0 0 122.881 122.88"
                    >
                      <g>
                        <path d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" />
                      </g>
                    </svg>
                  </button>

                  <button
                    className="w-12 h-12 flex justify-center items-center text-[blue] border border-blue-500 rounded-lg bg-pink-300"
                    onClick={() => {
                      setOpcion(0);
                      setPersonaVerificada(datos);
                      eliminar(datos);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      shapeRendering="geometricPrecision"
                      textRendering="geometricPrecision"
                      imageRendering="optimizeQuality"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      viewBox="0 0 512 462.799"
                    >
                      <path
                        fillRule="nonzero"
                        d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))
      )}

      <div className="flex">
        <ReactPaginate
          className="w-full flex justify-between items-center"
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={Math.ceil(comprasNoVerificadas.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={" "}
          activeClassName={`bg-pink-300 w-8 py-1 text-center border border-blue-500 rounded`}
          previousLinkClassName={`${
            currentPage < 1 ? "cursor-not-allowed" : "cursor-pointer"
          } relative inline-flex items-center bg-pink-300 px-4 py-2 border border-blue-500 text-sm font-medium rounded-md hover:bg-pink-200`}
          nextLinkClassName={`${
            currentPage + 1 === ultimaPagina
              ? "cursor-not-allowed"
              : "cursor-pointer"
          } relative inline-flex items-center bg-pink-300 px-4 py-2 border border-blue-500 text-sm font-medium rounded-md hover:bg-pink-200`}
        />
      </div>

      <p className="w-full text-center">
        Página {currentPage + 1}/{ultimaPagina}
      </p>

      <ItemPorPagina
        itemsPerPage={itemsPerPage}
        itemPorPag={itemPorPag}
        comprasNoVerificadas={comprasNoVerificadas}
        setItemPorPag={setItemPorPag}
        adelantar={adelantar}
        retroceder={retroceder}
      />
    </>
  );
}

function ItemPorPagina({
  itemsPerPage,
  itemPorPag,
  comprasNoVerificadas,
  adelantar,
  retroceder,
  setItemPorPag,
}) {
  return (
    <div className="flex flex-col">
      <b className="w-full  text-center">Numero de items por pagina</b>
      <div className="w-full flex">
        <button
          onClick={() => {
            if (itemPorPag > 10) {
              retroceder();
            }
          }}
          className={`${
            itemsPerPage <= 10 ? "cursor-not-allowed" : "cursor-pointer"
          } relative w-1/5 inline-flex items-center bg-pink-300 px-4 py-2 border border-e-0 border-blue-500 text-sm font-medium rounded-md rounded-e-none hover:bg-pink-200`}
          type="buttom"
        >
          Menos
        </button>

        <div className="flex flex-1 border border-blue-500">
          {itemPorPag == 1 ? (
            <input
              className="outline-none text-center w-full"
              type="text"
              disabled
              value={1}
              onChange={(e) => setItemPorPag(Number(e.target.value))}
            />
          ) : (
            <input
              className="outline-none text-center w-full font-semibold text-lg"
              type="number"
              value={itemPorPag}
              disabled={itemPorPag >= comprasNoVerificadas.length}
              onChange={(e) => setItemPorPag(Number(e.target.value))}
            />
          )}
        </div>

        <button
          onClick={() => {
            if (itemPorPag < comprasNoVerificadas.length) {
              adelantar();
            }
          }}
          className={`${
            itemsPerPage >= comprasNoVerificadas.length
              ? "cursor-not-allowed"
              : "cursor-pointer"
          } relative w-1/5 inline-flex items-center bg-pink-300 px-4 py-2 border border-s-0 border-blue-500 text-sm font-medium rounded-md rounded-s-none hover:bg-pink-200`}
          type="buttom"
        >
          Mas
        </button>
      </div>
    </div>
  );
}

function Buscador({ searchTerm, buscando }) {
  return (
    <section className="w-full flex justify-end items-center">
      <div className="flex sm:flex-row flex-col justify-end items-center px-2 sm:space-x-4 h-10 w-full sm:w-1/2">
        <span>Buscar. Ref. Bancaria</span>
        <input
          className="outline-none w-full sm:w-1/2 text-center text-lg border border-blue-500 rounded"
          type="text"
          placeholder="12345"
          value={searchTerm}
          onChange={buscando}
        />
      </div>
    </section>
  );
}

const aceptarVerificacion = async (
  verificar,
  setComprasTodas,
  setComprasNoVerificadas,
  setVerificado,
  setComprasVerificadas
) => {
  try {
    if (verificar.refpago) {
      const { data, error } = await supabase
        .from("usuarios")
        .update({ verificado: true })
        .match({ refpago: verificar.refpago });
    }

    obtenerTodasCompras(
      setComprasTodas,
      setComprasNoVerificadas,
      setComprasVerificadas
    );
    setVerificado(false);
  } catch (error) {
    console.error("Error al actualizar los registros:", error);
  }
};

const eliminarVerificacion = async (
  verificar,
  setComprasTodas,
  setComprasNoVerificadas,
  setVerificado,
  setComprasVerificadas
) => {
  try {
    if (verificar && verificar.numboletos.length > 1) {
      for (const numeros in verificar.numboletos) {
        const numb = verificar.numboletos[numeros];

        const { data, erro } = await supabase
          .from("todos_ticket")
          .update({ disponible: true })
          .match({ numero: numb });

        if (erro) {
          console.log("Error al actualizar: " + erro);
        }
      }

      const { er } = await supabase
        .from("usuarios")
        .delete()
        .match({ refpago: verificar.refpago });

      if (er) {
        console.log("Error al eliminar: " + er);
      }
    } else {
      const { data, erro } = await supabase
        .from("todos_ticket")
        .update({ disponible: true })
        .match({ numero: verificar.numboletos[0] });

      const { er } = await supabase
        .from("usuarios")
        .delete()
        .match({ refpago: verificar.refpago });

      if (erro || er) {
        console.log("Error al eliminar: " + erro || er);
      }
    }

    obtenerTodasCompras(
      setComprasTodas,
      setComprasNoVerificadas,
      setComprasVerificadas
    );
    setVerificado(false);
  } catch (error) {
    console.error("Error al actualizar los registros:", error);
  }
};

const obtenerTodasCompras = async (
  setComprasTodas,
  setComprasNoVerificadas,
  setComprasVerificadas
) => {
  const limitePorConsulta = 1000; // Ajusta este valor según tus necesidades y límites de Supabase
  let offset = 0; // Inicializa el offset para la primera consulta

  const obtenerDatos = async (filtro) => {
    let datos = [];
    while (true) {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .filter(filtro)
        .range(offset, offset + limitePorConsulta - 1);

      if (error) {
        console.error("Error al obtener datos:", error);
        break;
      }

      if (!data.length) {
        break; // Si no hay más datos, salimos del bucle
      }

      datos = datos.concat(data);
      offset += limitePorConsulta;
    }
    return datos;
  };

  // Obtener el total de registros (opcional, si quieres verificar antes de paginar)
  const {
    data: { count },
  } = await supabase.from("usuarios").select("*", { count: "exact" });

  // Si el número de registros es mayor o igual a 1000, utilizamos paginación
  if (count >= 1000) {
    const todasCompras = await obtenerDatos();
    const comprasSinVerificar = await obtenerDatos("verificado", "eq", false);
    const comprasVerificadas = await obtenerDatos("verificado", "eq", true);

    setComprasTodas(todasCompras);
    setComprasNoVerificadas(comprasSinVerificar);
    setComprasVerificadas(comprasVerificadas);
  } else {
    // Si el número de registros es menor a 1000, usamos las consultas simples
    const { data: todasCompras } = await supabase.from("usuarios").select();

    const { data: comprasSinVerificar } = await supabase
      .from("usuarios")
      .select("*")
      .filter("verificado", "eq", false);

    const { data: comprasVerificadas } = await supabase
      .from("usuarios")
      .select("*")
      .filter("verificado", "eq", true);

    setComprasTodas(todasCompras);
    setComprasNoVerificadas(comprasSinVerificar);
    setComprasVerificadas(comprasVerificadas);
  }
};

 */








/**
const obtenerTodasCompras = async (
  setComprasTodas,
  setComprasNoVerificadas,
  setComprasVerificadas
) => {
  const { data: todasCompras } = await supabase.from("usuarios").select();

  const { data: comprasSinVerificar } = await supabase
    .from("usuarios")
    .select("*")
    .filter("verificado", "eq", false);

  const { data: comprasVerificadas } = await supabase
    .from("usuarios")
    .select("*")
    .filter("verificado", "eq", true);

  setComprasTodas(todasCompras);
  setComprasNoVerificadas(comprasSinVerificar);
  setComprasVerificadas(comprasVerificadas);
};
 */

/**
function Main({agregarNumeros}) {
    
    return (
        <main className="container mx-auto">
            <section>
                <h1>Habilitar numeros</h1>
                <button className="w-1/2 bg-[red] text-white " type="button" onClick={agregarNumeros}>Agregar Numeros</button>
            </section>
        </main>
    )
}
 */

