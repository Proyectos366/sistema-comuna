import { useEffect } from "react";
import Titulos from "@/components/Titulos";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";

export default function ModalConsultar({
  isVisible,
  onClose,
  children,
  titulo,
}) {
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
    <Div className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-0">
      <Div className="absolute inset-0 bg-[#08080b] opacity-90"></Div>

      <Div className="relative flex justify-center items-center bg-white rounded-md shadow-xl px-6 py-6 max-w-lg w-full border border-gray-300 transition-transform transform hover:scale-105">
        <Button
          nombre={"x"}
          className="absolute top-0 right-2 text-gray-700 hover:text-gray-900 cursor-pointer text-3xl transition-opacity opacity-70 hover:opacity-100"
          onClick={onClose}
        ></Button>

        <Div className="flex flex-col items-center w-full">
          <Div className="w-full flex justify-center">
            <Titulos
              indice={2}
              className="text-center text-2xl font-semibold text-gray-700"
              titulo={titulo}
            />
          </Div>

          <Div className="w-full flex flex-col items-center gap-2">
            {children}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
