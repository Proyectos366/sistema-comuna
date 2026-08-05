import { Ripple } from "primereact/ripple";

import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";

export default function ButtonPastNext({
  pageNumber,
  goToPage,
  numPages,
  indice,
}) {
  const isDisabled = !indice ? pageNumber <= 1 : pageNumber >= numPages;

  return (
    <Button
      type="button"
      onClick={goToPage}
      disabled={isDisabled}
      className={`border px-1 py-[3px] sm:py-1 sm:px-3 text-sm rounded-md font-semibold ${
        isDisabled
          ? "border-[#d1d5dc] bg-[#ffffff] text-[#08215880] cursor-not-allowed"
          : "border bg-[#082158] text-[#ffffff] cursor-pointer transition hover:scale-105 duration-500"
      }`}
    >
      <Span className="hidden sm:block">
        {!indice ? "Anterior" : "Siguiente"}
      </Span>
      <Span className="block sm:hidden">
        {!indice ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="14"
            fill={isDisabled ? "#08215880" : "#ffffff"}
            viewBox="0 0 24 24"
          >
            <path d="M4 12l8 8v-6h8v-4h-8V4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="14"
            fill={isDisabled ? "#08215880" : "#ffffff"}
            viewBox="0 0 24 24"
          >
            <path d="M20 12l-8-8v6H4v4h8v6z" />
          </svg>
        )}
      </Span>
      <Ripple />
    </Button>
  );
}
