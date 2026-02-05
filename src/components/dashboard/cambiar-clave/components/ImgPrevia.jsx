import Div from "@/components/padres/Div";
import { abrirModal } from "@/store/features/modal/slicesModal";
import { useDispatch } from "react-redux";

export default function ImgPrevia({ imgPrevia, datos, setAccion, indice }) {
  const dispatch = useDispatch();

  return (
    <Div className="flex items-center justify-center">
      <Div className="relative group w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden shadow-lg border-4 border-[#082158] hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <img
          src={imgPrevia}
          alt="Foto de perfil"
          className="rounded-full w-full h-full object-cover group-hover:scale-105 transform transition-transform duration-300 ease-in-out"
        />

        {indice && (
          <button
            type="button"
            onClick={() => {
              setAccion("imagen");
              dispatch(
                abrirModal(datos?.imagenes?.[0]?.path ? "editar" : "crear"),
              );
            }}
            className="absolute bottom-0 w-full bg-[#000000] bg-opacity-40 text-[#ffffff] text-sm text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            {datos?.imagenes?.[0]?.path ? "Cambiar" : "Asignar"}
          </button>
        )}
      </Div>
    </Div>
  );
}
