export default function LabelInput({ children, nombre }) {
  return (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{nombre}: </span>
      {children}
    </label>
  );
}
