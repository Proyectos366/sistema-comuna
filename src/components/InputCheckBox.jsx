import Label from "./Label";

export default function InputCheckBox({
  nivel,
  id,
  htmlFor,
  value,
  isChecked,
  onChange,
  nombre,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center pb-1 border ${
        isChecked ? "border-[blue]" : ""
      } w-24 rounded-md`}
    >
      <Label
        htmlFor={htmlFor}
        className="text-md"
        nombre={nivel === 0 ? "Cabecera" : `${nombre}: ` + nivel}
      />
      <input
        id={id}
        type="checkbox"
        value={value}
        checked={isChecked} // Controla si el checkbox está marcado o no
        onChange={onChange}
        className={`appearance-none w-5 h-5 border rounded-full ${
          isChecked ? "checked:bg-[red] checked:border-[blue]" : ""
        } rounded-sm 
         checked:border-[black] focus:outline-none`}
      />
    </div>
  );
}
