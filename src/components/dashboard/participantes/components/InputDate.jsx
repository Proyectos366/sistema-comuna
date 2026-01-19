import React, { forwardRef } from "react";

const InputDate = forwardRef(
  ({ id, value, onChange, disabled, participante, max }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        max={max || new Date().toISOString().split("T")[0]}
        className={`border w-full rounded-md p-2 text-[11px] sm:text-lg outline-none ${
          !participante.estaVerificado
            ? !participante.puedeVerificar
              ? " text-[#000000] border-[#99a1af]"
              : "borde-fondo"
            : !participante.estaVerificado
            ? "border-[#E61C45]"
            : "border-[#2FA807]"
        }`}
      />
    );
  }
);

export default InputDate;
