"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import ModalDatosContenedor from "../ModalDatosContenedor";
import ModalEditar from "../modales/ModalEditar";
import FormEditarNovedad from "../formularios/FormEditarNovedad";
import FormCrearNovedad from "../formularios/FormCrearNovedad";
import ListadoNovedades from "../listados/ListadoNovedades";
import { formatearFecha } from "@/utils/Fechas";

export default function NovedadesForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
  usuarioActivo,
}) {
  const [nombreNovedad, setNombreNovedad] = useState("");
  const [descripcionNovedad, setDescripcionNovedad] = useState("");

  const [todasInstituciones, setTodasInstituciones] = useState([]);
  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [todasNovedades, setTodasNovedades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validarNombreNovedad, setValidarNombreNovedad] = useState(false);

  const [idNovedad, setIdNovedad] = useState("");
  const [idDepartamento, setIdDepartamento] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");
  const [idPrioridad, setIdPrioridad] = useState("");

  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [nombrePrioridad, setNombrePrioridad] = useState("");
  const [accion, setAccion] = useState("");

  const [abiertos, setAbiertos] = useState({});

  /** 
    useEffect(() => {
      const fetchDatosNovedad = async () => {
        try {
          const [departamentosRes, novedadesRes] = await Promise.all([
            axios.get("/api/departamentos/todos-departamentos"),
            axios.get("/api/novedades/todas-novedades"),
          ]);

          setTodosDepartamentos(departamentosRes.data.departamentos || []);
          setTodasNovedades(novedadesRes.data.novedades || []);
        } catch (error) {
          console.log("Error, al obtener las novedades: " + error);
        } finally {
          setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
        }
      };

      fetchDatosNovedad();
    }, []);
  */

  useEffect(() => {
    const fetchDatosNovedad = async () => {
      try {
        let novedadesRes;
        let departamentosRes = { data: { departamentos: [] } }; // Evita error si no se consulta

        if (usuarioActivo.id_rol === 1) {
          // Solo consulta todas-novedades
          novedadesRes = await axios.get("/api/novedades/todas-novedades");
          const response = await axios.get(
            "/api/instituciones/todas-instituciones"
          );
          setTodasInstituciones(response.data.instituciones || []);
        } else {
          // Consulta novedades por departamento y todos los departamentos
          const [novedadesDeptoRes, departamentosResp] = await Promise.all([
            axios.get("/api/novedades/todas-novedades-departamento"),
            axios.get("/api/departamentos/todos-departamentos"),
          ]);
          novedadesRes = novedadesDeptoRes;
          departamentosRes = departamentosResp;
        }

        setTodosDepartamentos(departamentosRes.data.departamentos || []);
        setTodasNovedades(novedadesRes.data.novedades || []);
      } catch (error) {
        console.log("Error al obtener las novedades: " + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatosNovedad();
  }, []);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setNombreNovedad("");
      setDescripcionNovedad("");
      setIdNovedad("");
      setIdDepartamento("");
    }

    if (accion === "eliminar" && !mostrar) {
      setAccion("");
      setNombreNovedad("");
      setDescripcionNovedad("");
      setIdNovedad("");
    }
  }, [accion, mostrar]);

  const crearNovedad = async () => {
    if (nombreNovedad.trim()) {
      try {
        const response = await axios.post("/api/novedades/crear-novedad", {
          nombre: nombreNovedad,
          descripcion: descripcionNovedad,
          prioridad: idPrioridad,
          id_institucion: idInstitucion,
          id_departamento: idDepartamento,
          rango: usuarioActivo.id_rol === 1 ? 1 : 2,
        });

        setTodasNovedades([...todasNovedades, response.data.novedades]); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear la novedad: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoNovedad = async (datos) => {
    try {
      setAccion("editar");
      setIdNovedad(datos.id);
      setIdDepartamento(datos.id_departamento);
      setNombreNovedad(datos.nombre);
      setDescripcionNovedad(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando novedad: " + error);
    }
  };

  const eliminandoNovedad = async (datos) => {
    try {
      console.log(datos);

      setAccion("eliminar");
      setIdNovedad(datos.id);
      setNombreNovedad(datos.nombre);
      setDescripcionNovedad(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, eliminando novedad: " + error);
    }
  };

  const editarNovedad = async () => {
    if (nombreNovedad.trim()) {
      try {
        const data = {
          nombre: nombreNovedad.trim(),
          descripcion: descripcionNovedad,
          id_departamento: idDepartamento,
          id_novedad: idNovedad,
        };

        const response = await axios.post(
          "/api/novedades/actualizar-datos-novedad",
          data
        );

        setTodasNovedades((prevNovedades) =>
          prevNovedades.map((novedad) =>
            novedad.id === response.data.novedad.id
              ? response.data.novedad
              : novedad
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos de la novedad: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  const eliminarNovedad = async () => {
    try {
      const response = await axios.patch("/api/novedades/eliminar-id-novedad", {
        id_novedad: idNovedad,
      });

      setTodasNovedades([...todasNovedades, response.data.novedades]); // Suponiendo que la API devuelve el nombre guardado

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setNombreNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setDescripcionNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setIdNovedad(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, eliminando novedad: " + error);
    }
  };

  const cambiarSeleccionDepartamento = (e) => {
    setIdDepartamento(e.target.value);
  };

  const cambiarSeleccionInstitucion = (e) => {
    setIdInstitucion(e.target.value);
  };

  const cambiarSeleccionPrioridad = (e) => {
    const valor = e.target.value;

    setIdPrioridad(valor);
  };

  const aceptarNovedad = async (datos) => {
    try {
      console.log(datos);

      //abrirModal();
    } catch (error) {
      console.log("Error, aceptando la novedad: " + error);
    }
  };

  console.log(todasNovedades);

  return (
    <>
      {/* {accion === "editar" ? (
        <ModalEditar
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Actualizar esta novedad?"}
        >
          <div className="w-full">
            <FormEditarNovedad
              nombre={nombreNovedad}
              setNombre={setNombreNovedad}
              descripcion={descripcionNovedad}
              setDescripcion={setDescripcionNovedad}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarNovedad}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear esta novedad?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreNovedad} />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionNovedad}
            />
            {usuarioActivo.id_rol === 1 ? (
              <ModalDatos
                titulo={"Institución"}
                descripcion={nombreInstitucion}
              />
            ) : (
              <ModalDatos
                titulo={"Departamento"}
                descripcion={nombreDepartamento}
              />
            )}
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearNovedad}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreNovedad,
              descripcionNovedad,
              idDepartamento,
            }}
          />
        </Modal>
      )} */}

      {accion === "editar" ? (
        <ModalEditar
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Actualizar esta novedad?"}
        >
          <div className="w-full">
            <FormEditarNovedad
              nombre={nombreNovedad}
              setNombre={setNombreNovedad}
              descripcion={descripcionNovedad}
              setDescripcion={setDescripcionNovedad}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarNovedad}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : accion === "eliminar" ? (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Eliminar esta novedad?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreNovedad} />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionNovedad}
            />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={eliminarNovedad}
            cancelar={cerrarModal}
            indiceUno={"eliminar"}
            indiceDos={"cancelarEliminar"}
            nombreUno={"Eliminar"}
            nombreDos={"Cancelar"}
            campos={{ idNovedad }}
          />
        </Modal>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear esta novedad?"}
        >
          <ModalDatosContenedor>
            {usuarioActivo.id_rol === 1 ? (
              <ModalDatos
                titulo={"Institución"}
                descripcion={nombreInstitucion}
              />
            ) : (
              <ModalDatos
                titulo={"Departamento"}
                descripcion={nombreDepartamento}
              />
            )}

            <ModalDatos titulo={"Nombre"} descripcion={nombreNovedad} />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionNovedad}
            />
            <ModalDatos titulo={"Prioridad"} descripcion={nombrePrioridad} />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearNovedad}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreNovedad,
              descripcionNovedad,
              idDepartamento,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear novedad"}>
          <FormCrearNovedad
            usuarioActivo={usuarioActivo}
            idInstitucion={idInstitucion}
            idDepartamento={idDepartamento}
            idPrioridad={idPrioridad}
            setIdInstitucion={setIdInstitucion}
            setIdDepartamento={setIdDepartamento}
            setIdPrioridad={setIdPrioridad}
            nombre={nombreNovedad}
            setNombre={setNombreNovedad}
            descripcion={descripcionNovedad}
            setDescripcion={setDescripcionNovedad}
            validarNombre={validarNombreNovedad}
            setValidarNombre={setValidarNombreNovedad}
            instituciones={todasInstituciones}
            departamentos={todosDepartamentos}
            setNombreInstitucion={setNombreInstitucion}
            setNombreDepartamento={setNombreDepartamento}
            setNombrePrioridad={setNombrePrioridad}
            cambiarSeleccionInstitucion={cambiarSeleccionInstitucion}
            cambiarSeleccionDepartamento={cambiarSeleccionDepartamento}
            cambiarSeleccionPrioridad={cambiarSeleccionPrioridad}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivUnoDentroSectionRegistroMostrar nombre={"Novedades"}>
          <ListadoNovedades
            isLoading={isLoading}
            listado={todasNovedades}
            nombreListado="Novedades"
            mensajeVacio="No hay novedades disponibles..."
            editando={editandoNovedad}
            eliminando={eliminandoNovedad}
            usuarioActivo={usuarioActivo}
            aceptarNovedad={aceptarNovedad}
            abiertos={abiertos}
            setAbiertos={setAbiertos}
          />
        </DivUnoDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
