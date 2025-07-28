"use client";

import { useState } from "react";
import Input from "./Input";
import ModalPequena from "../modales/ModalPeque";

const claveRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

export default function InputClave({
  name,
  disabled,
  className,
  placeholder,
  id,
  onChange,
  value,
  autoComplete,
  readOnly,
  ref,
  max,
  validarClave,
  setValidarClave,
  indice,
}) {
  const [mostrarClave, setMostrarClave] = useState(false);
  const [visible, setVisible] = useState(false);

  const mostrarModalS = () => setVisible(true);
  const ocultarModal = () => setVisible(false);

  const validandoCampos = (campo) => {
    if (indice === "clave") {
      return claveRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;
    onChange(e);

    if (indice === "clave") {
      const esValido = validandoCampos(valor);
      setValidarClave?.(esValido);
    }
  };

  return (
    // <div className={`${indice === "clave2" ? "flex gap-4" : ""} relative`}>
    //   <div className={`${indice === "clave2" ? "w-[80%]" : ""} relative`}>
    //     <Input
    //       type={mostrarClave ? "text" : "password"}
    //       id={id}
    //       value={value}
    //       name={name}
    //       disabled={disabled}
    //       className={className}
    //       onChange={leyendoInput}
    //       placeholder={placeholder}
    //       autoComplete={autoComplete}
    //       readOnly={readOnly}
    //       ref={ref}
    //       max={max}
    //       indice={indice}
    //     />

    //     <button
    //       type="button"
    //       onClick={() => setMostrarClave((prev) => !prev)}
    //       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-[#082158] focus:outline-none cursor-pointer"
    //     >
    //       {mostrarClave ? "🙈" : "👁️"}
    //     </button>
    //   </div>

    //   {indice === "clave2" && (
    //     <div className={`w-[20%]`}>
    //       <div
    //         onMouseEnter={mostrarModalS}
    //         onMouseLeave={ocultarModal}
    //         className="w-full py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:border-[#082158] cursor-pointer"
    //       >
    //         <svg
    //           fill="#082158"
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="24"
    //           height="24"
    //           viewBox="0 0 52 52"
    //         >
    //           <path d="M26.7,42.8c0.8,0,1.5,0.7,1.5,1.5v3.2c0,0.8-0.7,1.5-1.5,1.5h-3.2c-0.8,0-1.5-0.7-1.5-1.5v-3.2c0-0.8,0.7-1.5,1.5-1.5H26.7z"></path>
    //           <path d="M28.2,35.1c0-2.1,1.3-4,3.1-4.8h0.1c5.2-2.1,8.8-7.2,8.8-13.2c0-7.8-6.4-14.2-14.2-14.2c-7.2,0-13.2,5.3-14.2,12.2v0.1c-0.1,0.9,0.6,1.6,1.5,1.6h3.2c0.8,0,1.4-0.5,1.5-1.1v-0.2c0.7-3.7,4-6.5,7.9-6.5c4.5,0,8.1,3.6,8.1,8.1c0,2.1-0.8,4-2.1,5.5l-0.1,0.1c-0.9,1-2.1,1.6-3.3,2c-4,1.4-6.7,5.2-6.7,9.4v1.5c0,0.8,0.6,1.4,1.4,1.4h3.2c0.8,0,1.6-0.6,1.6-1.5L28.2,35.1z"></path>
    //         </svg>
    //       </div>
    //     </div>
    //   )}

    //   <ModalPequena visible={visible} indice={indice} />

    //   {/* <div
    //     className={`absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-sm z-20 transition-all duration-300 ease-out
    // ${
    //   visible && indice === "clave2"
    //     ? "opacity-100 scale-100"
    //     : "opacity-0 scale-95 pointer-events-none"
    // }`}
    //   >
    //     <p className="font-medium mb-2">🔐 Requisitos de la clave:</p>
    //     <ul className="list-disc list-inside space-y-1">
    //       <li>Mínimo 8 y máximo 16 caracteres</li>
    //       <li>Una letra mayúscula</li>
    //       <li>Una letra minúscula</li>
    //       <li>Un número</li>
    //       <li>Un símbolo especial (!@#$...)</li>
    //     </ul>
    //   </div> */}
    // </div>

    <div className={`${indice === "clave2" ? "flex gap-4" : ""} relative`}>
      <div className={`${indice === "clave2" ? "w-[80%]" : ""} relative`}>
        <Input
          type={mostrarClave ? "text" : "password"}
          id={id}
          value={value}
          name={name}
          disabled={disabled}
          className={className}
          onChange={leyendoInput}
          placeholder={placeholder}
          autoComplete={autoComplete}
          readOnly={readOnly}
          ref={ref}
          max={max}
          indice={indice}
        />

        <button
          type="button"
          onClick={() => setMostrarClave((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-[#082158] focus:outline-none cursor-pointer"
        >
          {mostrarClave ? "🙈" : "👁️"}
        </button>
      </div>

      {indice === "clave2" && (
        <>
          <div
            className={`w-[20%] relative flex items-center justify-center`}
            onMouseEnter={mostrarModalS}
            onMouseLeave={ocultarModal}
          >
            <div className="w-full py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:border-[#082158] cursor-pointer">
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
            </div>
          </div>
          <ModalPequena visible={visible} indice={indice} />
        </>
      )}
    </div>
  );
}

/**
  export default function InputClave({
    name,
    disabled,
    className,
    placeholder,
    id,
    onChange,
    value,
    autoComplete,
    readOnly,
    ref,
    max,
    validarClave,
    setValidarClave,
    indice,
    mostrarModalS,
    ocultarModal,
  }) {
    const [mostrarClave, setMostrarClave] = useState(false);

    const validandoCampos = (campo) => {
      if (indice === "clave") {
        return claveRegex.test(campo);
      }
    };

    const leyendoInput = (e) => {
      const valor = e.target.value;
      onChange(e);

      if (indice === "clave") {
        const esValido = validandoCampos(valor);
        setValidarClave?.(esValido);
      }
    };

    return (
      <div className={`${indice === "clave2" ? "flex space-x-4" : ""}`}>
        <div className={`${indice === "clave2" ? "w-[80%]" : ""} relative`}>
          <Input
            type={mostrarClave ? "text" : "password"}
            id={id}
            value={value}
            name={name}
            disabled={disabled}
            className={className}
            onChange={leyendoInput}
            placeholder={placeholder}
            autoComplete={autoComplete}
            readOnly={readOnly}
            ref={ref}
            max={max}
            indice={indice}
          />

          <button
            type="button"
            onClick={() => setMostrarClave((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-[#082158] focus:outline-none cursor-pointer"
          >
            {mostrarClave ? "🙈" : "👁️"}
          </button>
        </div>

        {indice === "clave2" && (
          <div className={`w-[20%]`}>
            <div
              onMouseEnter={mostrarModalS}
              onMouseLeave={ocultarModal}
              className="w-full py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:border-[#082158] cursor-pointer"
            >
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
            </div>
          </div>
        )}
      </div>
    );
  }
*/
