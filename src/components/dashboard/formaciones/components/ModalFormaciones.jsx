"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearFormacion from "@/components/formularios/FormCrearFormacion";
import FormEditarFormacion from "@/components/formularios/FormEditarFormacion";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearFormacion } from "@/store/features/formaciones/thunks/crearFormacion";
import { actualizarFormacion } from "@/store/features/formaciones/thunks/actualizarFormacion";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchFormaciones } from "@/store/features/formaciones/thunks/todasFormaciones";

export default function ModalFormaciones({
  acciones,
  datosFormacion,
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
    idFormacion,
    nombre,
    modulos,
    descripcion,
  } = datosFormacion;

  useEffect(() => {
    dispatch(fetchFormaciones());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearFormacion = async () => {
    try {
      const nuevaFormacion = {
        nombre: nombre,
        cantidadModulos: modulos,
        descripcion: descripcion,
      };

      await dispatch(
        crearFormacion({
          nuevaFormacion: nuevaFormacion,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarFormacion = async () => {
    try {
      const updateFormacion = {
        nombre: nombre,
        modulos: modulos,
        descripcion: descripcion,
        id_formacion: idFormacion,
      };

      await dispatch(
        actualizarFormacion({
          updateFormacion: updateFormacion,
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
        titulo={"¿Crear esta formación?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo={'Cant. Modulos'} descripcion={modulos} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearFormacion}
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
            modulos,
            descripcion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta formación?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo={'Cant. Modulos'} descripcion={modulos} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarFormacion}
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
            modulos,
            descripcion,
            idFormacion
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta formación?"}
      >
        <ModalDatosContenedor>
          <FormEditarFormacion
            acciones={acciones}
            datosFormacion={datosFormacion}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear formación?"}
      >
        <ModalDatosContenedor>
          <FormCrearFormacion
            acciones={acciones}
            datosFormacion={datosFormacion}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
