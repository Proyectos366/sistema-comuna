import { formatoTituloPersonalizado } from "@/utils/formatearTextCapitalice";

export default function ListaDetallesVocero({
  nombre,
  valor,
  indice,
  fecha,
  formador,
}) {
  return (
    <>
      {indice === 1 && (
        <div className="flex flex-row gap-2">
          <span className="font-semibold text-md">{nombre}:</span>
          <span className="text-md uppercase">{valor}</span>
        </div>
      )}

      {indice === 2 && (
        <div className="flex flex-row gap-2">
          <span className="font-semibold text-md">{nombre}:</span>
          <span
            className={`${valor ? "text-green-700" : "text-red-600"} uppercase`}
          >
            {valor ? "Sí" : "No"}
          </span>
        </div>
      )}

      {indice === 3 && (
        <div className="w-full flex flex-col">
          <div>
            <span className="font-semibold text-md">Formador: </span>
            <span className={`${formador ? 'uppercase' : 'text-[#E61C45]'}`}>{formador ? formador : 'Sin asignar'}</span>
          </div>

          <div className="flex flex-row gap-2">
            <span className="font-semibold text-md">
              {formatoTituloPersonalizado(nombre)}:
            </span>
            <div>
              <span
                className={`${
                  valor ? "text-green-700" : "text-[#E61C45]"
                } uppercase`}
              >
                {valor ? "Asistio" : "No asistio"}
              </span>
              <span>{" — " + fecha}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
