"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearCircuito from "@/components/formularios/FormCrearCircuito";
import FormEditarCircuito from "@/components/formularios/FormEditarCircuito";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearCircuito } from "@/store/features/circuitos/thunks/crearCircuito";
import { actualizarCircuito } from "@/store/features/circuitos/thunks/actualizarCircuito";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchCircuitosIdParroquia } from "@/store/features/circuitos/thunks/circuitosIdParroquia";

export default function ModalCircuitos({
  acciones,
  datosCircuito,
  validaciones,
}) {
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
    idCircuito,
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
    sector,
    codigo,
  } = datosCircuito;

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    }
  }, [dispatch, usuarioActivo]);

  useEffect(() => {
    if (idParroquia && !mostrarConfirmarCambios) {
      dispatch(fetchCircuitosIdParroquia(idParroquia));
    }
  }, [dispatch, idParroquia, mostrarConfirmarCambios]);

  const notify = (msj) => toast(msj);

  const handleCrearCircuito = async () => {
    try {
      const nuevoCircuito = {
        nombre: nombre,
        norte: norte,
        sur: sur,
        este: este,
        oeste: oeste,
        direccion: direccion,
        punto: punto,
        codigo: codigo,
        id_parroquia: idParroquia,
      };

      await dispatch(
        crearCircuito({
          nuevoCircuito: nuevoCircuito,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarCircuito = async () => {
    try {
      const updateCircuito = {
        nombre: nombre,
        norte: norte,
        sur: sur,
        este: este,
        oeste: oeste,
        direccion: direccion,
        punto: punto,
        codigo: codigo,
        id_parroquia: idParroquia,
        id_circuito: idCircuito,
      };

      await dispatch(
        actualizarCircuito({
          updateCircuito: updateCircuito,
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
        titulo={"¿Crear este circuito?"}
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
            sector ||
            (direccion && (
              <>
                <ModalDatos titulo="Norte" descripcion={norte} />
                <ModalDatos titulo="Sur" descripcion={sur} />
                <ModalDatos titulo="Este" descripcion={este} />
                <ModalDatos titulo="Oeste" descripcion={oeste} />
                <ModalDatos titulo="Sector" descripcion={sector} />
                <ModalDatos titulo="Dirección" descripcion={direccion} />
              </>
            ))}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearCircuito}
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
        titulo={"¿Actualizar este circuito?"}
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

          {norte && sur && este && oeste && sector && direccion && (
            <>
              <ModalDatos titulo="Norte" descripcion={norte} />
              <ModalDatos titulo="Sur" descripcion={sur} />
              <ModalDatos titulo="Este" descripcion={este} />
              <ModalDatos titulo="Oeste" descripcion={oeste} />
              <ModalDatos titulo="Sector" descripcion={sector} />
              <ModalDatos titulo="Dirección" descripcion={direccion} />
            </>
          )}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarCircuito}
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
            idCircuito,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este circuito?"}
      >
        <ModalDatosContenedor>
          <FormEditarCircuito
            acciones={acciones}
            datosCircuito={datosCircuito}
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
        titulo={"¿Crear circuito?"}
      >
        <ModalDatosContenedor>
          <FormCrearCircuito
            acciones={acciones}
            datosCircuito={datosCircuito}
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
