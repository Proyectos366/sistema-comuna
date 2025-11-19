import { Paginator } from "primereact/paginator";
import { template } from "./template";

export default function Paginador({
  first,
  setFirst,
  rows,
  setRows,
  totalRecords,
  colorFondo,
}) {
  const color = "#082158";

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <Paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
      template={template(setFirst, rows, setRows, color, totalRecords)}
      className={`!flex  ${
        colorFondo ? colorFondo : "!bg-gray-200"
      }  !border !border-gray-300 !rounded-md !shadow-md`}
    />
  );
}
