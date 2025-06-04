export default function ModalDatos({ titulo, descripcion }) {
  return (
    <div className="flex justify-between w-full sm:w-[80%]">
      <span className="w-1/2 flex">{titulo}: </span>
      <b className="w-1/2 flex">{descripcion}</b>
    </div>
  );
}
