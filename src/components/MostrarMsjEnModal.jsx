import MostrarMsj from "./MostrarMensaje";

export default function MostarMsjEnModal({ mostrarMensaje, mensaje }) {
  return (
    <>
      {mostrarMensaje && (
        <div className="my-1 w-full">
          <MostrarMsj mensaje={mensaje} />
        </div>
      )}
    </>
  );
}
