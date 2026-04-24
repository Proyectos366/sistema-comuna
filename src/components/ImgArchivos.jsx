

export default function ImgArchivos({ extension}) {
    
    return (
      <>
      {extension === "pdf" && (
        <img src="/img/document/img-pdf.jpg" alt="Imagen para representar el documento pdf" />
      )}

{extension === "xlsx" && (
        <img className="w-14" src="/img/document/img-excel.png" alt="Imagen para representar el documento excel" />
      )}

      </>
    )
}