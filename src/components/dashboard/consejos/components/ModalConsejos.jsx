"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearConsejo from "@/components/formularios/FormCrearConsejo";
import FormEditarConsejo from "@/components/formularios/FormEditarConsejo";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearConsejo } from "@/store/features/consejos/thunks/crearConsejo";
import { actualizarConsejo } from "@/store/features/consejos/thunks/actualizarConsejo";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchConsejosIdComuna } from "@/store/features/consejos/thunks/consejosIdComuna";
import { fetchConsejosIdCircuito } from "@/store/features/consejos/thunks/consejosIdCircuito";

export default function ModalConsejos({ acciones, datosConsejo, validaciones, opcion }) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas } = useSelector((state) => state.comunas);

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
    idCircuito,
    idConsejo,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
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
  } = datosConsejo;

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    }
  }, [dispatch, usuarioActivo]);

  useEffect(() => {
    if (idComuna && !mostrarConfirmarCambios) {
      dispatch(fetchConsejosIdComuna(idComuna));
    }
  }, [dispatch, idComuna, mostrarConfirmarCambios]);

  useEffect(() => {
    if (idCircuito && !mostrarConfirmarCambios) {
      dispatch(fetchConsejosIdCircuito(idCircuito));
    }
  }, [dispatch, idCircuito, mostrarConfirmarCambios]);

  const notify = (msj) => toast(msj);

  const handleCrearConsejo = async () => {
    try {
      const nuevoConsejo = {
        nombre: nombre,
        norte: norte,
        sur: sur,
        este: este,
        oeste: oeste,
        direccion: direccion,
        punto: punto,
        rif: rif,
        codigo: codigo,
        id_comuna: idComuna,
        id_circuito: idCircuito,
        id_parroquia: idParroquia,
      };

      await dispatch(
        crearConsejo({
          nuevoConsejo: nuevoConsejo,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarConsejo = async () => {
    try {
      const updateConsejo = {
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
        id_consejo: idConsejo,
      };

      await dispatch(
        actualizarConsejo({
          updateConsejo: updateConsejo,
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
        titulo={"¿Crear este consejo comunal?"}
      >
        <ModalDatosContenedor>
          {usuarioActivo.id_rol === 1 && (
            <>
              <ModalDatos titulo="Pais" descripcion={nombrePais} />
              <ModalDatos titulo="Estado" descripcion={nombreEstado} />
              <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
              <ModalDatos titulo="Parroquia" descripcion={nombreParroquia} />
            </>
          )}
          <ModalDatos titulo="Comuna" descripcion={nombreComuna} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />

          {norte ||
            sur ||
            este ||
            oeste ||
            rif ||
            codigo ||
            sector ||
            (direccion && (
              <>
                <ModalDatos titulo="Norte" descripcion={norte} />
                <ModalDatos titulo="Sur" descripcion={sur} />
                <ModalDatos titulo="Este" descripcion={este} />
                <ModalDatos titulo="Oeste" descripcion={oeste} />
                <ModalDatos titulo="Rif" descripcion={rif} />
                <ModalDatos titulo="Codigo" descripcion={codigo} />
                <ModalDatos titulo="Sector" descripcion={sector} />
                <ModalDatos titulo="Dirección" descripcion={direccion} />
              </>
            ))}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearConsejo}
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
            idComuna
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar este consejo comunal?"}
      >
        <ModalDatosContenedor>
          {usuarioActivo.id_rol === 1 && (
            <>
              <ModalDatos titulo="Pais" descripcion={nombrePais} />
              <ModalDatos titulo="Estado" descripcion={nombreEstado} />
              <ModalDatos titulo="Municipio" descripcion={nombreMunicipio} />
              <ModalDatos titulo="Parroquia" descripcion={nombreParroquia} />
            </>
          )}
          <ModalDatos titulo="Comuna" descripcion={nombreComuna} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />

          {norte && sur && este && oeste && rif && codigo && sector && direccion && (
            <>
              <ModalDatos titulo="Norte" descripcion={norte} />
              <ModalDatos titulo="Sur" descripcion={sur} />
              <ModalDatos titulo="Este" descripcion={este} />
              <ModalDatos titulo="Oeste" descripcion={oeste} />
              <ModalDatos titulo="Rif" descripcion={rif} />
              <ModalDatos titulo="Código" descripcion={codigo} />              
              <ModalDatos titulo="Sector" descripcion={sector} />
              <ModalDatos titulo="Dirección" descripcion={direccion} />
            </>
          )}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarConsejo}
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
            idConsejo,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este consejo?"}
      >
        <ModalDatosContenedor>
          <FormEditarConsejo
            acciones={acciones}
            datosConsejo={datosConsejo}
            validaciones={validaciones}
            comunas={comunas}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear consejo?"}
      >
        <ModalDatosContenedor>
          <FormCrearConsejo
            acciones={acciones}
            datosConsejo={datosConsejo}
            validaciones={validaciones}
            estados={estados}
            municipios={municipios}
            parroquias={parroquias}
            comunas={comunas}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
