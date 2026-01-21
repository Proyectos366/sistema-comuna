import BloqueInfo from "@/components/BloqueInfo";

import { calcularEdadPorFechaNacimiento, formatearFecha } from "@/utils/Fechas";
import { formatearCedula } from "@/utils/formatearCedula";
import { formatearTelefono } from "@/utils/formatearTelefono";

export default function DatosListadoParticipante({ participante }) {
  return (
    <>
      <BloqueInfo
        nombre={"Cedula"}
        valor={formatearCedula(participante.cedula)}
        indice={1}
      />

      <BloqueInfo
        nombre={"Edad"}
        valor={calcularEdadPorFechaNacimiento(participante.f_n) + " años"}
        indice={1}
      />

      <BloqueInfo
        nombre={"Genero"}
        valor={participante.genero ? "MASCULINO" : "FEMENINO"}
        indice={1}
      />

      <BloqueInfo nombre={"Correo"} valor={participante.correo} indice={1} />

      <BloqueInfo
        nombre={"Telefono"}
        valor={formatearTelefono(participante.telefono)}
        indice={1}
      />

      <BloqueInfo
        nombre={"Parroquia"}
        valor={participante.parroquias?.nombre || "No asignada"}
        indice={1}
      />

      <BloqueInfo
        nombre={"Comuna"}
        valor={participante.comunas?.nombre || "No asignada"}
        indice={1}
      />

      <BloqueInfo
        nombre={"Circuito comunal"}
        valor={participante.circuitos?.nombre || "No asignado"}
        indice={1}
      />

      <BloqueInfo
        nombre={"Consejo comunal"}
        valor={participante.consejos?.nombre || "No asignado"}
        indice={1}
      />

      <BloqueInfo
        nombre={"Formación"}
        valor={participante.formaciones.nombre}
        indice={1}
      />

      <BloqueInfo
        nombre={"Verificado"}
        valor={participante.estaVerificado ? "Sí" : "No"}
        indice={1}
      />

      <BloqueInfo
        nombre={"Certificado"}
        valor={participante.estaCertificado ? "Sí" : "No"}
        indice={1}
      />

      {participante.fecha_completado && (
        <BloqueInfo
          indice={1}
          nombre={"Fecha de certificación"}
          valor={formatearFecha(participante.fecha_completado)}
        />
      )}

      <BloqueInfo
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(participante.createdAt)}
      />
    </>
  );
}
