"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearVocero from "@/components/formularios/FormCrearVocero";
import FormEditarVocero from "@/components/formularios/FormEditarVocero";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearVocero } from "@/store/features/voceros/thunks/crearVocero";
import { actualizarVocero } from "@/store/features/voceros/thunks/actualizarVocero";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";

import { fetchComunasIdParroquia } from "@/store/features/comunas/thunks/comunasIdParroquia";
import { fetchCircuitosIdParroquia } from "@/store/features/circuitos/thunks/circuitosIdParroquia";
import { fetchConsejosIdParroquia } from "@/store/features/consejos/thunks/consejosIdParroquia";

export default function ModalVoceros({ acciones, datosVocero, validaciones }) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos } = useSelector((state) => state.consejos);

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
    idVocero,

    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombreConsejo,

    cedula,
    nombre,
    nombreDos,
    apellido,
    apellidoDos,
    genero,
    edad,
    telefono,
    correo,
    laboral,
    opcion,
  } = datosVocero;

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    }
  }, [dispatch, usuarioActivo]);

  useEffect(() => {
    if (idComuna && opcion === "comuna") {
      dispatch(fetchComunasIdParroquia(idComuna));
    }
  }, [dispatch, idComuna, opcion]);

  useEffect(() => {
    if (idCircuito && opcion === "circuito") {
      dispatch(fetchCircuitosIdParroquia(idCircuito));
    }
  }, [dispatch, idCircuito, opcion]);

  useEffect(() => {
    if (idConsejo && opcion === "consejo") {
      dispatch(fetchConsejosIdParroquia(idConsejo));
    }
  }, [dispatch, idConsejo, opcion]);

  const notify = (msj) => toast(msj);

  const handleCrearVocero = async () => {
    try {
      const nuevoVocero = {
        cedula: cedula,
        nombre: nombre,
        nombreDos: nombreDos,
        apellido: apellido,
        apellidoDos: apellidoDos,
        genero: genero,
        edad: edad,
        telefono: telefono,
        correo: correo,
        laboral: laboral,
        id_parroquia: idParroquia,
        id_comuna: idComuna,
        id_circuito: idCircuito,
        id_consejo: idConsejo,
      };

      await dispatch(
        crearVocero({
          nuevoVocero: nuevoVocero,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarVocero = async () => {
    try {
      const updateVocero = {
        nombre: nombre,
        id_parroquia: idParroquia,
        id_comuna: idComuna,
        id_circuito: idCircuito,
        id_consejo: idConsejo,
      };

      await dispatch(
        actualizarVocero({
          updateVocero: updateVocero,
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
        titulo={"¿Crear este Vocero?"}
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
            titulo={
              opcion === "comuna"
                ? "Comuna"
                : opcion === "circuito"
                ? "Circuito comunal"
                : "Consejo comunal"
            }
            descripcion={
              opcion === "comuna"
                ? nombreComuna
                : opcion === "circuito"
                ? nombreCircuito
                : nombreConsejo
            }
          />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearVocero}
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
            id:
              opcion === "comuna"
                ? idComuna
                : opcion === "circuito"
                ? idCircuito
                : idConsejo,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar este vocero?"}
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
            titulo={
              opcion === "comuna"
                ? "Comuna"
                : opcion === "circuito"
                ? "Circuito comunal"
                : "Consejo comunal"
            }
            descripcion={
              opcion === "comuna"
                ? nombreComuna
                : opcion === "circuito"
                ? nombreCircuito
                : nombreConsejo
            }
          />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarVocero}
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
            id:
              opcion === "comuna"
                ? idComuna
                : opcion === "circuito"
                ? idCircuito
                : idConsejo,
            idVocero,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este Vocero?"}
      >
        <ModalDatosContenedor>
          <FormEditarVocero
            acciones={acciones}
            datosVocero={datosVocero}
            validaciones={validaciones}
            comunasCircuitosConsejos={
              opcion === "comuna"
                ? comunas
                : opcion === "circuito"
                ? circuitos
                : consejos
            }
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear vocero?"}
      >
        <ModalDatosContenedor>
          <FormCrearVocero
            acciones={acciones}
            datosVocero={datosVocero}
            validaciones={validaciones}
            estados={estados}
            municipios={municipios}
            parroquias={parroquias}
            comunasCircuitosConsejos={
              opcion === "comuna"
                ? comunas
                : opcion === "circuito"
                ? circuitos
                : consejos
            }
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
