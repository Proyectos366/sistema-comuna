export default function ModalDatos({ titulo, descripcion }) {
  return (
    <div className="flex justify-between w-full">
      <span className="w-1/2 flex justify-center">{titulo}: </span>
      <b className="w-1/2 flex justify-center capitalize">{descripcion}</b>
    </div>
  );
}
