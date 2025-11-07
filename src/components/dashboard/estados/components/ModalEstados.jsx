"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearEstado from "@/components/formularios/FormCrearEstado";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearEstado } from "@/store/features/estados/thunks/crearEstado";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import FormEditarEstado from "@/components/formularios/FormEditarEstado";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";

export default function ModalEstados({ acciones, datosEstado, validaciones }) {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const notify = (msj) => toast(msj);

  const {
    setIdPais,
    setNombrePais,
    setNombre,
    setCapital,
    setCodigoPostal,
    setDescripcion,
  } = acciones;

  const { idPais, nombrePais, nombre, capital, descripcion, codigoPostal } =
    datosEstado;

  const {
    validarNombre,
    setValidarNombre,
    validarCapital,
    setValidarCapital,
    validarCodigoPostal,
    setValidarCodigoPostal,
  } = validaciones;

  const handleCrearEstado = async () => {
    try {
      const nuevoEstado = {
        nombre: nombre,
        capital: capital,
        descripcion: descripcion,
        codigoPostal: codigoPostal,
        id_pais: idPais,
      };
      await dispatch(
        crearEstado({
          nuevoEstado: nuevoEstado,
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
        titulo={"¿Crear este estado?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Pais" descripcion={nombrePais} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Capital" descripcion={capital} />
          <ModalDatos titulo="Codigo postal" descripcion={codigoPostal} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearEstado}
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
            codigoPostal,
            descripcion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este estado?"}
      >
        <ModalDatosContenedor>
          <FormEditarEstado
            idPais={idPais}
            setIdPais={setIdPais}
            nombre={nombre}
            setNombre={setNombre}
            capital={capital}
            setCapital={setCapital}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            codigoPostal={codigoPostal}
            setCodigoPostal={setCodigoPostal}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarCapital={validarCapital}
            setValidarCapital={setValidarCapital}
            validarCodigoPostal={validarCodigoPostal}
            setValidarCodigoPostal={setValidarCodigoPostal}
            setNombrePais={setNombrePais}
            paises={paises}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear estado?"}
      >
        <ModalDatosContenedor>
          <FormCrearEstado
            idPais={idPais}
            setIdPais={setIdPais}
            setNombrePais={setNombrePais}
            nombre={nombre}
            setNombre={setNombre}
            capital={capital}
            setCapital={setCapital}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            codigoPostal={codigoPostal}
            setCodigoPostal={setCodigoPostal}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarCapital={validarCapital}
            setValidarCapital={setValidarCapital}
            validarCodigoPostal={validarCodigoPostal}
            setValidarCodigoPostal={setValidarCodigoPostal}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
