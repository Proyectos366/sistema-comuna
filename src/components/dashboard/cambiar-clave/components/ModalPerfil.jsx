"use client";

import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import Modal from "@/components/modales/Modal";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalDatos from "@/components/modales/ModalDatos";

import { cerrarModal } from "@/store/features/modal/slicesModal";
import { actualizarClaveUsuarioLoggeado } from "@/store/features/usuarios/thunks/actualizarClaveLoggeado";

export default function ModalCambiarClave({
  claveVieja,
  claveUno,
  claveDos,
  setClaveVieja,
  setClaveUno,
  setClaveDos,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );

  const notify = (msj) => toast(msj);

  const handleActualizarClaveLoggeado = async () => {
    try {
      const updateClave = {
        claveVieja: claveVieja,
        claveUno: claveUno,
        claveDos: claveDos,
      };

      await dispatch(
        actualizarClaveUsuarioLoggeado({
          updateClave: updateClave,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();

      setClaveVieja("");
      setClaveUno("");
      setClaveDos("");
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
        titulo={"¿Cambiar clave?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Clave vieja"} descripcion={claveVieja} />
          <ModalDatos titulo={"Clave nueva"} descripcion={claveUno} />
          <ModalDatos titulo={"Clave nueva confirmar"} descripcion={claveDos} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleActualizarClaveLoggeado}
          cancelar={() => {
            dispatch(cerrarModal("confirmarCambios"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            claveVieja,
            claveUno,
            claveDos,
          }}
        />
      </Modal>
    </>
  );
}
