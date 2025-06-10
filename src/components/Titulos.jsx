export default function Titulos({ indice, titulo, className }) {
  const clasePorDefecto = `font-semibold ${
    indice === 1
      ? "text-4xl"
      : indice === 2
      ? "text-2xl font-semibold mb-4 text-center text-gray-800"
      : indice === 3
      ? "text-xl"
      : indice === 4
      ? "text-lg"
      : indice === 5
      ? "text-md"
      : indice === 6
      ? "text-sm"
      : ""
  }`;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <>
      {indice === 1 && <div><h1 className={nuevaClase}>{titulo}</h1></div>}

      {indice === 2 && <div><h2 className={nuevaClase}>{titulo}</h2></div>}

      {indice === 3 && <div><h3 className={nuevaClase}>{titulo}</h3></div>}

      {indice === 4 && <div><h4 className={nuevaClase}>{titulo}</h4></div>}

      {indice === 5 && <div><h5 className={nuevaClase}>{titulo}</h5></div>}

      {indice === 6 && <div><h6 className={nuevaClase}>{titulo}</h6></div>}
    </>
  );
}
