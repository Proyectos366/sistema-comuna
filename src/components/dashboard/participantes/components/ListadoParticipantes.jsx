import { useDispatch } from "react-redux";

//import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfo from "@/components/BloqueInfo";

import { formatearFecha } from "@/utils/Fechas";
import { useState } from "react";

export default function ListadoParticipantes({ participante }) {
  const [datosActualizar, setDatosActualizar] = useState([]); // Estado solo para fecha
  const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");
  const dispatch = useDispatch();

  const handleContainerClick = (idAsistencia) => {
    const targetInput = inputRefs.current[idAsistencia];
    if (targetInput && !targetInput.disabled) {
      targetInput.showPicker?.();
      targetInput.focus();
    }
  };

  const actualizarFechaModulo = (moduloId, fecha, asistenciaId) => {
    setDatosActualizar({
      modulo: moduloId,
      fecha: fecha,
      id_asistencia: asistenciaId,
    });

    setFechaAprobacionModulo((prev) => ({
      ...prev,
      [moduloId]: fecha, // Guarda solo la fecha del módulo seleccionado
    }));
  };


  console.log(participante);
  
  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfo indice={1} nombre={"Nombre"} valor={participante.nombre} />

      <div
        className={`border ${
          !participante.estaVerificado
            ? !participante.puedeVerificar
              ? " text-black border-gray-400"
              : "borde-fondo"
            : !participante.estaVerificado
            ? "border-[#E61C45]"
            : "border-[#2FA807]"
        } rounded-md shadow-md p-2 mt-2`}
      >
        <p className="font-semibold">Módulos (asistencias):</p>

        <div className="flex flex-col space-y-2">
          {participante.asistencias.map((asistencia) => {
            return (
              <div
                key={asistencia.id_modulo}
                className="flex flex-wrap justify-between items-center gap-3 mt-1"
              >
                <div
                  className={`flex-1 text-sm sm:text-lg py-2  text-center uppercase border ${
                    asistencia.presente ? "border-[#2FA807]" : "border-gray-300"
                  }  rounded-md shadow-sm min-w-0`}
                >
                  {participante.formaciones.modulos.find(
                    (m) => m.id === asistencia.id_modulo
                  )?.nombre || "Módulo desconocido"}
                </div>

                <div className="flex-1 min-w-0">
                  {asistencia.presente ? (
                    <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
                      {formatearFecha(asistencia.fecha_registro)}
                    </div>
                  ) : (
                    <div
                      onClick={() => handleContainerClick(asistencia.id)}
                      className="w-full cursor-pointer"
                    >
                      {/* <InputDate
                        ref={(el) => {
                          if (el) inputRefs.current[asistencia.id] = el;
                        }}
                        max={new Date().toISOString().split("T")[0]}
                        type="date"
                        disabled={asistencia.presente}
                        value={
                          fechaAprobacionModulo[asistencia.id_modulo] || ""
                        }
                        onChange={(e) =>
                          actualizarFechaModulo(
                            asistencia.id_modulo,
                            e.target.value,
                            asistencia.id
                          )
                        }
                        className="w-full cursor-pointer"
                      /> */}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {asistencia.presente ? (
                    <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
                      Aprobado
                    </div>
                  ) : (
                    <button
                      nombre={"Aprobar"}
                      disabled={
                        !fechaAprobacionModulo[asistencia.id_modulo] ||
                        asistencia.presente
                      }
                      onClick={() => {
                        setOpciones("modulo");
                        abrirModal();
                        setIdModulo(asistencia.id_modulo);
                      }}
                      className={`w-full py-2 ${
                        !fechaAprobacionModulo[asistencia.id_modulo]
                          ? "bg-gray-400 text-black"
                          : "cursor-pointer color-fondo hover:bg-blue-700 text-white py-[9px]"
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      

      <div className="mt-4 flex gap-4 pb-4">
        <button
          title={
            !participante.puedeVerificar
              ? "Para verificar primero debe validar todos los modulos"
              : !participante.estaVerificado
              ? "Puede verificar"
              : "Ya esta verificado"
          }
          nombre={participante.estaVerificado ? "Verificado" : "Verificar"}
          disabled={!participante.puedeVerificar || participante.estaVerificado}
          onClick={() => {
            // setOpciones("verificado");
            // abrirModal();
            // setDatosVerificar(curso);
          }}
          className={`py-2 ${
            !participante.puedeVerificar
              ? "bg-gray-400 hover:bg-GRAY-300 text-black"
              : participante.estaVerificado
              ? "bg-[#2FA807] text-white"
              : "color-fondo hover:bg-blue-700 text-white"
          }`}
        />

        <button
          title={
            !participante.puedeCertificar
              ? "Para certificar primero debe estar verificado"
              : participante.estaVerificado
              ? "Puede certificar"
              : "Ya esta certificado"
          }
          nombre={participante.culminado ? "Certificado" : "Certificar"}
          disabled={participante.culminado ? true : !participante.puedeCertificar}
          onClick={() => {
            setOpciones("certificado");
            abrirModal();
            setDatosCertificar(participante);
          }}
          className={`py-2 ${
            participante.puedeCertificar
              ? participante.culminado
                ? "bg-[#2FA807] text-white"
                : "color-fondo hover:bg-blue-700 text-white"
              : !participante.puedeCertificar
              ? "cursor-not-allowed bg-gray-400 text-black"
              : "cursor-pointer color-fondo hover:bg-blue-700 text-white"
          }`}
        />
      </div>

      <BloqueInfo
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(participante.createdAt)}
      />
    </Div>
  );
}
