import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import SectionRegistroMostrar from "../SectionRegistroMostrar";

export default function OacDepartamento({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  return (
    <SectionRegistroMostrar>
      <DivUnoDentroSectionRegistroMostrar
        nombre={"Opciones de OAC"}
      ></DivUnoDentroSectionRegistroMostrar>
    </SectionRegistroMostrar>
  );
}
