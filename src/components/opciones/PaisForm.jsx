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
import FormCrearPais from "../formularios/FormCrearPais";
import ModalEditar from "../modales/ModalEditar";
import FormEditarPais from "../formularios/FormEditarPais";
import ListadoPaises from "../listados/ListadoPaises";

export default function PaisesForm({
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
  const [nombrePais, setNombrePais] = useState("");
  const [capitalPais, setCapitalPais] = useState("");
  const [descripcionPais, setDescripcionPais] = useState("");
  const [serialPais, setSerialPais] = useState("");

  const [todosPaises, setTodosPaises] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [idPais, setIdPais] = useState("");
  const [accion, setAccion] = useState("");

  const [validarNombrePais, setValidarNombrePais] = useState("");
  const [validarCapitalPais, setValidarCapitalPais] = useState("");

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
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setIdPais("");
      setNombrePais("");
      setCapitalPais("");
      setDescripcionPais("");
    }
  }, [accion, mostrar]);

  useEffect(() => {
    if (!idPais) {
      setNombrePais("");
      setCapitalPais("");
      setDescripcionPais("");
      setSerialPais("");
      return;
    }
  }, [idPais]);

  const crearPais = async () => {
    if (nombrePais.trim()) {
      try {
        const response = await axios.post("/api/paises/crear-pais", {
          nombre: nombrePais,
          capital: capitalPais,
          descripcion: descripcionPais,
          serial: serialPais,
        });

        setTodosPaises((prev) =>
          prev ? [...prev, response.data.paises] : [response.data.paises]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombrePais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCapitalPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setSerialPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear pais: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoPais = async (datos) => {
    try {
      setAccion("editar");
      setIdPais(datos.id);
      setNombrePais(datos.nombre);
      setCapitalPais(datos.capital);
      setDescripcionPais(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando pais: " + error);
    }
  };

  const editarPais = async () => {
    if (nombrePais.trim()) {
      try {
        const data = {
          nombre: nombrePais.trim(),
          capital: capitalPais,
          descripcion: descripcionPais,
          id_pais: idPais,
        };

        const response = await axios.post(
          "/api/paises/actualizar-datos-pais",
          data
        );

        setTodosPaises((prevPaises) =>
          prevPaises.map((paises) =>
            paises.id === response.data.paises.id
              ? response.data.paises
              : paises
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombrePais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCapitalPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del pais: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombrePais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCapitalPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
          titulo={"¿Actualizar este pais?"}
        >
          <div className="w-full">
            <FormEditarPais
              nombre={nombrePais}
              setNombre={setNombrePais}
              capital={capitalPais}
              setCapital={setCapitalPais}
              descripcion={descripcionPais}
              setDescripcion={setDescripcionPais}
              validarNombre={validarNombrePais}
              setValidarNombre={setValidarNombrePais}
              validarCapital={validarCapitalPais}
              setValidarCapital={setValidarCapitalPais}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarPais}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este pais?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombrePais} />
            <ModalDatos titulo={"Capital"} descripcion={capitalPais} />
            <ModalDatos titulo={"Descripción"} descripcion={descripcionPais} />
            <ModalDatos titulo={"Serial"} descripcion={serialPais} />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearPais}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombrePais,
              capitalPais,
              descripcionPais,
              serialPais,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear Pais"}>
          <FormCrearPais
            nombre={nombrePais}
            setNombre={setNombrePais}
            capital={capitalPais}
            setCapital={setCapitalPais}
            descripcion={descripcionPais}
            setDescripcion={setDescripcionPais}
            serial={serialPais}
            setSerial={setSerialPais}
            validarNombre={validarNombrePais}
            setValidarNombre={setValidarNombrePais}
            validarCapital={validarCapitalPais}
            setValidarCapital={setValidarCapitalPais}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoPaises
            isLoading={isLoading}
            listado={todosPaises}
            nombreListado="Paises"
            mensajeVacio="No hay paises disponibles..."
            editando={editandoPais}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
