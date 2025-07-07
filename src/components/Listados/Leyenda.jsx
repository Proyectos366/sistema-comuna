import TotalesPersonas from "./Totales";

export default function Leyenda({ titulo, totalVoceros, totalHombres, totalMujeres}) {
  return (
    <div className="border borde-fondo w-full p-2 rounded-md">
      <TotalesPersonas nombre={titulo} totalVoceros={totalVoceros} />
      <TotalesPersonas nombre={'Hombres'} totalVoceros={totalHombres} />
      <TotalesPersonas nombre={'Mujeres'} totalVoceros={totalMujeres} />
    </div>
  );
}
