import { Ripple } from "primereact/ripple";

import Button from "@/components/padres/Button";

export default function ButtonResetZoom({ reset, screenSize }) {
  return (
    <Button
      type="button"
      onClick={reset}
      className="px-2 py-1 text-[10px] sm:text-sm rounded-md font-semibold bg-[#ffffff] border border-[#d1d5dc] text-[#082158] cursor-pointer transition hover:scale-105 duration-500"
      title="Restablecer tamaño"
    >
      {screenSize?.width > 640 ? (
        "Reiniciar"
      ) : (
        <svg
          xmlns="http://w3.org"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <polyline points="3 3 3 8 8 8"></polyline>
        </svg>
      )}
      <Ripple />
    </Button>
  );
}
