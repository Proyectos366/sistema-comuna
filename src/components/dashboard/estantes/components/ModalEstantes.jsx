"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearCargo from "@/components/formularios/FormCrearCargo";
import FormEditarCargo from "@/components/formularios/FormEditarCargo";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearCargo } from "@/store/features/cargos/thunks/crearCargo";
import { actualizarCargo } from "@/store/features/cargos/thunks/actualizarCargo";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchCargos } from "@/store/features/cargos/thunks/todosCargos";

export default function ModalCargos({
  acciones,
  datosCargo,
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
    idCargo,
    nombre,
    descripcion,
  } = datosCargo;

  useEffect(() => {
    dispatch(fetchCargos());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearCargo = async () => {
    try {
      const nuevoCargo = {
        nombre: nombre,
        descripcion: descripcion,
      };

      await dispatch(
        crearCargo({
          nuevoCargo: nuevoCargo,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarCargo = async () => {
    try {
      const updateCargo = {
        nombre: nombre,
        descripcion: descripcion,
        id_cargo: idCargo,
      };

      await dispatch(
        actualizarCargo({
          updateCargo: updateCargo,
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
        titulo={"¿Crear este cargo?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearCargo}
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
        titulo={"¿Actualizar este cargo?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarCargo}
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
            idCargo
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este cargo?"}
      >
        <ModalDatosContenedor>
          <FormEditarCargo
            acciones={acciones}
            datosCargo={datosCargo}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear cargo?"}
      >
        <ModalDatosContenedor>
          <FormCrearCargo
            acciones={acciones}
            datosCargo={datosCargo}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
