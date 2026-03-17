import { useEffect, useState } from "react";

import LabelInput from "@/components/inputs/LabelInput";
import Div from "@/components/padres/Div";
import Input from "@/components/inputs/Input";
import DivMensajeInput from "@/components/mensaje/DivMensaje";
import ModalNombreEstante from "@/components/modales/ModalNombreEstante";

import { estanteRegex } from "@/utils/regex/nombreEstanteRegex";
import { caracteresPermitidos } from "@/utils/regex/caracteresPermitidos";

export default function InputNombreEstante({
  disabled,
  className,
  placeholder,
  value,
  onChange,
  autoComplete,
  readOnly,
  validarEstante,
  setValidarEstante,
  setValue,
  name,
  htmlFor,
  nombre,
  indice,
}) {
  const [visible, setVisible] = useState(false);

  const mostrarModal = () => setVisible(true);
  const ocultarModal = () => setVisible(false);

  const leyendoInput = (e) => {
    const valorEntrada = e.target.value;

    // Validación previa de caracteres permitidos
    if (valorEntrada.length > 0 && !caracteresPermitidos.test(valorEntrada)) {
      return;
    }

    setValue?.(valorEntrada);

    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (value === undefined) return;

    const esValido = value === "" ? true : estanteRegex.test(value);
    setValidarEstante?.(esValido);
  }, [value, setValidarEstante]);

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "estante"}
      nombre={nombre ? nombre : "Estante"}
    >
      <Div
        className={`${indice === "estante2" ? "flex gap-4" : "flex flex-col gap-[1px]"} relative`}
      >
        <Div className={`${indice === "estante2" ? "w-[80%]" : ""} relative`}>
          <Input
            type="text"
            id={htmlFor ? htmlFor : "estante"}
            value={value || ""}
            name={name}
            disabled={disabled}
            className={className}
            onChange={leyendoInput}
            placeholder={
              placeholder ? placeholder : "estante rosado de madera 001"
            }
            autoComplete={autoComplete}
            readOnly={readOnly}
            indice="estante"
          />

          {indice === "estante" &&
            value &&
            value.length > 0 &&
            !validarEstante && (
              <DivMensajeInput mensaje="Formato: estante [texto] [número]" />
            )}
        </Div>

        {indice === "estante2" && (
          <>
            <Div
              className="w-[20%] relative flex items-center justify-center"
              onMouseEnter={mostrarModal}
              onMouseLeave={ocultarModal}
            >
              <Div className="w-full py-2 flex items-center justify-center rounded-md border border-[#d1d5dc] bg-[#ffffff] hover:border-[#082158] cursor-pointer">
                <svg
                  fill="#082158"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 52 52"
                >
                  <path d="M26.7,42.8c0.8,0,1.5,0.7,1.5,1.5v3.2c0,0.8-0.7,1.5-1.5,1.5h-3.2c-0.8,0-1.5-0.7-1.5-1.5v-3.2c0-0.8,0.7-1.5,1.5-1.5H26.7z"></path>
                  <path d="M28.2,35.1c0-2.1,1.3-4,3.1-4.8h0.1c5.2-2.1,8.8-7.2,8.8-13.2c0-7.8-6.4-14.2-14.2-14.2c-7.2,0-13.2,5.3-14.2,12.2v0.1c-0.1,0.9,0.6,1.6,1.5,1.6h3.2c0.8,0,1.4-0.5,1.5-1.1v-0.2c0.7-3.7,4-6.5,7.9-6.5c4.5,0,8.1,3.6,8.1,8.1c0,2.1-0.8,4-2.1,5.5l-0.1,0.1c-0.9,1-2.1,1.6-3.3,2c-4,1.4-6.7,5.2-6.7,9.4v1.5c0,0.8,0.6,1.4,1.4,1.4h3.2c0.8,0,1.6-0.6,1.6-1.5L28.2,35.1z"></path>
                </svg>
              </Div>
            </Div>
            <ModalNombreEstante visible={visible} indice={indice} />
          </>
        )}
      </Div>

      {indice === "estante2" &&
        value &&
        value.length > 0 &&
        !validarEstante && (
          <DivMensajeInput mensaje="Formato de alias invalido" />
        )}
    </LabelInput>
  );
}
