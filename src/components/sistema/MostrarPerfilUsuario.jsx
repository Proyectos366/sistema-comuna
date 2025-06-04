import Titulos from "../Titulos";

export default function MostrarPerfilUsuario({ abrirPanel }) {
  return (
    <div className={`mb-3 ${abrirPanel ? "hidden sm:flex" : "flex flex-col"} `}>
      <div className="mb-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-center">
        <Titulos indice={2} titulo={"Perfil usuario"} />
      </div>
    </div>
  );
}
