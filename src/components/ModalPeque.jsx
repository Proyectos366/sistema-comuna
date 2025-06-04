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
