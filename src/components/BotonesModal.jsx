import BotonAceptarCancelar from "./BotonAceptarCancelar";

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
    <div className="flex space-x-2 px-10">
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
    </div>
  );
}
