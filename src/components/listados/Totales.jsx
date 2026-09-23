export default function TotalesPersonas({ nombre, totalVoceros }) {
  return (
    <div className="flex justify-between">
      <span className="font-semibold">{nombre}: </span>
      <b>{totalVoceros}</b>
    </div>
  );
}
