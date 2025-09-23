import MostrarMsj from "./MostrarMensaje";

export default function MostarMsjEnModal({ mostrarMensaje, mensaje }) {
  return (
    <>
      {mostrarMensaje && (
        <div className="w-full">
          <MostrarMsj mensaje={mensaje} />
        </div>
      )}
    </>
  );
}
