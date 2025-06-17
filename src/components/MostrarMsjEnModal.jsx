import MostrarMsj from "./MostrarMensaje";

export default function MostarMsjEnModal({ mostrarMensaje, mensaje }) {
  return (
    <>
      {mostrarMensaje && (
        <div className="mb-3 w-full">
          <MostrarMsj mensaje={mensaje} />
        </div>
      )}
    </>
  );
}
