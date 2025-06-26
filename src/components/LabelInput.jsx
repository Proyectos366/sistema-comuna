import Input from "./Input";

export default function LabelInput({
  nombre,
  type,
  value,
  setValue,
  indice,
  validar,
  setValidar,
  validarCedula,
  setValidarCedula,
  validarTexto,
  setValidarTexto,
  validarCorreo,
  setValidarCorreo,
  validarClave,
  setValidarClave,
  handleChange,
}) {
  return (
    <div className="w-full">
      <label className="block">
        <span className="text-gray-700 font-medium">{nombre}:</span>
        <Input
          type={!type ? "text" : type}
          value={value}
          onChange={
            typeof setValue === "function"
              ? (e) => setValue(e.target.value)
              : handleChange
          }
          indice={indice}
          setValidarNumero={setValidar}
          validarNumero={validar}
          setValidarCedula={setValidarCedula}
          validarCedula={validarCedula}
          validarCorreo={validarCorreo}
          setValidarCorreo={setValidarCorreo}
          validarClave={validarClave}
          setValidarClave={setValidarClave}
          validarTexto={validarTexto}
          setValidarTexto={setValidarTexto}
        />
      </label>
    </div>
  );
}
