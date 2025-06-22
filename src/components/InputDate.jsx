"use client";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export default function InputDate({
  type,
  indice,
  name,
  className,
  id,
  onChange,
  value,
  ref,
  max,
validar, setValidar
}) {
  const validandoCampos = (campo) => {
    if (indice === "email") {
      return emailRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    
    onChange(e);

    if (indice === "email") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidar(true);
      } else {
        setValidar(false);
      }
    }
  };

  const clasePorDefecto = `uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <div className="space-y-2">
      <input
        type={type}
        id={id}
        value={value}
        name={name}
        className={nuevaClase}
        onChange={leyendoInput}
        ref={ref}
        max={max}
      />
      
    </div>
  );
}
