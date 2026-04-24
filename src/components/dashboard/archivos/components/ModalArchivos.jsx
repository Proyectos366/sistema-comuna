"use client";

import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearArchivo from "@/components/formularios/FormCrearArchivo";
import FormEditarArchivo from "@/components/formularios/FormEditarArchivo";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import AvisoAdvertencia from "@/components/dashboard/participantes/components/AvisoAdvertencia";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearArchivo } from "@/store/features/archivos/thunks/crearArchivo";
import { actualizarArchivo } from "@/store/features/archivos/thunks/actualizarArchivo";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { eliminarRestaurarArchivo } from "@/store/features/archivos/thunks/eliminarRestaurarArchivo";

export default function ModalArchivos({
  acciones,
  datosArchivo,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );

  const mostrarEliminarRestaurar = useSelector(
    (state) => state.modal.modales.confirmarEliminarRestaurar,
  );

  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    idArchivo,
    idCarpeta,
    archivo,
    nombre,
    descripcion,
    alias,
    borradoRestaurado,
    nombreCarpeta,
  } = datosArchivo;

  const notify = (msj) => toast(msj);

  const handleCrearArchivo = async () => {
    try {
      const nuevoArchivo = {
        archivo: archivo,
        nombre: nombre,
        descripcion: descripcion,
        alias: alias,
        idCarpeta: idCarpeta,
      };

      await dispatch(
        crearArchivo({
          nuevoArchivo: nuevoArchivo,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarArchivo = async () => {
    try {
      const updateArchivo = {
        archivo: archivo,
        nombre: nombre,
        descripcion: descripcion,
        alias: alias,
        id_carpeta: idCarpeta,
      };

      await dispatch(
        actualizarArchivo({
          updateArchivo: updateArchivo,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBorrarRestaurarArchivo = async () => {
    try {
      const deleteArchivo = {
        id_archivo: idArchivo,
        estado: borradoRestaurado,
      };

      await dispatch(
        eliminarRestaurarArchivo({
          deleteArchivo: deleteArchivo,
          notify: notify,
        }),
      ).unwrap();

      dispatch(cerrarModal("confirmarEliminarRestaurar"));
    } catch (error) {
      notify(error);
      console.log(error);
    }
  };


  /** 
    const crearArchivo = async () => {
      try {
        const formData = new FormData();
        formData.append("id_usuario", id);
        formData.append("id_departamento", carpetaActual.id_departamento);
        formData.append("id_estante", carpetaActual.id_estante);
        formData.append("id_carpeta", nombreCarpetaAbierta.id);
        formData.append("nombreArchivo", nombreArchivo);
        formData.append("archivo", archivo); // Asegúrate de que sea un `File` válido
        formData.append("descripcionArchivo", descripcionArchivo);
        formData.append("aliasArchivo", aliasArchivo);

        const response = await axios.post(
          `/api/archivos/crear-archivo`,
          formData
        );

        console.log(response.data);

        if (response.data.status === "ok") {
          setNuevoArchivo(true);
          setMensaje(response.data.message);

          setTimeout(() => {
            setNombreArchivo("");
            setDescripcionArchivo("");
            setAliasArchivo("");
            setArchivo("");
            setMensaje("");
            setOpenModalCrearEstante(false);
          }, 5000);
        } else {
          setMensaje(response.data.message);

          setTimeout(() => {
            setMensaje("");
          }, 5000);
        }
      } catch (error) {
        console.log("Error al crear archivo: " + error);
        setMensaje(error?.response?.data?.message);

        setTimeout(() => {
          setMensaje("");
        }, 5000);
      }
    };

    const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Por favor, selecciona un archivo PDF.");
      event.target.value = ""; // Limpia el input manualmente
    } else {
      setArchivo(null); // Reiniciar el estado antes de asignar el nuevo archivo
      setTimeout(() => setArchivo(file)); // Forzar actualización del estado
    }
  };
  */



  return (
    <>
      <ToastContainer />

      <Modal
        isVisible={mostrarConfirmar}
        onClose={() => {
          dispatch(cerrarModal("confirmar"));
        }}
        titulo={"¿Crear este archivo?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Carpeta" descripcion={nombreCarpeta} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
          <ModalDatos titulo="Alias" descripcion={alias} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearArchivo}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
            dispatch(abrirModal("crear"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            archivo,
            nombre,
            descripcion,
            alias,
            idArchivo,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEliminarRestaurar}
        onClose={() => {
          dispatch(cerrarModal("confirmarEliminarRestaurar"));
        }}
        titulo={
          borradoRestaurado
            ? "¿Restaurar este archivo?"
            : "¿Eliminar este archivo?"
        }
      >
        <ModalDatosContenedor>
          <AvisoAdvertencia
            mensaje={`Una vez haga click en aceptar, se ${borradoRestaurado ? "restaurará" : "eliminará"}
                      el archivo.`}
          />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleBorrarRestaurarArchivo}
          cancelar={() => {
            dispatch(cerrarModal("confirmarEliminarRestaurar"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            idArchivo,
            borradoRestaurado,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar este archivo?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Carpeta" descripcion={nombreCarpeta} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarArchivo}
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
            idCarpeta,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar este archivo?"}
      >
        <ModalDatosContenedor>
          <FormEditarArchivo
            acciones={acciones}
            datosArchivo={datosArchivo}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear archivo?"}
      >
        <ModalDatosContenedor>
          <FormCrearArchivo
            acciones={acciones}
            datosArchivo={datosArchivo}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
