"use client";

import { useEffect } from "react";
import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearUsuario from "@/components/formularios/FormCrearUsuario";
import MostarMsjEnModal from "@/components/mensaje/MostrarMsjEnModal";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";
import SelectOpcion from "@/components/SelectOpcion";
import { useSelector, useDispatch } from "react-redux";
import { cambiarSeleccionRol } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionRol";
import { obtenerTituloAccion } from "@/components/dashboard/usuarios/funciones/obtenerTituloAccion";
import { cambiarSeleccionDepartamento } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionDepartamento";
import { fetchRoles } from "@/store/features/roles/thunks/todosRoles";
import { fetchInstituciones } from "@/store/features/instituciones/thunks/todasInstituciones";
import { fetchDepartamentos } from "@/store/features/departamentos/thunks/todosDepartamentos";
import { cambiarDepartamentoUsuario } from "@/store/features/usuarios/thunks/cambiarDepartamentoUsuario";
import { cambiarRolUsuario } from "@/store/features/usuarios/thunks/cambiarRolUsuario";
import { ToastContainer, toast } from "react-toastify";
import { crearUsuario } from "@/store/features/usuarios/thunks/crearUsuario";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function ModalUsuarios({
  acciones,
  datosUsuario,
  validaciones,
}) {
  const dispatch = useDispatch();
  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const notify = (msj) => toast(msj);

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.roles);
  const { departamentos } = useSelector((state) => state.departamentos);
  const { instituciones } = useSelector((state) => state.instituciones);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDepartamentos());
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchInstituciones());
    }
  }, [dispatch]);

  const {
    accion,
    limpiarCampos,
    setNombreRol,
    setNombreDepartamento,
    setIdInstitucion,
    setIdDepartamento,
    setIdRol,
    setNombreInstitucion,
    setCedula,
    setNombre,
    setApellido,
    setCorreo,
    setClaveUno,
    setClaveDos,
    setMensaje,
    setAutorizar,
  } = acciones;

  const {
    cedula,
    nombre,
    apellido,
    correo,
    nombreInstitucion,
    nombreDepartamento,
    claveUno,
    claveDos,
    mensaje,
    nombreRol,
    idRol,
    idUsuario,
    idDepartamento,
    idInstitucion,
    autorizar,
  } = datosUsuario;

  const {
    validarCedula,
    setValidarCedula,
    validarNombre,
    setValidarNombre,
    validarApellido,
    setValidarApellido,
    validarCorreo,
    setValidarCorreo,
    validarClave,
    setValidarClave,
  } = validaciones;

  const handleCrearUsuario = async () => {
    try {
      const nuevoUsuario = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        claveUno: claveUno,
        claveDos: claveDos,
        id_rol: idRol,
        autorizar: autorizar,
        institucion: [{ id: idInstitucion }],
        departamento: [{ id: idDepartamento }],
      };
      await dispatch(
        crearUsuario({
          nuevoUsuario: nuevoUsuario,
          notify: notify,
          cerrarModal: cerrarModal,
        })
      ).unwrap();
      // El nuevo usuario ya se muestra, y la lista se actualizará en segundo plano
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
        titulo={"¿Crear este usuario?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Cedula" descripcion={cedula} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Apellido" descripcion={apellido} />
          <ModalDatos titulo="Correo" descripcion={correo} />
          {usuarioActivo.id_rol === 1 && (
            <ModalDatos titulo="Institución" descripcion={nombreInstitucion} />
          )}
          <ModalDatos titulo="Departamento" descripcion={nombreDepartamento} />
          <ModalDatos titulo="Clave" descripcion={claveUno} indice={1} />
          <ModalDatos
            titulo="Clave confirmar"
            descripcion={claveDos}
            indice={1}
          />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearUsuario}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
            dispatch(abrirModal("crear"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            cedula,
            nombre,
            apellido,
            correo,
            nombreInstitucion,
            nombreDepartamento,
            claveUno,
            claveDos,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este usuario?"}
      >
        <ModalDatosContenedor>
          {accion === "cambiarDepartamento" && (
            <ModalDatos
              titulo="Departamento"
              descripcion={nombreDepartamento}
            />
          )}

          <ModalDatos titulo="Usuario" descripcion={nombre} />

          {accion === "cambiarRol" && (
            <ModalDatos titulo="Rol" descripcion={nombreRol} />
          )}

          {accion === "cambiarRol" && (
            <SelectOpcion
              idOpcion={idRol}
              nombre={"Cambiar a"}
              handleChange={(e) => {
                cambiarSeleccionRol(e, setIdRol);
              }}
              opciones={roles}
              seleccione="Seleccione"
              setNombre={setNombreRol}
              indice={1}
            />
          )}

          {(accion === "cambiarDepartamento" ||
            accion === "asignarDepartamento") && (
            <SelectOpcion
              idOpcion={idDepartamento}
              nombre={
                accion === "asignarDepartamento" ? "Departamentos" : "Cambiar a"
              }
              handleChange={(e) => {
                cambiarSeleccionDepartamento(e, setIdDepartamento);
              }}
              opciones={departamentos}
              seleccione="Seleccione"
              setNombre={setNombreDepartamento}
              indice={1}
            />
          )}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={() => {
            if (
              accion === "cambiarDepartamento" ||
              accion === "asignarDepartamento"
            ) {
              dispatch(
                cambiarDepartamentoUsuario({
                  idUsuario,
                  idDepartamento,
                  cerrarModal,
                  notify,
                })
              );
            }

            if (accion === "cambiarRol") {
              dispatch(
                cambiarRolUsuario({
                  idRol,
                  idUsuario,
                  cerrarModal,
                  notify,
                })
              );
            }
          }}
          cancelar={cerrarModal}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{ nombre, nombreDepartamento }}
        />
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear usuario?"}
      >
        <ModalDatosContenedor>
          <FormCrearUsuario
            idInstitucion={idInstitucion}
            idDepartamento={idDepartamento}
            idRol={idRol}
            setIdInstitucion={setIdInstitucion}
            setIdDepartamento={setIdDepartamento}
            setIdRol={setIdRol}
            setNombreDepartamento={setNombreDepartamento}
            setNombreInstitucion={setNombreInstitucion}
            setNombreRol={setNombreRol}
            cedula={cedula}
            setCedula={setCedula}
            correo={correo}
            setCorreo={setCorreo}
            nombre={nombre}
            setNombre={setNombre}
            apellido={apellido}
            setApellido={setApellido}
            claveUno={claveUno}
            setClaveUno={setClaveUno}
            claveDos={claveDos}
            setClaveDos={setClaveDos}
            validarCedula={validarCedula}
            setValidarCedula={setValidarCedula}
            validarCorreo={validarCorreo}
            setValidarCorreo={setValidarCorreo}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarApellido={validarApellido}
            setValidarApellido={setValidarApellido}
            validarClave={validarClave}
            setValidarClave={setValidarClave}
            limpiarCampos={limpiarCampos}
            mensaje={mensaje}
            setMensaje={setMensaje}
            departamentos={departamentos}
            instituciones={instituciones}
            roles={roles}
            autorizar={autorizar}
            setAutorizar={setAutorizar}
            usuarioActivo={usuarioActivo}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
