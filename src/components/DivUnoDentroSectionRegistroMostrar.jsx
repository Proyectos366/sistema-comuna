import Titulos from "./Titulos";

export default function DivUnoDentroSectionRegistroMostrar({
  children,
  nombre,
}) {
  return (
    <div className="w-full sm:max-w-2xl bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl p-1 sm:p-6">
      <Titulos indice={2} titulo={nombre} />
      {children}
    </div>
  );
}
