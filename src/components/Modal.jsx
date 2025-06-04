import { useEffect } from "react";
import Titulos from "./Titulos";

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
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-0">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative bg-white rounded-lg shadow-lg px-6 py-10 max-w-lg w-full">
        <button className="absolute top-2 right-2 text-black" onClick={onClose}>
          &times;
        </button>

        <div className="flex flex-col items-center space-y-2">
          <Titulos
            indice={2}
            className={`text-center pb-4 text-2xl`}
            titulo={titulo}
          />

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
