import BotonSelectOpcionVocero from "@/components/dashboard/voceros/components/BotonSelectOpcionVocero";
import Titulos from "@/components/Titulos";
import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchVocerosMunicipio } from "@/store/features/voceros/thunks/todosVocerosMunicipio";
import { resetVoceros } from "@/store/features/voceros/vocerosSlices";
import { toggleOpcionesVocero } from "@/utils/dashboard/toggleOpcionesVocero";
import { useDispatch } from "react-redux";

export default function OpcionesVocero({
  seleccionado,
  setSeleccionado,
  setOpcion,
}) {
  const dispatch = useDispatch();

  return (
    <div className="w-full bg-gray-100 backdrop-blur-md rounded-md shadow-xl p-4 space-y-6 border border-gray-300">
      <Titulos titulo={"Voceros por:"} indice={6} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(1, setSeleccionado);
            dispatch(abrirModal("consultar"));
            setOpcion("cedula");
            dispatch(resetVoceros());
          }}
          seleccionar={seleccionado}
          indice={1}
          nombre="cédula"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(2, setSeleccionado);
            dispatch(abrirModal("consultar"));
            setOpcion("parroquia");
            dispatch(resetVoceros());
          }}
          seleccionar={seleccionado}
          indice={2}
          nombre="parroquia"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(3, setSeleccionado);
            dispatch(abrirModal("consultar"));
            setOpcion("comuna");
            dispatch(resetVoceros());
          }}
          seleccionar={seleccionado}
          indice={3}
          nombre="comuna"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(4, setSeleccionado);
            dispatch(abrirModal("consultar"));
            setOpcion("circuito");
            dispatch(resetVoceros());
          }}
          seleccionar={seleccionado}
          indice={4}
          nombre="circuito comunal"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(5, setSeleccionado);
            dispatch(abrirModal("consultar"));
            setOpcion("consejo");
            dispatch(resetVoceros());
          }}
          seleccionar={seleccionado}
          indice={5}
          nombre="consejo comunal"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(6, setSeleccionado);
            setOpcion("todos");
            dispatch(resetVoceros());
            dispatch(fetchVocerosMunicipio());
          }}
          seleccionar={seleccionado}
          indice={6}
          nombre="Todos"
        />
      </div>
    </div>
  );
}
