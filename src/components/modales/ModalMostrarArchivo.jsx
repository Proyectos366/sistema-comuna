import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser } from "@/app/context/AuthContext";

import Titulos from "@/components/Titulos";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";

import { capitalizarTitulo } from "@/utils/formatearTextCapitalice";

export default function ModalMostrarArchivo({ isVisible, onClose, children }) {
  const { screenSize } = useUser();

  const { nameArchivo } = useSelector((state) => state.archivos.archivoActual);

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
    <Div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-10 md:px-16">
      <Div className="absolute inset-0 bg-[#08080b] opacity-90"></Div>

      <Div className="relative flex justify-center items-center bg-[#ffffff] rounded-md shadow-xl px-1 sm:px-6 py-6 w-full border border-[#d1d5dc] transition-transform transform hover:scale-105">
        <Button
          nombre={"x"}
          className="absolute top-0 right-2 text-[#364153] hover:text-[#101828] cursor-pointer text-3xl transition-opacity opacity-70 hover:opacity-100"
          onClick={onClose}
        ></Button>

        <Div className="flex flex-col items-center gap-2 w-full">
          <Div className="w-full flex justify-center">
            <Titulos
              indice={screenSize?.width > 640 ? 2 : 4}
              className="text-center text-2xl font-semibold text-[#364153]"
              titulo={nameArchivo ? capitalizarTitulo(nameArchivo) : ""}
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
