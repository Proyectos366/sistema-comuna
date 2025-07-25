/** 
  export default function ModalPequena({ visible, indice }) {
    return (
      <div className="w-full flex justify-center">
        {visible && (
          <div
            className={`absolute z-50 ${
              !indice
                ? "top-[15%] sm:top-[10%]  w-[90%] sm:w-[71%] md:w-[62%] lg:w-[48%]"
                : "top-[5%] sm:top-[3%]  w-[90%] sm:w-[71%] md:w-[62%] lg:w-[48%]"
            }  flex flex-col shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2`}
          >
            <span className="text-xl text-center font-semibold">
              La clave debe contener minimo:
            </span>
            <ul className="flex flex-col space-y-3">
              <li>* 1 mayuscula</li>
              <li>* 1 minuscula</li>
              <li>* 1 numero</li>
              <li>* 1 caracter especial: [ /.*-@ ]</li>
              <li>* La longitud debe ser entre 8 y 16 digitos</li>
              <li>
                <div>
                  Ejemplo: <b>Carmen*12</b>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
*/

export default function ModalPequena({ visible, indice }) {
  return (
    <div
      className={`absolute top-full left-0 mt-2 w-full bg-gray-100 border border-[#082158] rounded-md shadow-lg p-4 text-md z-20 transition-all duration-300 ease-out
      ${
        visible && indice === "clave2"
          ? "opacity-100 scale-100 flex flex-col items-center"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <span className="text-xl font-semibold">
        La clave debe contener minimo
      </span>
      <ul className="flex flex-col gap-2 w-full">
        <li className="bg-white px-2 py-1 rounded-md">* 1 mayuscula</li>
        <li className="bg-white px-2 py-1 rounded-md">* 1 minuscula</li>
        <li className="bg-white px-2 py-1 rounded-md">* 1 numero</li>
        <li className="bg-white px-2 py-1 rounded-md">
          * 1 caracter especial: [ /.*-@ ]
        </li>
        <li className="bg-white px-2 py-1 rounded-md">
          * La longitud debe ser entre 8 y 16 digitos
        </li>
        <li className="bg-white px-2 py-1 rounded-md">
          <div>
            Ejemplo: <b>Carmen*12</b>
          </div>
        </li>
      </ul>
    </div>
  );
}
