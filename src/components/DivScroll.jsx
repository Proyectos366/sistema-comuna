export default function DivScroll({ children }) {
  return (
    <div className="overflow-y-auto h-[390px] no-scrollbar flex flex-col w-full gap-2 px-1">
      {children}
    </div>
  );
}
