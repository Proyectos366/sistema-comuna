import Div from "@/components/padres/Div";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";

export default function BotonesModal({
  aceptar,
  cancelar,
  campos,
  indiceUno,
  indiceDos,
  nombreUno,
  nombreDos,
}) {
  return (
    <Div className="w-full flex justify-between space-x-4">
      <BotonAceptarCancelar
        aceptar={aceptar}
        campos={campos}
        indice={indiceUno}
        nombre={nombreUno}
      />
      <BotonAceptarCancelar
        aceptar={cancelar}
        campos={campos}
        indice={indiceDos}
        nombre={nombreDos}
      />
    </Div>
  );
}
