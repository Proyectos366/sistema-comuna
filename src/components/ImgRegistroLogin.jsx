import Titulos from "./Titulos";

export default function ImgRegistroLogin() {
  return (
    <div className="flex items-center justify-center gap-2">
      <img
        className="w-16 object-cover"
        src="/img/fondo.png"
        alt="Logo cmz en el registro de usuario"
      />

      <Titulos
        indice={6}
        titulo={"Contraloria municipio zamora del estado aragua"}
        className={`text-[#082158] !text-xl !hidden sm:!block uppercase text-center`}
      />

      <img
        className="w-18 object-cover"
        src="/img/logo2.png"
        alt="Logo snf que acompaña el registro de usuario"
      />
    </div>
  );
}
