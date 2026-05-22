import DivMensajeInput from "@/components/mensaje/DivMensaje";
import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";
import Div from "@/components/padres/Div";
import { useRef } from "react";

export default function InputFecha({
  indice,
  name,
  disabled,
  className,
  placeholder,
  value,
  setValue,
  autoComplete,
  readOnly,
  validarFecha,
  setValidarFecha,
  htmlFor,
  nombre,
}) {
  const inputRef = useRef(null);

  const validandoCampos = (campo) => {
    return !isNaN(new Date(campo).getTime());
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;
    setValue?.(valor);
    const esValido = validandoCampos(valor);
    setValidarFecha?.(esValido);
  };

  const manejarClickInput = (e) => {
    if (inputRef.current && !disabled && !readOnly) {
      try {
        inputRef.current.showPicker();
      } catch (error) {
        console.log("No se pudo abrir el calendario");
      }
    }
  };

  const clasePorDefecto = `text-[#99a1af] text-xs py-3 cursor-pointer`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "fecha"}
      nombre={nombre ? nombre : "Fecha"}
    >
      <Input
        ref={inputRef}
        type="date"
        id={htmlFor ? htmlFor : "fecha"}
        value={value}
        name={name}
        disabled={disabled}
        className={nuevaClase}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "dd/mm/aaaa"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        onClick={manejarClickInput}
        indice={indice}
        max={new Date().toISOString().split("T")[0]}
      />
      {value && !validarFecha && (
        <DivMensajeInput mensaje={"Formato de fecha inválido"} />
      )}
    </LabelInput>
  );
}

// import DivMensajeInput from "@/components/mensaje/DivMensaje";
// import LabelInput from "@/components/inputs/LabelInput";
// import Input from "@/components/inputs/Input";

// export default function InputFecha({
//   indice,
//   name,
//   disabled,
//   className,
//   placeholder,
//   value,
//   setValue,
//   autoComplete,
//   readOnly,
//   validarFecha,
//   setValidarFecha,
//   htmlFor,
//   nombre,
// }) {
//   const validandoCampos = (campo) => {
//     // Validar que sea una fecha válida
//     return !isNaN(new Date(campo).getTime());
//   };

//   const leyendoInput = (e) => {
//     const valor = e.target.value; // formato YYYY-MM-DD
//     setValue?.(valor);

//     const esValido = validandoCampos(valor);
//     setValidarFecha?.(esValido);
//   };

//   // Generar fecha completa con hora actual al enviar
//   const obtenerFechaCompleta = () => {
//     if (!value) return null;
//     const fechaBase = new Date(value);
//     const ahora = new Date();
//     // Si el índice es mayor que la fecha actual, limitar
//     if (fechaBase > ahora) return ahora.toISOString();
//     return fechaBase.toISOString(); // YYYY-MM-DDTHH:mm:ssZ
//   };

//   return (
//     <LabelInput
//       htmlFor={htmlFor ? htmlFor : "fecha"}
//       nombre={nombre ? nombre : "Fecha"}
//     >
//       <Input
//         type="date"
//         id={htmlFor ? htmlFor : "fecha"}
//         value={value}
//         name={name}
//         disabled={disabled}
//         className={className}
//         onChange={leyendoInput}
//         placeholder={placeholder ? placeholder : "dd/mm/aaaa"}
//         autoComplete={autoComplete}
//         readOnly={readOnly}
//         indice={indice}
//         max={new Date().toISOString().split("T")[0]} // no pasar del día actual
//       />
//       {value && !validarFecha && (
//         <DivMensajeInput mensaje={"Formato de fecha inválido"} />
//       )}
//     </LabelInput>
//   );
// }
