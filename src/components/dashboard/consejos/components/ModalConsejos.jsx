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

export default function ModalConsejos({
  acciones,
  datosConsejo,
  validaciones,
}) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);

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
    nombreCircuito,
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
    descripcion,
    opcionComunaCircuito,
  } = datosConsejo;

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    }
  }, [dispatch, usuarioActivo]);

  useEffect(() => {
    if (idComuna && mostrarConfirmarCambios === "comuna") {
      dispatch(fetchConsejosIdComuna(idComuna));
    }
  }, [dispatch, idComuna, mostrarConfirmarCambios]);

  useEffect(() => {
    if (idCircuito && mostrarConfirmarCambios === "circuito") {
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
          <ModalDatos
            titulo={opcionComunaCircuito === "comuna" ? "Comuna" : "Circuito"}
            descripcion={
              opcionComunaCircuito === "comuna" ? nombreComuna : nombreCircuito
            }
          />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />

          {norte && <ModalDatos titulo="Norte" descripcion={norte} />}

          {sur && <ModalDatos titulo="Sur" descripcion={sur} />}

          {este && <ModalDatos titulo="Este" descripcion={este} />}

          {oeste && <ModalDatos titulo="Oeste" descripcion={oeste} />}

          {rif && <ModalDatos titulo="Rif" descripcion={rif} />}

          {codigo && <ModalDatos titulo="Codigo" descripcion={codigo} />}

          {sector && <ModalDatos titulo="Sector" descripcion={sector} />}

          {direccion && (
            <ModalDatos titulo="Dirección" descripcion={direccion} />
          )}
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
            id: opcionComunaCircuito === "comuna" ? idComuna : idCircuito,
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
          <ModalDatos
            titulo={opcionComunaCircuito === "comuna" ? "Comuna" : "Circuito"}
            descripcion={
              opcionComunaCircuito === "comuna" ? nombreComuna : nombreCircuito
            }
          />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />

          {norte && <ModalDatos titulo="Norte" descripcion={norte} />}

          {sur && <ModalDatos titulo="Sur" descripcion={sur} />}

          {este && <ModalDatos titulo="Este" descripcion={este} />}

          {oeste && <ModalDatos titulo="Oeste" descripcion={oeste} />}

          {rif && <ModalDatos titulo="Rif" descripcion={rif} />}

          {codigo && <ModalDatos titulo="Codigo" descripcion={codigo} />}

          {sector && <ModalDatos titulo="Sector" descripcion={sector} />}

          {direccion && (
            <ModalDatos titulo="Dirección" descripcion={direccion} />
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
            id: opcionComunaCircuito === "comuna" ? idComuna : idCircuito,
            idConsejo,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este consejo comunal?"}
      >
        <ModalDatosContenedor>
          <FormEditarConsejo
            acciones={acciones}
            datosConsejo={datosConsejo}
            validaciones={validaciones}
            comunasCircuitos={
              opcionComunaCircuito === "comuna" ? comunas : circuitos
            }
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear consejo comunal?"}
      >
        <ModalDatosContenedor>
          <FormCrearConsejo
            acciones={acciones}
            datosConsejo={datosConsejo}
            validaciones={validaciones}
            estados={estados}
            municipios={municipios}
            parroquias={parroquias}
            comunasCircuitos={
              opcionComunaCircuito === "comunas" ? comunas : circuitos
            }
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
