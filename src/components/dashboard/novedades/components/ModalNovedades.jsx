"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearNovedad from "@/components/formularios/FormCrearNovedad";
import FormEditarNovedad from "@/components/formularios/FormEditarNovedad";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearNovedad } from "@/store/features/novedades/thunks/crearNovedad";
import { actualizarNovedad } from "@/store/features/novedades/thunks/actualizarNovedad";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchNovedades } from "@/store/features/novedades/thunks/todasNovedades";


export default function ModalNovedades({
  acciones,
  datosNovedad,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    idNovedad,
    nombre,
    descripcion,
  } = datosNovedad;

  useEffect(() => {
    dispatch(fetchNovedades());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearNovedad = async () => {
    try {
      const nuevaNovedad = {
        nombre: nombre,
        descripcion: descripcion,
      };

      await dispatch(
        crearNovedad({
          nuevaNovedad: nuevaNovedad,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarNovedad = async () => {
    try {
      const updateNovedad = {
        nombre: nombre,
        descripcion: descripcion,
        id_novedad: idNovedad,
      };

      await dispatch(
        actualizarNovedad({
          updateNovedad: updateNovedad,
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
        titulo={"¿Crear esta novedad?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearNovedad}
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
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta novedad?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarNovedad}
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
            idNovedad
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta novedad?"}
      >
        <ModalDatosContenedor>
          <FormEditarNovedad
            acciones={acciones}
            datosNovedad={datosNovedad}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear novedad?"}
      >
        <ModalDatosContenedor>
          <FormCrearNovedad
            acciones={acciones}
            datosNovedad={datosNovedad}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
