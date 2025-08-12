import BotonToggleCrearMostrar from "./botones/BotonToggleCrearMostrar";
import Titulos from "./Titulos";

export default function DivTresDentroSectionRegistroMostrar({
  children,
  nombre,
  toggle,
  opcion,
}) {
  return (
    <div className="w-full flex flex-col items-center sm:max-w-2xl bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl p-1 sm:p-6">
      <div className="w-full flex justify-between items-center">
        {nombre && <Titulos indice={2} titulo={nombre} />}
        <BotonToggleCrearMostrar toggle={toggle} opcion={opcion} />
      </div>
      {children}
    </div>
  );
}
