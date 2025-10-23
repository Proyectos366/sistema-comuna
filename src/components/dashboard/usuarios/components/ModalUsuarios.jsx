import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearUsuario from "@/components/formularios/FormCrearUsuario";
import MostarMsjEnModal from "@/components/mensaje/MostrarMsjEnModal";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";
import SelectOpcion from "@/components/SelectOpcion";
import { useSelector } from "react-redux";
import { cambiarSeleccionRol } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionRol";
import { obtenerTituloAccion } from "@/components/dashboard/usuarios/funciones/obtenerTituloAccion";
import { cambiarSeleccionDepartamento } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionDepartamento";
import { cambiarSeleccionInstitucion } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionInstitucion";
import { obtenerAccion } from "@/components/dashboard/usuarios/funciones/obtenerAccion";
import { toggleAutorizar } from "@/components/dashboard/usuarios/funciones/toggleAutorizar";

export default function ModalUsuarios({
  acciones,
  datosUsuario,
  validaciones,
}) {
  const { usuarioActivo } = useSelector((state) => state.auth);

  const {
    opcion,
    accion,
    mostrar,
    cerrarModal,
    limpiarCampos,
    mostrarModal,
    mostrarMensaje,
    crear,
    cancelar,
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
    roles,
    idDepartamento,
    idInstitucion,
    departamentos,
    instituciones,
    institucionMiembro,
    autorizar, estado, validado
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



  

  return (
    <>
      {opcion === "crear" && (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo="¿Crear usuario?"
        >
          <ModalDatosContenedor>
            <ModalDatos titulo="Cedula" descripcion={cedula} />
            <ModalDatos titulo="Nombre" descripcion={nombre} />
            <ModalDatos titulo="Apellido" descripcion={apellido} />
            <ModalDatos titulo="Correo" descripcion={correo} />
            {usuarioActivo.id_rol === 1 && (
              <ModalDatos
                titulo="Institución"
                descripcion={nombreInstitucion}
              />
            )}
            <ModalDatos
              titulo="Departamento"
              descripcion={nombreDepartamento}
            />
            <ModalDatos titulo="Clave" descripcion={claveUno} indice={1} />
            <ModalDatos
              titulo="Clave confirmar"
              descripcion={claveDos}
              indice={1}
            />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crear}
            cancelar={cancelar}
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
      )}

      {opcion === "editar" && (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={obtenerTituloAccion()}
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
                handleChange={cambiarSeleccionRol}
                opciones={todosRoles}
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
                  accion === "asignarDepartamento"
                    ? "Departamentos"
                    : "Cambiar a"
                }
                handleChange={cambiarSeleccionDepartamento}
                opciones={departamentos}
                seleccione="Seleccione"
                setNombre={setNombreDepartamento}
                indice={1}
              />
            )}
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={obtenerAccion()}
            cancelar={cerrarModal}
            indiceUno="crear"
            indiceDos="cancelar"
            nombreUno="Aceptar"
            nombreDos="Cancelar"
            campos={{ nombre, nombreDepartamento }}
          />
        </Modal>
      )}

      {opcion === "nuevoUsuario" && (
        <ModalPrincipal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={obtenerTituloAccion(accion, estado, validado)}
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
              mostrarModal={mostrarModal}
              mensaje={mensaje}
              setMensaje={setMensaje}
              cambiarSeleccionDepartamento={cambiarSeleccionDepartamento}
              cambiarSeleccionInstitucion={cambiarSeleccionInstitucion}
              cambiarSeleccionRol={cambiarSeleccionRol}
              departamentos={departamentos}
              instituciones={
                instituciones?.length > 0
                  ? instituciones
                  : [institucionMiembro]
              }
              roles={roles}
              autorizar={autorizar}
              setAutorizar={setAutorizar}
              toggleAutorizar={toggleAutorizar}
              usuarioActivo={usuarioActivo}
            />
          </ModalDatosContenedor>
        </ModalPrincipal>
      )}
    </>
  );
}
