import BloqueInfo from "@/components/BloqueInfo";
import { formatearFecha } from "@/utils/Fechas";

export default function DetallesEmpleado({ usuarios }) {
  return (
    <div className="flex flex-col gap-2">
      <BloqueInfo indice={1} nombre={"Nombre"} valor={usuarios?.nombre} />

      <BloqueInfo indice={1} nombre={"Apellido"} valor={usuarios?.apellido} />

      <BloqueInfo indice={1} nombre={"Correo"} valor={usuarios?.correo} />

      <BloqueInfo indice={1} nombre={"Rol"} valor={usuarios?.roles?.nombre} />

      <BloqueInfo
        indice={5}
        nombre={"Acceso"}
        valor={usuarios?.validado ? "Permitido" : "Restringido"}
      />

      <BloqueInfo
        indice={1}
        nombre={"Departamento"}
        valor={
          usuarios?.MiembrosDepartamentos?.[0]?.nombre
            ? usuarios.MiembrosDepartamentos?.[0]?.nombre
            : "sin asignar"
        }
      />

      <BloqueInfo
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(usuarios?.createdAt)}
      />
    </div>
  );
}
