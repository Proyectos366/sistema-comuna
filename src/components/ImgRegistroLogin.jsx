import Titulos from "./Titulos";

export default function ImgRegistroLogin() {
  return (
    <div className="flex items-center justify-center gap-2">
      <img className="w-16 object-cover" src="/img/fondo.png" alt="" />

      <Titulos
        indice={6}
        titulo={"Contraloria municipio zamora del estado aragua"}
        className={`text-[#082158] !text-xl !hidden sm:!block uppercase text-center`}
      />
    </div>
  );
}
