import Input from "./Input";

export default function LabelInput({ nombre, value, setValue }) {
  return (
    <label className="block">
      <span className="text-gray-700 font-medium">{nombre}:</span>
      <Input
        type={"text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
