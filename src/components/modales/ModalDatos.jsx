export default function ModalDatos({ titulo, descripcion, indice }) {
  return (
    <div className="w-full flex flex-row sm:items-start">
      <span className="w-1/2 text-sm text-gray-800 font-semibold mb-1 sm:mb-0 uppercase">
        {titulo}:
      </span>
      <span
        className={`w-1/2 break-words whitespace-pre-wrap text-sm font-medium ps-1 ${
          indice ? "" : "uppercase"
        }`}
      >
        {descripcion}
      </span>
    </div>
  );
}
