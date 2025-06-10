import Titulos from "./Titulos";

export default function DivUnoDentroSectionRegistroMostrar({
  children,
  nombre,
}) {
  return (
    <div className="w-full sm:max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <Titulos indice={2} titulo={nombre} />
      {children}
    </div>
  );
}
