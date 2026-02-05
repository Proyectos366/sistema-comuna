import Div from "@/components/padres/Div";
import MostrarMsj from "@/components/MostrarMensaje";

export default function MostrarMsjEnModal({ mostrarMensaje, mensaje }) {
  return (
    <>
      {mostrarMensaje && (
        <Div className="w-full">
          <MostrarMsj mensaje={mensaje} />
        </Div>
      )}
    </>
  );
}
