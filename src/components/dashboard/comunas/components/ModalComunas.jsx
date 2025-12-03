"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearComuna from "@/components/formularios/FormCrearComuna";
import FormEditarComuna from "@/components/formularios/FormEditarComuna";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearComuna } from "@/store/features/comunas/thunks/crearComuna";
import { actualizarComuna } from "@/store/features/comunas/thunks/actualizarComuna";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchComunasIdParroquia } from "@/store/features/comunas/thunks/comunasIdParroquia";

export default function ModalComunas({ acciones, datosComuna, validaciones }) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
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
    idComuna,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombre,
    norte,
    sur,
    este,
    oeste,
    direccion,
    punto,
    rif,
    sector,
    codigo,
  } = datosComuna;

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    }
  }, [dispatch, usuarioActivo]);

  useEffect(() => {
    if (idParroquia && !mostrarConfirmarCambios) {
      dispatch(fetchComunasIdParroquia(idParroquia));
    }
  }, [dispatch, idParroquia, mostrarConfirmarCambios]);

  const notify = (msj) => toast(msj);

  const handleCrearComuna = async () => {
    try {
      const nuevaComuna = {
        nombre: nombre,
        norte: norte,
        sur: sur,
        este: este,
        oeste: oeste,
        direccion: direccion,
        punto: punto,
        rif: rif,
        codigo: codigo,
        id_parroquia: idParroquia,
      };

      await dispatch(
        crearComuna({
          nuevaComuna: nuevaComuna,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarComuna = async () => {
    try {
      const updateComuna = {
        nombre: nombre,
        norte: norte,
        sur: sur,
        este: este,
        oeste: oeste,
        direccion: direccion,
        punto: punto,
        rif: rif,
        codigo: codigo,
        id_parroquia: idParroquia,
        id_comuna: idComuna,
      };

      await dispatch(
        actualizarComuna({
          updateComuna: updateComuna,
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
        titulo={"¿Crear esta comuna?"}
      >
        <ModalDatosContenedor>
          {usuarioActivo.id_rol === 1 && (
            <>
              <ModalDatos titulo="Pais" descripcion={nombrePais} />
              <ModalDatos titulo="Estado" descripcion={nombreEstado} />
              <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
            </>
          )}
          <ModalDatos titulo="Parroquia" descripcion={nombreParroquia} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />

          {norte ||
            sur ||
            este ||
            oeste ||
            rif ||
            sector ||
            (direccion && (
              <>
                <ModalDatos titulo="Norte" descripcion={norte} />
                <ModalDatos titulo="Sur" descripcion={sur} />
                <ModalDatos titulo="Este" descripcion={este} />
                <ModalDatos titulo="Oeste" descripcion={oeste} />
                <ModalDatos titulo="Rif" descripcion={rif} />
                <ModalDatos titulo="Sector" descripcion={sector} />
                <ModalDatos titulo="Dirección" descripcion={direccion} />
              </>
            ))}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearComuna}
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
            idParroquia,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta comuna?"}
      >
        <ModalDatosContenedor>
          {usuarioActivo.id_rol === 1 && (
            <>
              <ModalDatos titulo="Pais" descripcion={nombrePais} />
              <ModalDatos titulo="Estado" descripcion={nombreEstado} />
              <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
            </>
          )}
          <ModalDatos titulo="Parroquia" descripcion={nombreParroquia} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />

          {norte && sur && este && oeste && rif && sector && direccion && (
            <>
              <ModalDatos titulo="Norte" descripcion={norte} />
              <ModalDatos titulo="Sur" descripcion={sur} />
              <ModalDatos titulo="Este" descripcion={este} />
              <ModalDatos titulo="Oeste" descripcion={oeste} />
              <ModalDatos titulo="Rif" descripcion={rif} />
              <ModalDatos titulo="Sector" descripcion={sector} />
              <ModalDatos titulo="Dirección" descripcion={direccion} />
            </>
          )}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarComuna}
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
            idParroquia,
            idComuna,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta comuna?"}
      >
        <ModalDatosContenedor>
          <FormEditarComuna
            acciones={acciones}
            datosComuna={datosComuna}
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
        titulo={"¿Crear comuna?"}
      >
        <ModalDatosContenedor>
          <FormCrearComuna
            acciones={acciones}
            datosComuna={datosComuna}
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
