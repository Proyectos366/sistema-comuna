"use client";

import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearCarpeta from "@/components/formularios/FormCrearCarpeta";
import FormEditarCarpeta from "@/components/formularios/FormEditarCarpeta";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import AvisoAdvertencia from "@/components/dashboard/participantes/components/AvisoAdvertencia";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearCarpeta } from "@/store/features/carpetas/thunks/crearCarpeta";
import { actualizarCarpeta } from "@/store/features/carpetas/thunks/actualizarCarpeta";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { eliminarRestaurarCarpeta } from "@/store/features/carpetas/thunks/eliminarRestaurarCarpeta";

export default function ModalCarpetas({
  acciones,
  datosCarpeta,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );

  const mostrarEliminarRestaurar = useSelector(
    (state) => state.modal.modales.confirmarEliminarRestaurar,
  );

  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    idCarpeta,
    idEstante,
    nombre,
    descripcion,
    alias,
    nivel,
    seccion,
    borradoRestaurado,
    nombreEstante,
  } = datosCarpeta;

  const notify = (msj) => toast(msj);

  const handleCrearCarpeta = async () => {
    try {
      const nuevaCarpeta = {
        nombre: nombre,
        descripcion: descripcion,
        alias: alias,
        nivel: nivel,
        seccion: seccion,
        idEstante: idEstante,
      };

      await dispatch(
        crearCarpeta({
          nuevaCarpeta: nuevaCarpeta,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      //notify(error);
      console.log(error);
    }
  };

  const handleEditarCarpeta = async () => {
    try {
      const updateCarpeta = {
        nombre: nombre,
        descripcion: descripcion,
        nivel: nivel,
        seccion: seccion,
        id_carpeta: idCarpeta,
      };

      await dispatch(
        actualizarCarpeta({
          updateCarpeta: updateCarpeta,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBorrarRestaurarCarpeta = async () => {
    try {
      const deleteCarpeta = {
        id_carpeta: idCarpeta,
        estado: borradoRestaurado,
      };

      await dispatch(
        eliminarRestaurarCarpeta({
          deleteCarpeta: deleteCarpeta,
          notify: notify,
        }),
      ).unwrap();

      dispatch(cerrarModal("confirmarEliminarRestaurar"));
    } catch (error) {
      notify(error);
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
        titulo={"¿Crear esta carpeta?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Estante" descripcion={nombreEstante} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Alias" descripcion={alias} />
          <ModalDatos
            titulo="Nivel"
            descripcion={Number(nivel) === 0 ? "0 (cabecera)" : Number(nivel)}
          />
          <ModalDatos titulo="Sección" descripcion={seccion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearCarpeta}
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
            nivel,
            seccion,
            nombreEstante,
            idEstante,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEliminarRestaurar}
        onClose={() => {
          dispatch(cerrarModal("confirmarEliminarRestaurar"));
        }}
        titulo={
          borradoRestaurado
            ? "¿Restaurar esta carpeta?"
            : "¿Eliminar esta carpeta?"
        }
      >
        <ModalDatosContenedor>
          <AvisoAdvertencia
            mensaje={`Una vez haga click en aceptar, se ${borradoRestaurado ? "restaurará" : "eliminará"}
                      la carpeta y toda su información relacionada. Incluyendo archivos`}
          />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleBorrarRestaurarCarpeta}
          cancelar={() => {
            dispatch(cerrarModal("confirmarEliminarRestaurar"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            idCarpeta,
            borradoRestaurado,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta carpeta?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre estante" descripcion={nombreEstante} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos
            titulo="Nivel"
            descripcion={Number(nivel) === 0 ? "0 (cabecera)" : Number(nivel)}
          />
          <ModalDatos titulo="Sección" descripcion={seccion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarCarpeta}
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
            nivel,
            seccion,
            idCarpeta,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta carpeta?"}
      >
        <ModalDatosContenedor>
          <FormEditarCarpeta
            acciones={acciones}
            datosCarpeta={datosCarpeta}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear carpeta?"}
      >
        <ModalDatosContenedor>
          <FormCrearCarpeta
            acciones={acciones}
            datosCarpeta={datosCarpeta}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
