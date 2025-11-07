"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearMunicipio from "@/components/formularios/FormCrearMunicipio";
import FormEditarMunicipio from "@/components/formularios/FormEditarMunicipio";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearMunicipio } from "@/store/features/municipios/thunks/crearMunicipio";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";

export default function ModalMunicipios({
  acciones,
  datosMunicipio,
  validaciones,
}) {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    setIdPais,
    setIdEstado,
    setNombrePais,
    setNombreEstado,
    setNombre,
    setDescripcion,
  } = acciones;

  const { idPais, idEstado, nombrePais, nombreEstado, nombre, descripcion } =
    datosMunicipio;

  const { validarNombre, setValidarNombre } = validaciones;

  useEffect(() => {
    dispatch(fetchPaises());
    if (idPais) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais]);

  const notify = (msj) => toast(msj);

  const handleCrearMunicipio = async () => {
    try {
      const nuevoMunicipio = {
        nombre: nombre,
        descripcion: descripcion,
        id_pais: idPais,
        id_estado: idEstado,
      };
      await dispatch(
        crearMunicipio({
          nuevoMunicipio: nuevoMunicipio,
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
        titulo={"¿Crear este municipio?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Pais" descripcion={nombrePais} />
          <ModalDatos titulo="Estado" descripcion={nombreEstado} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearMunicipio}
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
            idPais,
            idEstado,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este municipio?"}
      >
        <ModalDatosContenedor>
          <FormEditarMunicipio
            idPais={idPais}
            setIdPais={setIdPais}
            idEstado={idEstado}
            setIdEstado={setIdEstado}
            nombre={nombre}
            setNombre={setNombre}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            setNombrePais={setNombrePais}
            setNombreEstado={setNombreEstado}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear municipio?"}
      >
        <ModalDatosContenedor>
          <FormCrearMunicipio
            idPais={idPais}
            setIdPais={setIdPais}
            idEstado={idEstado}
            setIdEstado={setIdEstado}
            nombre={nombre}
            setNombre={setNombre}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            setNombrePais={setNombrePais}
            setNombreEstado={setNombreEstado}
            paises={paises}
            estados={estados}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
