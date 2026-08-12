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
  icono1,
  icono2,
}) {
  return (
    <Div className="w-full md:w-1/2 flex justify-between space-x-4">
      <BotonAceptarCancelar
        aceptar={aceptar}
        campos={campos}
        indice={indiceUno}
        nombre={nombreUno}
        icono={icono1}
      />
      <BotonAceptarCancelar
        aceptar={cancelar}
        campos={campos}
        indice={indiceDos}
        nombre={nombreDos}
        icono={icono2}
      />
    </Div>
  );
}
