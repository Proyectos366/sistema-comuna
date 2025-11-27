"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearDepartamento from "@/components/formularios/FormCrearDepartamento";
import FormEditarDepartamento from "@/components/formularios/FormEditarDepartamento";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearDepartamento } from "@/store/features/departamentos/thunks/crearDepartamento";
import { actualizarDepartamento } from "@/store/features/departamentos/thunks/actualizarDepartamento";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchTodasInstituciones } from "@/store/features/instituciones/thunks/todasInstituciones";

export default function ModalDepartamentos({
  acciones,
  datosDepartamento,
  validaciones,
}) {
  const dispatch = useDispatch();
  const { instituciones } = useSelector((state) => state.instituciones);

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const { idInstitucion, nombre, descripcion, nombreInstitucion } =
    datosDepartamento;

  useEffect(() => {
    dispatch(fetchTodasInstituciones());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearDepartamento = async () => {
    try {
      const nuevoDepartamento = {
        nombre: nombre,
        descripcion: descripcion,
        id_institucion: idInstitucion,
      };

      await dispatch(
        crearDepartamento({
          nuevoDepartamento: nuevoDepartamento,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarDepartamento = async () => {
    try {
      const updateDepartamento = {
        nombre: nombre,
        descripcion: descripcion,
        id_institucion: idInstitucion,
      };

      await dispatch(
        actualizarDepartamento({
          updateDepartamento: updateDepartamento,
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
        titulo={"¿Crear este departamento?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Institución" descripcion={nombreInstitucion} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearDepartamento}
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
            idInstitucion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar este departamento?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Institución" descripcion={nombreInstitucion} />
          <ModalDatos titulo="Departamento" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarDepartamento}
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
            idInstitucion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este departamento?"}
      >
        <ModalDatosContenedor>
          <FormEditarDepartamento
            acciones={acciones}
            datosDepartamento={datosDepartamento}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear departamento?"}
      >
        <ModalDatosContenedor>
          <FormCrearDepartamento
            acciones={acciones}
            datosDepartamento={datosDepartamento}
            validaciones={validaciones}
            instituciones={instituciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
