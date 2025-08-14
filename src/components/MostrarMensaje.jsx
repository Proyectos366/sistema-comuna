export default function MostrarMsj({ mensaje }) {
  return (
    <div className="text-[#E61C45] text-xl text-center shadow-[0px_2px_4px_#E61C45] bg-white font-semibold border border-[#E61C45] rounded-md px-4 py-2">
      {mensaje}
    </div>
  );
}
