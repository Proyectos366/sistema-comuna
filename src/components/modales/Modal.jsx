import { useEffect } from "react";
import Titulos from "@/components/Titulos";

export default function Modal({ isVisible, onClose, children, titulo }) {
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="absolute inset-0 bg-black opacity-80"></div>

      <div className="relative flex justify-center items-center bg-white rounded-md shadow-xl px-2 sm:px-6 py-6 max-w-lg w-full border border-gray-400 transition-transform transform hover:scale-105">
        <button
          className="absolute -top-2 right-1 text-red-500 sm:text-gray-700 hover:text-gray-900 cursor-pointer text-3xl transition-opacity opacity-70 hover:opacity-100"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col gap-3 items-center w-full">
          <div className="w-full flex justify-center">
            <Titulos
              indice={2}
              className="text-center text-2xl font-semibold text-gray-800"
              titulo={titulo}
            />
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
