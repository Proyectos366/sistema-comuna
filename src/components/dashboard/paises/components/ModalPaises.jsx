"use client";

import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearPais from "@/components/formularios/FormCrearPais";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearPais } from "@/store/features/paises/thunks/crearPais";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import FormEditarPais from "@/components/formularios/FormEditarPais";

export default function ModalPaises({ acciones, datosPais, validaciones }) {
  const dispatch = useDispatch();
  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const notify = (msj) => toast(msj);

  const { setNombre, setCapital, setDescripcion, setSerial } = acciones;

  const { nombre, capital, descripcion, serial } = datosPais;

  const {
    validarNombre,
    setValidarNombre,
    validarCapital,
    setValidarCapital,
    validarSerial,
    setValidarSerial,
  } = validaciones;

  const handleCrearPais = async () => {
    try {
      const nuevoPais = {
        nombre: nombre,
        capital: capital,
        descripcion: descripcion,
        serial: serial,
      };
      await dispatch(
        crearPais({
          nuevoPais: nuevoPais,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal
        isVisible={mostrarConfirmar}
        onClose={() => {
          dispatch(cerrarModal("confirmar"));
        }}
        titulo={"¿Crear este pais?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Capital" descripcion={capital} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Serial" descripcion={serial} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearPais}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
            dispatch(abrirModal("crear"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            nombre,
            capital,
            descripcion,
            serial,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este pais?"}
      >
        <ModalDatosContenedor>
          <FormEditarPais
            nombre={nombre}
            setNombre={setNombre}
            capital={capital}
            setCapital={setCapital}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarCapital={validarCapital}
            setValidarCapital={setValidarCapital}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear pais?"}
      >
        <ModalDatosContenedor>
          <FormCrearPais
            nombre={nombre}
            setNombre={setNombre}
            capital={capital}
            setCapital={setCapital}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            serial={serial}
            setSerial={setSerial}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarCapital={validarCapital}
            setValidarCapital={setValidarCapital}
            validarSerial={validarSerial}
            setValidarSerial={setValidarSerial}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
