"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearInstitucion from "@/components/formularios/FormCrearInstitucion";
import FormEditarInstitucion from "@/components/formularios/FormEditarInstitucion";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearInstitucion } from "@/store/features/instituciones/thunks/crearInstitucion";
import { actualizarInstitucion } from "@/store/features/instituciones/thunks/actualizarInstitucion";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";

export default function ModalInstituciones({
  acciones,
  datosInstitucion,
  validaciones,
}) {
  const dispatch = useDispatch();
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idInstitucion,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombre,
    descripcion,
    rif,
    sector,
    direccion,
  } = datosInstitucion;

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearInstitucion = async () => {
    try {
      const nuevaInstitucion = {
        nombre: nombre,
        descripcion: descripcion,
        rif: rif,
        sector: sector,
        direccion: direccion,
        id_pais: idPais,
        id_estado: idEstado,
        id_municipio: idMunicipio,
        id_parroquia: idParroquia,
      };

      await dispatch(
        crearInstitucion({
          nuevaInstitucion: nuevaInstitucion,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarInstitucion = async () => {
    try {
      const updateInstitucion = {
        nombre: nombre,
        descripcion: descripcion,
        rif: rif,
        sector: sector,
        direccion: direccion,
        id_pais: idPais,
        id_estado: idEstado,
        id_municipio: idMunicipio,
        id_parroquia: idParroquia,
        id_institucion: idInstitucion,
      };

      await dispatch(
        actualizarInstitucion({
          updateInstitucion: updateInstitucion,
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
        titulo={"¿Crear esta institución?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Pais" descripcion={nombrePais} />
          <ModalDatos titulo="Estado" descripcion={nombreEstado} />
          <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
          <ModalDatos titulo="Parroquia" descripcion={nombreParroquia} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Rif" descripcion={rif} />
          <ModalDatos titulo="Sector" descripcion={sector} />
          <ModalDatos titulo="Dirección" descripcion={direccion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearInstitucion}
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
            rif,
            sector,
            direccion,
            idPais,
            idEstado,
            idMunicipio,
            idParroquia,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta institución?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Pais" descripcion={nombrePais} />
          <ModalDatos titulo="Estado" descripcion={nombreEstado} />
          <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
          <ModalDatos titulo="Parroquia" descripcion={nombreParroquia} />
          <ModalDatos titulo="Institución" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Rif" descripcion={rif} />
          <ModalDatos titulo="Sector" descripcion={sector} />
          <ModalDatos titulo="Dirección" descripcion={direccion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarInstitucion}
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
            rif,
            sector,
            direccion,
            idPais,
            idEstado,
            idMunicipio,
            idParroquia,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta institucón?"}
      >
        <ModalDatosContenedor>
          <FormEditarInstitucion
            acciones={acciones}
            datosInstitucion={datosInstitucion}
            validaciones={validaciones}
            parroquias={parroquias}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear institución?"}
      >
        <ModalDatosContenedor>
          <FormCrearInstitucion
            acciones={acciones}
            datosInstitucion={datosInstitucion}
            validaciones={validaciones}
            estados={estados}
            municipios={municipios}
            parroquias={parroquias}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
