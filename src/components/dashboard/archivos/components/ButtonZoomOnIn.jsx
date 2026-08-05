import { Ripple } from "primereact/ripple";

export default function ButtonZoomOnIn({ zoom, scale, type }) {
  const isDisabled = type === "in" ? scale >= 2.5 : scale <= 0.5;

  return (
    <button
      type="button"
      onClick={zoom}
      disabled={isDisabled}
      className={`px-2 py-[1px] sm:py-1 sm:px-3 text-sm rounded-md font-semibold h-full ${
        isDisabled
          ? "bg-[#ffffff] border border-[#d1d5dc] text-[#99a1af] cursor-not-allowed"
          : "bg-[#ffffff] border border-[#d1d5dc] text-[#082158] cursor-pointer transition hover:scale-105 duration-500"
      }`}
      title={type === "in" ? "Acercar" : "Alejar"}
    >
      {type === "in" ? "+" : "−"}
      <Ripple />
    </button>
  );
}
