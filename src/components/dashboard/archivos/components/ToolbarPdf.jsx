import { useUser } from "@/app/context/AuthContext";

import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";
import ButtonPastNext from "@/components/dashboard/archivos/components/ButtonPastNext";
import ButtonZoomOnIn from "@/components/dashboard/archivos/components/ButtonZoomOnIn";
import ButtonResetZoom from "@/components/dashboard/archivos/components/ButtonResetZoom";

export default function ToolbarPdf({
  pageNumber,
  numPages,
  goToPrevPage,
  goToNextPage,
  scale,
  zoomIn,
  zoomOut,
  resetZoom,
}) {
  const { screenSize } = useUser();

  return (
    <Div className="absolute top-0 left-0 right-0 z-10 bg-[#e5e7eb] shadow-md p-2 flex items-center justify-center gap-1 flex-wrap rounded-t-lg">
      <Div className={`flex items-center`}>
        <ButtonPastNext
          pageNumber={pageNumber}
          goToPage={goToPrevPage}
          numPages={1}
          indice={0}
        />

        <Span className="px-2 py-1 text-[#082158] text-[10px] sm:text-xs font-semibold">
          {screenSize?.width > 640
            ? `Página ${pageNumber}/${numPages || "?"}`
            : `Pág ${pageNumber}/${numPages || "?"}`}
        </Span>

        <ButtonPastNext
          pageNumber={pageNumber}
          goToPage={goToNextPage}
          numPages={numPages}
          indice={1}
        />
      </Div>

      <Div className="w-px h-6 bg-[#d1d5dc] mx-1"></Div>

      <Div className={`flex items-center`}>
        <ButtonZoomOnIn zoom={zoomOut} scale={scale} type="out" />

        <Span className="px-2 py-1 text-[#082158] text-[10px] sm:text-xs font-semibold">
          {Math.round(scale * 100)}%
        </Span>

        <ButtonZoomOnIn zoom={zoomIn} scale={scale} type="in" />
      </Div>

      <ButtonResetZoom reset={resetZoom} screenSize={screenSize} />
    </Div>
  );
}
