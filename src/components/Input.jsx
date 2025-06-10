"use client";

import { fechaLimite } from "@/utils/Fechas";
import { phoneRegex } from "@/utils/constantes";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const cedulaRegex = /^[1-9][0-9]{6,7}$/;
const textRegex = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/;
const numeroRegex = /^[1-9]$/;

const claveRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

export default function Input({
  type,
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  onChange,
  value,
  autoComplete,
  readOnly,
  validarCorreo,
  setValidarCorreo,
  validarCedula,
  setValidarCedula,
  validarTelefono,
  setValidarTelefono,
  validarFecha,
  setValidarFecha,
  validarTexto,
  setValidarTexto,
  validarClave,
  setValidarClave,
  validarNumero,
  setValidarNumero,
}) {
  const validandoCampos = (campo) => {
    if (indice === "email") {
      return emailRegex.test(campo);
    } else if (indice === "cedula") {
      return cedulaRegex.test(campo);
    } else if (indice === "telefono") {
      return phoneRegex.test(campo);
    } else if (indice === "date") {
      return campo <= fechaLimite;
    } else if (indice === "nombre") {
      return textRegex.test(campo);
    } else if (indice === "clave") {
      return claveRegex.test(campo);
    } else if (indice === "numero") {
      return numeroRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    if (
      indice === "cedula" &&
      (valor.startsWith("0") || /[^0-9]/.test(valor))
    ) {
      return;
    }

    if (
      indice === "numero" &&
      (valor.startsWith("0") || /[^0-9]/.test(valor) || Number(valor) > 9)
    ) {
      return;
    }

    onChange(e);

    if (indice === "email") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarCorreo(true);
      } else {
        setValidarCorreo(false);
      }
    } else if (indice === "cedula") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarCedula(true);
      } else {
        setValidarCedula(false);
      }
    } else if (indice === "telefono") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarTelefono(true);
      } else {
        setValidarTelefono(false);
      }
    } else if (indice === "fechaIngreso") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarFecha(true);
      } else {
        setValidarFecha(false);
      }
    } else if (indice === "nombre") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarTexto(true);
      } else {
        setValidarTexto(false);
      }
    } else if (indice === "clave") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarClave(true);
      } else {
        setValidarClave(false);
      }
    } else if (indice === "numero") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarNumero(true);
      } else {
        setValidarNumero(false);
      }
    }
  };

  const clasePorDefecto = `mt-1 uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
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
        disabled={disabled}
        className={nuevaClase}
        onChange={leyendoInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
      />
      {indice === "email" && value && !validarCorreo && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Formato invalido
        </div>
      )}

      {indice === "cedula" && value && !validarCedula && indice !== 10 && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Cédula inválida
        </div>
      )}

      {indice === "telefono" && value && !validarTelefono && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Solo numeros
        </div>
      )}

      {indice === "fechaIngreso" && value && !validarFecha && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Fecha invalida
        </div>
      )}

      {indice === "nombre" && value && !validarTexto && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Solo letras
        </div>
      )}
      {/* 
      {indice === "numero" && value && !validarNumero && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Solo numeros
        </div>
      )} */}
    </div>
  );
}
