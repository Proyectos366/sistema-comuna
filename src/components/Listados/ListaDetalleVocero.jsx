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
          <span className="font-semibold text-sm sm:text-md">{nombre}:</span>
          <span className="text-sm sm:text-md uppercase">{valor}</span>
        </div>
      )}

      {indice === 2 && (
        <div className="flex flex-row gap-2">
          <span className="font-semibold text-sm sm:text-md">{nombre}:</span>
          <span
            className={`${
              valor ? "text-[#2FA807]" : "text-[#E61C45]"
            } uppercase text-sm sm:text-md`}
          >
            {valor ? "Sí" : "No"}
          </span>
        </div>
      )}

      {indice === 3 && (
        <div className="w-full flex flex-col">
          <div>
            <span className="font-semibold text-sm sm:text-md">Formador: </span>
            <span
              className={`${
                formador ? "uppercase font-medium" : "text-[#E61C45]"
              } text-sm sm:text-md`}
            >
              {formador ? formador : "Sin asignar"}
            </span>
          </div>

          <div className="flex flex-row gap-2">
            <span className="font-semibold text-sm sm:text-md">
              {formatoTituloPersonalizado(nombre)}:
            </span>
            <div>
              <span
                className={`${
                  valor ? "text-[#2FA807]" : "text-[#E61C45]"
                } uppercase text-sm sm:text-md`}
              >
                {valor ? "Asistio" : "No asistio"}
              </span>
              <span>{" — " + fecha}</span>
            </div>
          </div>
        </div>
      )}

      {indice === 4 && (
        <div className="flex flex-row gap-2">
          <span className="font-semibold text-sm sm:text-md">{nombre}:</span>
          <span
            className={`${
              valor ? "text-[#E61C45]" : "text-[#2FA807]"
            } uppercase text-sm sm:text-md`}
          >
            {valor ? "inactivo" : "activo"}
          </span>
        </div>
      )}

      {indice === 5 && (
        <div className="flex flex-row gap-2">
          <span className="font-semibold text-sm sm:text-md">{nombre}:</span>
          <span
            className={`${
              !valor ? "text-[#E61C45]" : "text-[#2FA807]"
            } uppercase text-sm sm:text-md`}
          >
            {!valor ? "Sin acceso" : "Autorizado"}
          </span>
        </div>
      )}

      {indice === 6 && (
        <div className="flex flex-row gap-2">
          <span className="font-semibold text-sm sm:text-md">{nombre}:</span>
          <span
            className={`${
              valor === "pendiente" ? "text-[#E61C45]" : "text-[#2FA807]"
            } uppercase text-sm sm:text-md`}
          >
            {valor === "pendiente" ? "Pendiente" : "Recibida"}
          </span>
        </div>
      )}
    </>
  );
}
