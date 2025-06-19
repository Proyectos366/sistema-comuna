/**
export default function ModalDatos({ titulo, descripcion }) {
  return (
    <div className="w-full flex">
      <span className="w-1/2 text-sm">{titulo}: </span>
      <span className="w-1/2 text-justify text-sm font-medium ps-1 uppercase">{descripcion}</span>
    </div>
  );
}
 */

export default function ModalDatos({ titulo, descripcion }) {
  return (
    <div className="w-full flex flex-row sm:items-start uppercase">
      <span className="w-1/2 text-sm font-semibold mb-1 sm:mb-0">
        {titulo}:
      </span>
      <span className="w-1/2 break-words whitespace-pre-wrap text-sm font-medium ps-1">
        {descripcion}
      </span>
    </div>
  );
}
