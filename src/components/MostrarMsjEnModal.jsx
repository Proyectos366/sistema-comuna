import MostrarMsj from "./MostrarMensaje";

export default function MostarMsjEnModal({ mostrarMensaje, mensaje }) {
  return (
    <>
      {mostrarMensaje && (
        <div className="px-10 mb-3">
          <MostrarMsj mensaje={mensaje} />
        </div>
      )}
    </>
  );
}
