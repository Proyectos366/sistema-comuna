export default function MostrarArchivo({ url, id }) {
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden shadow-lg bg-[#ffffff] p-4"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    >
      <iframe id={id ? id : "iframe"} className="" src={url} />
      <div
        className="absolute ms-[42%] top-0 left-0 w-[60%] h-5 sm:h-14 bg-[#000000]"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
      ></div>

      <div
        className="absolute sm:top-14 left-0 w-[98%] h-full bg-[#ddddd7] opacity-10"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
      ></div>
    </div>
  );
}
