export default function BotonMostrarDetalles({
  toggleDetalles,
  nombre,
  index,
  indice,
  color,
}) {
  return (
    <button
      onClick={() => toggleDetalles(index)}
      className={`w-full text-left font-semibold tracking-wide uppercase px-6 py-2 rounded-md cursor-pointer transition-colors duration-200
         ${
           indice
             ? "hover:bg-[#2FA807]  bg-gray-200 text-[#082158] hover:text-white"
             : "bg-[#2FA807]  text-white hover:bg-gray-200 hover:text-[#082158]"
         }          
         `}
    >
      {nombre}
    </button>
  );
}

/**
 export default function BotonMostrarDetalles({
  toggleDetalles,
  nombre,
  index,
  indice,
  color,
}) {
  return (
    <button
      onClick={() => toggleDetalles(index)}
      className={`w-full text-left font-semibold tracking-wide uppercase px-6 py-2 rounded-md cursor-pointer transition-colors duration-200
         ${
           indice
             ? "hover:bg-[#1f479c]  bg-gray-200 text-[#082158] hover:text-white"
             : "bg-green-500  text-white hover:bg-gray-200 hover:text-[#082158]"
         }          
         `}
    >
      {nombre}
    </button>
  );
}

 */
