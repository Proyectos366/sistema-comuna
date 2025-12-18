import BotonSelectOpcionVocero from "@/components/dashboard/voceros/components/BotonSelectOpcionVocero";
import { abrirModal } from "@/store/features/modal/slicesModal";
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(1, setSeleccionado);
            dispatch(abrirModal("consultar"));
            setOpcion("cedula");
          }}
          seleccionar={seleccionado}
          indice={1}
          nombre="Por cédula"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(2, setSeleccionado);
            setOpcion("parroquia");
          }}
          seleccionar={seleccionado}
          indice={2}
          nombre="Por parroquia"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(3, setSeleccionado);
            setOpcion("comuna");
          }}
          seleccionar={seleccionado}
          indice={3}
          nombre="Por comuna"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(4, setSeleccionado);
            setOpcion("circuito");
          }}
          seleccionar={seleccionado}
          indice={4}
          nombre="Por circuito comunal"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(5, setSeleccionado);
            setOpcion("consejo");
          }}
          seleccionar={seleccionado}
          indice={5}
          nombre="Por consejo comunal"
        />

        <BotonSelectOpcionVocero
          consultar={() => {
            toggleOpcionesVocero(6, setSeleccionado);
            setOpcion("todos");
          }}
          seleccionar={seleccionado}
          indice={6}
          nombre="Todos"
        />
      </div>
    </div>
  );
}
