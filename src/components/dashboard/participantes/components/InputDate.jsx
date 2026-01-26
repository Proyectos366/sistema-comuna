import { forwardRef } from "react";

const InputDate = forwardRef(
  ({ id, value, onChange, disabled, participante, max }, ref) => {
    const handleClick = (e) => {
      if (disabled || !e.target.showPicker) return;

      // Usar requestAnimationFrame para sincronizar con el gesto del usuario
      requestAnimationFrame(() => {
        try {
          e.target.showPicker();
        } catch {
          e.target.focus(); // Fallback si showPicker falla
        }
      });
    };

    return (
      <input
        ref={ref}
        type="date"
        id={id}
        value={value ? new Date(value).toISOString().split("T")[0] : ""}
        onChange={onChange}
        onClick={handleClick}
        disabled={disabled}
        max={max || new Date().toISOString().split("T")[0]}
        className={`border w-full rounded-md p-2 text-[11px] sm:text-lg outline-none ${
          disabled
            ? "cursor-not-allowed text-[#000000] border-[#99a1af]"
            : "cursor-pointer"
        } ${
          !participante.estaVerificado
            ? !participante.puedeVerificar
              ? "text-[#000000] border-[#99a1af]"
              : "borde-fondo"
            : !participante.estaVerificado
              ? "border-[#E61C45]"
              : "border-[#2FA807]"
        }`}
      />
    );
  },
);

export default InputDate;

/** 
const InputDate = forwardRef(
  ({ id, value, onChange, disabled, participante, max }, ref) => {
    const handleChange = (e) => {
      const rawValue = e.target.value;
      const isoValue = new Date(rawValue).toISOString();

      if (onChange) onChange(e);
    };

    return (
      <input
        ref={ref}
        type="date"
        id={id}
        value={value ? new Date(value).toISOString().split("T")[0] : ""}
        onChange={handleChange}
        disabled={disabled}
        max={max || new Date().toISOString().split("T")[0]}
        className={`border w-full rounded-md p-2 text-[11px] sm:text-lg outline-none cursor-pointer ${
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
  },
);

export default InputDate;
*/
