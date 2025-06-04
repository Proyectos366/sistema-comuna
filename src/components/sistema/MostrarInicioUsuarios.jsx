import Titulos from "../Titulos";

export default function MostrarAlInicioUsuarios() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-10 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-center">
        <Titulos indice={2} titulo={"Bienvenidos"} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <img className="opacity-40 max-w-[300px]" src="/img/fondo.png" alt="" />
      </div>
    </div>
  );
}
