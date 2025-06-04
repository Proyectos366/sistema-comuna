export default function Titulos({ indice, titulo, className }) {
  const clasePorDefecto = `font-semibold ${
    indice === 1
      ? "text-4xl"
      : indice === 2
      ? "text-2xl"
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
      {indice === 1 && <h1 className={nuevaClase}>{titulo}</h1>}

      {indice === 2 && <h2 className={nuevaClase}>{titulo}</h2>}

      {indice === 3 && <h3 className={nuevaClase}>{titulo}</h3>}

      {indice === 4 && <h4 className={nuevaClase}>{titulo}</h4>}

      {indice === 5 && <h5 className={nuevaClase}>{titulo}</h5>}

      {indice === 6 && <h6 className={nuevaClase}>{titulo}</h6>}
    </>
  );
}
