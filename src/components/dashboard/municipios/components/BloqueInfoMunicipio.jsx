export default function BloqueInfoMunicipio({ nombre, valor, indice }) {
  let colorClase = "text-black";

  if (indice === 2) {
    colorClase = "text-[#E61C45]";
  } else if (indice >= 3) {
    colorClase = "text-[#2FA807]";
  }

  return (
    <div className="flex flex-row gap-2">
      <span className="font-semibold text-sm sm:text-md">{nombre}:</span>
      <span className={`text-sm sm:text-md uppercase ${colorClase}`}>
        {valor}
      </span>
    </div>
  );
}
