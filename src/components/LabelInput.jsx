import Input from "./Input";

export default function LabelInput({
  nombre,
  value,
  setValue,
  indice,
  validar,
  setValidar,
}) {
  return (
    <div className="w-full">
      <label className="block">
        <span className="text-gray-700 font-medium">{nombre}:</span>
        <Input
          type={"text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          indice={indice}
          setValidarNumero={setValidar}
          validarNumero={validar}
        />
      </label>
    </div>
  );
}
