"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../modales/ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import ModalDatosContenedor from "../modales/ModalDatosContenedor";
import FormCrearEstado from "../formularios/FormCrearEstado";
import ModalEditar from "../modales/ModalEditar";
import FormEditarEstado from "../formularios/FormEditarEstado";
import ListadoPaises from "../listados/ListadoPaises";

export default function EstadosForm({
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
  const [nombreEstado, setNombreEstado] = useState("");
  const [capitalEstado, setCapitalEstado] = useState("");
  const [codigoPostalEstado, setCodigoPostalEstado] = useState("");
  const [descripcionPais, setDescripcionPais] = useState("");

  const [todosPaises, setTodosPaises] = useState([]);
  const [todosEstados, setTodosEstados] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [accion, setAccion] = useState("");

  const [validarNombreEstado, setValidarNombreEstado] = useState("");
  const [validarCapitalEstado, setValidarCapitalEstado] = useState("");

  const [nombrePais, setNombrePais] = useState("");

  useEffect(() => {
    const fetchDatosPaises = async () => {
      try {
        const response = await axios.get("/api/paises/todos-paises");
        setTodosPaises(response.data.paises || []);
      } catch (error) {
        console.log("Error al obtener los paises:", error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosPaises();
  }, []);

  useEffect(() => {
    if (!idPais) {
      setTodosEstados([]);
      return;
    }

    const paisSeleccionado = todosPaises.find((p) => p.id === parseInt(idPais));
    setTodosEstados(paisSeleccionado?.estados || []);
    setIdEstado(""); // Reiniciar selección
  }, [idPais]);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setIdEstado("");
      setNombreEstado("");
      setCapitalEstado("");
      setDescripcionPais("");
    }
  }, [accion, mostrar]);

  useEffect(() => {
    if (!idEstado) {
      setNombreEstado("");
      setCapitalEstado("");
      setCodigoPostalEstado("");
      setDescripcionPais("");
      return;
    }
  }, [idEstado]);

  const cambiarSeleccionPais = (e) => {
    setIdPais(e.target.value);
  };

  const crearEstado = async () => {
    if (nombreEstado.trim()) {
      try {
        const response = await axios.post("/api/estados/crear-estado", {
          nombre: nombreEstado,
          capital: capitalEstado,
          codigoPostal: codigoPostalEstado,
          descripcion: descripcionPais,
          id_pais: idPais,
        });

        setTodosPaises((prev) =>
          prev ? [...prev, response.data.paises] : [response.data.paises]
        );

        setTodosEstados((prev) =>
          prev ? [...prev, response.data.estados] : [response.data.estados]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCapitalEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCodigoPostalEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos.0
        ]);
      } catch (error) {
        console.log("Error, al crear estado: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoEstado = async (datos) => {
    try {
      setAccion("editar");
      setIdEstado(datos.id);
      setNombreEstado(datos.nombre);
      setCapitalEstado(datos.capital);
      setCodigoPostalEstado(datos.cod_postal);
      setDescripcionPais(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando estado: " + error);
    }
  };

  const editarEstado = async () => {
    if (nombreEstado.trim()) {
      try {
        const data = {
          nombre: nombreEstado.trim(),
          capital: capitalEstado,
          codigoPostal: codigoPostalEstado,
          descripcion: descripcionPais,
          id_pais: idPais,
          id_estado: idEstado,
        };

        const response = await axios.post(
          "/api/estados/actualizar-datos-estado",
          data
        );

        setTodosPaises(response.data.paises);

        setTodosEstados((prevEstados) =>
          prevEstados.map((estados) =>
            estados.id === response.data.estados.id
              ? response.data.estados
              : estados
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCapitalEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCodigoPostalEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del estado: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCapitalEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCodigoPostalEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  return (
    <>
      {accion === "editar" ? (
        <ModalEditar
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Actualizar este estado?"}
        >
          <div className="w-full">
            <FormEditarEstado
              idPais={idPais}
              nombre={nombreEstado}
              setNombre={setNombreEstado}
              capital={capitalEstado}
              setCapital={setCapitalEstado}
              codigoPostal={codigoPostalEstado}
              setCodigoPostal={codigoPostalEstado}
              descripcion={descripcionPais}
              setDescripcion={setDescripcionPais}
              validarNombre={validarNombreEstado}
              setValidarNombre={setValidarNombreEstado}
              validarCapital={validarCapitalEstado}
              setValidarCapital={setValidarCapitalEstado}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarEstado}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este estado?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Pais"} descripcion={nombrePais} />
            <ModalDatos titulo={"Nombre"} descripcion={nombreEstado} />
            <ModalDatos titulo={"Capital"} descripcion={capitalEstado} />
            <ModalDatos
              titulo={"Código postal"}
              descripcion={codigoPostalEstado}
            />
            <ModalDatos titulo={"Descripción"} descripcion={descripcionPais} />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearEstado}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreEstado,
              capitalEstado,
              codigoPostalEstado,
              descripcionPais,
              idPais,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear Estado"}>
          <FormCrearEstado
            idPais={idPais}
            nombre={nombreEstado}
            setNombre={setNombreEstado}
            capital={capitalEstado}
            setCapital={setCapitalEstado}
            codigoPostal={codigoPostalEstado}
            setCodigoPostal={setCodigoPostalEstado}
            descripcion={descripcionPais}
            setDescripcion={setDescripcionPais}
            validarNombre={validarNombreEstado}
            setValidarNombre={setValidarNombreEstado}
            validarCapital={validarCapitalEstado}
            setValidarCapital={setValidarCapitalEstado}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            paises={todosPaises}
            cambiarSeleccionPais={cambiarSeleccionPais}
            setNombrePais={setNombrePais}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoPaises
            isLoading={isLoading}
            listado={todosEstados}
            nombreListado="Estados"
            mensajeVacio="No hay estados disponibles..."
            editando={editandoEstado}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
