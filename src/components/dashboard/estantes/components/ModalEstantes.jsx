"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearEstante from "@/components/formularios/FormCrearEstante";
import FormEditarEstante from "@/components/formularios/FormEditarEstante";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearEstante } from "@/store/features/estantes/thunks/crearEstante";
import { actualizarEstante } from "@/store/features/estantes/thunks/actualizarEstante";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function ModalEstantes({
  acciones,
  datosEstante,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    idEstante,
    nombre,
    descripcion,
    alias,
    niveles,
    secciones,
    cabecera,
  } = datosEstante;

  const notify = (msj) => toast(msj);

  const handleCrearEstante = async () => {
    try {
      const nuevoEstante = {
        nombre: nombre,
        descripcion: descripcion,
        alias: alias,
        niveles: niveles,
        secciones: secciones,
        cabecera: cabecera,
      };

      await dispatch(
        crearEstante({
          nuevoEstante: nuevoEstante,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarEstante = async () => {
    try {
      const updateEstante = {
        nombre: nombre,
        descripcion: descripcion,
        niveles: niveles,
        secciones: secciones,
        cabecera: cabecera,
        id_cargo: idEstante,
      };

      await dispatch(
        actualizarEstante({
          updateEstante: updateEstante,
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
        isVisible={mostrarConfirmar}
        onClose={() => {
          dispatch(cerrarModal("confirmar"));
        }}
        titulo={"¿Crear este estante?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Alias" descripcion={alias} />
          <ModalDatos titulo="Niveles" descripcion={Number(niveles)} />
          <ModalDatos titulo="Secciones" descripcion={secciones} />
          <ModalDatos titulo="Cabecera" descripcion={cabecera ? "si" : "no"} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearEstante}
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
            descripcion,
            alias,
            niveles,
            secciones,
            cabecera,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar este estante?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Niveles" descripcion={niveles} />
          <ModalDatos titulo="Secciones" descripcion={secciones} />
          <ModalDatos titulo="Cabecera" descripcion={cabecera ? "si" : "no"} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarEstante}
          cancelar={() => {
            dispatch(cerrarModal("confirmarCambios"));
            dispatch(abrirModal("editar"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Guardar cambios"
          nombreDos="Cancelar"
          campos={{
            nombre,
            descripcion,
            alias,
            niveles,
            secciones,
            cabecera,
            idEstante,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este estante?"}
      >
        <ModalDatosContenedor>
          <FormEditarEstante
            acciones={acciones}
            datosEstante={datosEstante}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear estante?"}
      >
        <ModalDatosContenedor>
          <FormCrearEstante
            acciones={acciones}
            datosEstante={datosEstante}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
