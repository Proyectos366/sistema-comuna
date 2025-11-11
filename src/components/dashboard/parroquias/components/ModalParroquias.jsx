"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearParroquia from "@/components/formularios/FormCrearParroquia";
import FormEditarParroquia from "@/components/formularios/FormEditarParroquia";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearParroquia } from "@/store/features/parroquias/thunks/crearParroquia";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";

export default function ModalParroquias({
  acciones,
  datosParroquia,
  validaciones,
}) {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombre,
    setDescripcion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombre,
    descripcion,
  } = datosParroquia;

  const { validarNombre, setValidarNombre } = validaciones;

  useEffect(() => {
    dispatch(fetchPaises());
    if (idPais) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais]);

  const notify = (msj) => toast(msj);

  const handleCrearParroquia = async () => {
    try {
      const nuevaParroquia = {
        nombre: nombre,
        descripcion: descripcion,
        id_pais: idPais,
        id_estado: idEstado,
        id_municipio: idMunicipio,
      };
      await dispatch(
        crearParroquia({
          nuevaParroquia: nuevaParroquia,
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
        titulo={"¿Crear esta parroquia?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Pais" descripcion={nombrePais} />
          <ModalDatos titulo="Estado" descripcion={nombreEstado} />
          <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearParroquia}
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
            idMunicipio,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta parroquia?"}
      >
        <ModalDatosContenedor>
          <FormEditarParroquia
            idPais={idPais}
            setIdPais={setIdPais}
            idEstado={idEstado}
            setIdEstado={setIdEstado}
            idMunicipio={idMunicipio}
            setIdMunicipio={setIdMunicipio}
            nombre={nombre}
            setNombre={setNombre}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            setNombrePais={setNombrePais}
            setNombreEstado={setNombreEstado}
            setNombreMunicipio={setNombreMunicipio}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear parroquia?"}
      >
        <ModalDatosContenedor>
          <FormCrearParroquia
            idPais={idPais}
            setIdPais={setIdPais}
            idEstado={idEstado}
            setIdEstado={setIdEstado}
            idMunicipio={idMunicipio}
            setIdMunicipio={setIdMunicipio}
            nombre={nombre}
            setNombre={setNombre}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            setNombrePais={setNombrePais}
            setNombreEstado={setNombreEstado}
            setNombreMunicipio={setNombreMunicipio}
            paises={paises}
            estados={estados}
            municipios={municipios}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
