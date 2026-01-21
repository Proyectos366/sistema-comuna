// import React, { forwardRef } from "react";

// const InputDate = forwardRef(
//   ({ id, value, onChange, disabled, participante, max, setFecha }, ref) => {
//     const handleChange = (e) => {
//       const rawValue = e.target.value; // "2026-01-19"

//       // Notificas al padre con el valor crudo (YYYY-MM-DD)
//       if (onChange) onChange(rawValue);

//       // Si quieres guardar ISO, lo construyes aquí
//       if (setFecha) setFecha(new Date(rawValue).toISOString());
//     };

//     return (
//       <input
//         ref={ref}
//         type="date"
//         id={id}
//         value={value || ""} // <-- ya viene en YYYY-MM-DD
//         onChange={handleChange}
//         disabled={disabled}
//         max={max || new Date().toISOString().split("T")[0]}
//         className={`border w-full rounded-md p-2 text-[11px] sm:text-lg outline-none ${
//           !participante.estaVerificado
//             ? !participante.puedeVerificar
//               ? " text-[#000000] border-[#99a1af]"
//               : "borde-fondo"
//             : !participante.estaVerificado
//               ? "border-[#E61C45]"
//               : "border-[#2FA807]"
//         }`}
//       />
//     );
//   },
// );

// export default InputDate;

import React, { forwardRef } from "react";

const InputDate = forwardRef(
  ({ id, value, onChange, disabled, participante, max, setFecha }, ref) => {
    const handleChange = (e) => {
      const rawValue = e.target.value;
      const isoValue = new Date(rawValue).toISOString();

      if (onChange) onChange(e);

      if (setFecha) setFecha(isoValue);
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
  },
);

export default InputDate;

// import React, { forwardRef } from "react";

// const InputDate = forwardRef(
//   ({ id, value, onChange, disabled, participante, max, setFecha }, ref) => {
//     return (
//       <input
//         ref={ref}
//         type="date"
//         id={id}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         setFecha={setFecha}
//         max={max || new Date().toISOString().split("T")[0]}
//         className={`border w-full rounded-md p-2 text-[11px] sm:text-lg outline-none ${
//           !participante.estaVerificado
//             ? !participante.puedeVerificar
//               ? " text-[#000000] border-[#99a1af]"
//               : "borde-fondo"
//             : !participante.estaVerificado
//               ? "border-[#E61C45]"
//               : "border-[#2FA807]"
//         }`}
//       />
//     );
//   },
// );

// export default InputDate;
