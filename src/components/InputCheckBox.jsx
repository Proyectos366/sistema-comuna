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
        className={`form-checkbox border min-w-[1.25rem] min-h-[1.25rem] w-${
          altura ? altura : 5
        } h-${
          altura ? altura : 5
        } text-blue-600 border-gray-300 rounded focus:ring-blue-400 cursor-pointer`}
      />
      <span>{nombre}</span>
    </label>
  );
}

/** 
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
*/

// export default function InputCheckBox({
//   id,
//   nombre,
//   isChecked,
//   onToggle,
// }) {
//   return (
//     <label key={id} className="flex items-center gap-2">
//       <input
//         type="checkbox"
//         checked={isChecked}
//         onChange={() => onToggle(id)}
//         className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//       />
//       <span>{nombre}</span>
//     </label>
//   );
// }

// import Label from "./Label";

// export default function InputCheckBox({
//   nivel,
//   id,
//   htmlFor,
//   value,
//   isChecked,
//   onChange,
//   nombre,
// }) {
//   return (
//     <div
//       className={`flex flex-col items-center justify-center pb-1 border ${
//         isChecked ? "border-[blue]" : ""
//       } w-24 rounded-md`}
//     >
//       <Label
//         htmlFor={htmlFor}
//         className="text-md"
//         nombre={nivel === 0 ? "Cabecera" : `${nombre}: ` + nivel}
//       />
//       <input
//         id={id}
//         type="checkbox"
//         value={value}
//         checked={isChecked} // Controla si el checkbox está marcado o no
//         onChange={onChange}
//         className={`appearance-none w-5 h-5 border rounded-full ${
//           isChecked ? "checked:bg-[red] checked:border-[blue]" : ""
//         } rounded-sm
//          checked:border-[black] focus:outline-none`}
//       />
//     </div>
//   );
// }
