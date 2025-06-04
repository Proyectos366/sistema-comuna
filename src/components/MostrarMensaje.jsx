export default function MostrarMsj({ mensaje }) {
  return (
    <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
      {mensaje}
    </div>
  );
}
