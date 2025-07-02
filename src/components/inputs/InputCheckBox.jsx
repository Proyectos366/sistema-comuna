export default function InputCheckBox({
  id,
  nombre,
  isChecked,
  onToggle,
  altura,
}) {
  return (
    <label key={id} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(id, nombre)}
        className={`form-checkbox border w-${altura ? altura : 5} h-${
          altura ? altura : 5
        } text-blue-600 border-gray-300 rounded focus:ring-blue-400`}
      />
      <span>{nombre}</span>
    </label>
  );
}
