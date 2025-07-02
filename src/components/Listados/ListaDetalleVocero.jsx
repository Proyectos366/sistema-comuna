export default function ListaDetallesVocero({ nombre, valor }) {
  return (
    <div className="flex flex-row gap-2">
      <span className="font-semibold text-md">{nombre}:</span>
      <span className="text-md uppercase">{valor}</span>
    </div>
  );
}
