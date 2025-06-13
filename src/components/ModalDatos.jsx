export default function ModalDatos({ titulo, descripcion }) {
  return (
    <div className="w-full flex">
      <span className="w-1/2">{titulo}: </span>
      <b className="w-1/2 text-justify ps-1 uppercase">{descripcion}</b>
    </div>
  );
}
