import Titulos from "@/components/Titulos";
import Section from "@/components/padres/Section";
import Div from "@/components/padres/Div";
import ButtonAdd from "@/components/botones/ButtonAdd";
import Paginador from "@/components/templates/PlantillaPaginacion";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";

export default function SectionQuaternary({
  children,
  nombre,
  className,
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
  estatus,
}) {
  const clasePorDefecto = `flex flex-col border border-[#E61C45]/50 ${
    nombre ? "gap-4" : ""
  } w-full max-w-2xl py-2 bg-[#ffffff] bg-opacity-90 backdrop-blur-md rounded-md shadow-xl px-1 sm:px-6`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <Section className={nuevaClase}>
      <Titulos
        indice={2}
        titulo={nombre}
        className={`${estatus ? "text-[#E61C45]" : "text-[#101828]"}`}
      />

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
        <Div className={'border border-[#E61C45]/50 rounded-md'}>
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
