import Titulos from "@/components/Titulos";
import Section from "@/components/padres/Section";
import Div from "@/components/padres/Div";
import ButtonAdd from "@/components/botones/ButtonAdd";
import Paginador from "@/components/templates/PlantillaPaginacion";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";

export default function SectionTertiary({
  children,
  nombre,
  funcion,
  className,
  indice,
  first,
  setFirst,
  rows,
  setRows,
  datos,
  busqueda,
  setBusqueda,
  ordenCampo,
  setOrdenCampo,
  ordenDireccion,
  setOrdenDireccion,
  opcionesOrden,
}) {
  const clasePorDefecto = `flex flex-col ${
    nombre ? "gap-4" : ""
  } w-full max-w-2xl py-2 bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl px-1 sm:px-6`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <Section className={nuevaClase}>
      {nombre && !indice ? (
        <Div className="w-full flex justify-between items-center">
          <Titulos indice={2} titulo={nombre} />
          <ButtonAdd onClick={funcion} />
        </Div>
      ) : (
        <Titulos indice={2} titulo={nombre} />
      )}

      {datos?.length !== 0 && (
        <BuscadorOrdenador
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          ordenCampo={ordenCampo}
          setOrdenCampo={setOrdenCampo}
          ordenDireccion={ordenDireccion}
          setOrdenDireccion={setOrdenDireccion}
          opcionesOrden={opcionesOrden}
        />
      )}

      {children}

      {datos?.length > 0 && (
        <Div>
          <Paginador
            first={first}
            setFirst={setFirst}
            rows={rows}
            setRows={setRows}
            totalRecords={datos.length}
          />
        </Div>
      )}
    </Section>
  );
}
