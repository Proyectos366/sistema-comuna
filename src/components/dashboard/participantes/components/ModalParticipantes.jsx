"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import Div from "@/components/padres/Div";
import SelectOpcion from "@/components/SelectOpcion";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonesModal from "@/components/botones/BotonesModal";
import DivScroll from "@/components/DivScroll";
import AvisoAdvertencia from "@/components/dashboard/participantes/components/AvisoAdvertencia";
import InputFecha from "@/components/inputs/InputFecha";
import ModalDatosLista from "@/components/modales/ModalDatosLista";
import datosMostrar from "@/components/dashboard/participantes/function/datosMostrar";

import { cambiarSeleccionFormadores } from "@/utils/dashboard/cambiarSeleccionFormadores";
import { convertirFechaAISO } from "@/utils/Fechas";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { validarModulo } from "@/store/features/participantes/thunks/validarModulo";
import { verificarParticipanteCurso } from "@/store/features/participantes/thunks/verificarParticipanteCurso";
import { certificarParticipanteCurso } from "@/store/features/participantes/thunks/certificarParticipanteCurso";

export default function ModalParticipantes({
  datosActualizar,
  nombreFormacion,
  opcion,
  verificarCertificar,
}) {
  const dispatch = useDispatch();

  const { usuarios } = useSelector((state) => state.usuarios);

  const [idFormador, setIdFormador] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [fecha, setFecha] = useState("");
  const [validarFecha, setValidarFecha] = useState(false);

  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );

  const notify = (msj) => toast(msj);

  const handleValidarModulo = async () => {
    try {
      const validandoModulo = {
        modulo: datosActualizar.modulo,
        fecha: convertirFechaAISO(datosActualizar.fecha),
        id_asistencia: datosActualizar.id_asistencia,
        id_formador: idFormador,
        descripcion: descripcion,
      };

      await dispatch(
        validarModulo({
          validarModulo: validandoModulo,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerificarParticipante = async () => {
    try {
      const verificandoParticipante = {
        id_curso: verificarCertificar.cursoId,
        id_vocero: verificarCertificar.id,
      };

      await dispatch(
        verificarParticipanteCurso({
          verificarParticipante: verificandoParticipante,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCertificarParticipante = async () => {
    try {
      const certificandoParticipante = {
        id_curso: verificarCertificar.cursoId,
        id_vocero: verificarCertificar.id,
        descripcion: descripcion,
        fecha: convertirFechaAISO(fecha),
      };

      await dispatch(
        certificarParticipanteCurso({
          certificarParticipante: certificandoParticipante,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Validar este modulo?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Formación"} descripcion={nombreFormacion} />
          <ModalDatos titulo="Modulo" descripcion={datosActualizar.modulo} />
          <ModalDatos
            titulo="Fecha validación"
            descripcion={datosActualizar.fecha}
          />

          <Div
            className={`w-full flex flex-col gap-2 mt-5 border border-[#99a1af] rounded-md p-2 hover:border-[#082158]`}
          >
            <SelectOpcion
              idOpcion={idFormador}
              nombre={"Formador"}
              handleChange={(e) => {
                cambiarSeleccionFormadores(e, setIdFormador);
              }}
              opciones={usuarios}
              seleccione={"Seleccione"}
            />

            <InputDescripcion
              nombre={"Observaciones"}
              value={descripcion}
              setValue={setDescripcion}
              rows={6}
              max={500}
              autoComplete="off"
            />
          </Div>
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleValidarModulo}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
            dispatch(abrirModal("crear"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            modulo: datosActualizar.modulo,
            fecha: datosActualizar.fecha,
            id_asistencia: datosActualizar.id_asistencia,
            id_formador: idFormador,
            descripcion: descripcion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmar}
        onClose={() => {
          dispatch(cerrarModal("confirmar"));
        }}
        titulo={
          opcion && opcion === "verificar"
            ? "¿Verificar este vocero?"
            : "¿Certificar este vocero?"
        }
      >
        <ModalDatosContenedor>
          <DivScroll indice={1}>
            <AvisoAdvertencia
              mensaje={
                opcion && opcion === "verificar"
                  ? "Una vez verificados, afirma que la validacion de modulos es correcta para esta formación"
                  : "Una vez certificado, afirma que todos los procesos son correctos"
              }
            />
            <ModalDatosLista
              datos={datosMostrar}
              objeto={verificarCertificar}
            />

            {opcion && opcion === "certificar" && (
              <Div
                className={`w-full flex flex-col gap-2 mt-5 border border-[#99a1af] rounded-md p-2 hover:border-[#082158]`}
              >
                <InputDescripcion
                  nombre={"Observaciones"}
                  value={descripcion}
                  setValue={setDescripcion}
                  rows={6}
                  max={500}
                  autoComplete="off"
                />

                <InputFecha
                  value={fecha}
                  setValue={setFecha}
                  validarFecha={validarFecha}
                  setValidarFecha={setValidarFecha}
                />
              </Div>
            )}
          </DivScroll>
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={
            opcion && opcion === "verificar"
              ? handleVerificarParticipante
              : handleCertificarParticipante
          }
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
          }}
          indiceUno="aceptar"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            id_curso: verificarCertificar.cursoId,
            id_vocero: verificarCertificar.id,
            descripcion: opcion && opcion === "certificar" ? descripcion : true,
            fecha: opcion && opcion === "certificar" ? fecha : true,
          }}
        />
      </Modal>
    </>
  );
}
