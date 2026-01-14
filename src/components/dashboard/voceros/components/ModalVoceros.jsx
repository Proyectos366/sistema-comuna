"use client";

import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearVocero from "@/components/formularios/FormCrearVocero";
import FormEditarVocero from "@/components/formularios/FormEditarVocero";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";
import ConsultarCedula from "@/components/sistema/opciones_inicio/ConsultarCedula";
import ModalConsultar from "@/components/modales/ModalConsultar";
import ConsultarVocerosComuna from "@/components/sistema/opciones_inicio/ConsultarComunas";
import ConsultarVocerosCircuito from "@/components/sistema/opciones_inicio/ConsultarCircuitos";
import ConsultarVocerosConsejo from "@/components/sistema/opciones_inicio/ConsultarConsejosComunales";
import ConsultarVocerosParroquia from "@/components/sistema/opciones_inicio/ConsultarParroquias";

import { crearVocero } from "@/store/features/voceros/thunks/crearVocero";
import { actualizarVocero } from "@/store/features/voceros/thunks/actualizarVocero";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchVoceroCedula } from "@/store/features/voceros/thunks/voceroCedula";

export default function ModalVoceros({
  acciones,
  datosVocero,
  validaciones,
  seleccionado,
}) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
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

  const mostrarConsultarCedula = useSelector(
    (state) => state.modal.modales.consultar
  );

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
    idCircuito,
    idConsejo,
    idCargo,
    idFormacion,
    idVocero,

    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombreConsejo,
    nombreCargo,
    nombreFormacion,

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

  const notify = (msj) => toast(msj);

  const handleCrearVocero = async () => {
    try {
      const nuevoVocero = {
        cedula: cedula,
        nombre: nombre,
        nombre_dos: nombreDos,
        apellido: apellido,
        apellido_dos: apellidoDos,
        genero: genero === "1" ? true : false,
        edad: edad,
        telefono: telefono,
        correo: correo,
        direccion: "",
        laboral: laboral,
        cargos: Array.isArray(idCargo)
          ? idCargo.map((id) => ({ id }))
          : [{ id: idCargo }],
        formaciones: Array.isArray(idFormacion)
          ? idFormacion.map((id) => ({ id }))
          : [{ id: idFormacion }],
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

  const consultarVoceroCedula = () => {
    dispatch(fetchVoceroCedula(cedula))
      .unwrap()
      .then((respuesta) => {
        if (respuesta) {
          dispatch(cerrarModal("consultar"));
        }
      })
      .catch((error) => {
        console.error("Error consultando vocero:", error);
        notify(error);
      });
  };

  const titulos = {
    1: "Buscar vocero",
    2: "Consultar por parroquia",
    3: "Consultar por comuna",
    4: "Consultar por circuito",
    5: "Consultar por consejo",
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
          <ModalDatos titulo="Cedúla" descripcion={cedula} />
          <ModalDatos titulo="Edad" descripcion={edad} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Segundo nombre" descripcion={nombreDos} />
          <ModalDatos titulo="Apellido" descripcion={apellido} />
          <ModalDatos titulo="Segundo apellido" descripcion={apellidoDos} />
          <ModalDatos
            titulo="Genero"
            descripcion={genero === "1" ? "Masculino" : "Femenino"}
          />
          <ModalDatos titulo="Teléfono" descripcion={telefono} />
          <ModalDatos titulo="Correo" descripcion={correo} />
          <ModalDatos titulo="Actividad laboral" descripcion={laboral} />
          <ModalDatos titulo="Cargo" descripcion={nombreCargo} />
          <ModalDatos titulo="Formación" descripcion={nombreFormacion} />
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
            seleccionado={seleccionado}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>

      <ModalConsultar
        isVisible={mostrarConsultarCedula}
        onClose={() => {
          dispatch(cerrarModal("consultar"));
          acciones.setCedula("");
        }}
        titulo={titulos[seleccionado] || "Consultar"}
      >
        <ModalDatosContenedor>
          {seleccionado === 1 && (
            <ConsultarCedula
              cedula={cedula}
              setCedula={acciones.setCedula}
              validarCedula={validaciones.validarCedula}
              setValidarCedula={validaciones.setValidarCedula}
              consultarVocero={consultarVoceroCedula}
              seleccionado={seleccionado}
            />
          )}

          {seleccionado === 2 && (
            <ConsultarVocerosParroquia
              idParroquia={idParroquia}
              setIdParroquia={acciones.setIdParroquia}
              seleccionado={seleccionado}
            />
          )}

          {seleccionado === 3 && (
            <ConsultarVocerosComuna
              idParroquia={idParroquia}
              setIdParroquia={acciones.setIdParroquia}
              idComuna={idComuna}
              setIdComuna={acciones.setIdComuna}
              seleccionado={seleccionado}
            />
          )}

          {seleccionado === 4 && (
            <ConsultarVocerosCircuito
              idParroquia={idParroquia}
              setIdParroquia={acciones.setIdParroquia}
              idCircuito={idCircuito}
              setIdCircuito={acciones.setIdCircuito}
              seleccionado={seleccionado}
            />
          )}

          {seleccionado === 5 && (
            <ConsultarVocerosConsejo
              idParroquia={idParroquia}
              setIdParroquia={acciones.setIdParroquia}
              idConsejo={idConsejo}
              setIdConsejo={acciones.setIdConsejo}
              seleccionado={seleccionado}
            />
          )}
        </ModalDatosContenedor>
      </ModalConsultar>
    </>
  );
}
