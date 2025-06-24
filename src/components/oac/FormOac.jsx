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
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";
import Titulos from "../Titulos";
import FormCrearCursando from "./FormCrearCursando";
import FormCrearClase from "./FormCrearClase";

export default function FormOac({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreClase, setNombreClase] = useState("");
  const [cedulaCursando, setCedulaCursando] = useState("");
  const [edadCursando, setEdadCursando] = useState("");
  const [generoCursando, setGeneroCursando] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idConsejo, setIdConsejo] = useState("");
  const [idClase, setIdClase] = useState("");

  const [seleccionarClase, setSeleccionarClase] = useState([]);

  const [todasClases, setTodasClases] = useState([]);
  const [todasComunas, setTodasComunas] = useState([]);
  const [todosConsejos, setTodosConsejos] = useState([]);
  const [todosCursandos, setTodosCursandos] = useState([]);

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [nombreComuna, setNombreComuna] = useState("");
  const [nombreConsejoComunal, setNombreConsejoComunal] = useState("");
  const [nameClase, setNameClase] = useState("");
  const [nameComuna, setNameComuna] = useState("");
  const [nameConsejo, setNameConsejo] = useState("");

  const [accion, setAccion] = useState("");

  const [seleccionarConsulta, setSeleccionarConsulta] = useState("");
  const [seleccionarDondeCrear, setSeleccionarDondeCrear] = useState("");

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [clasesRes, cursandoRes, comunasRes, consejosRes] =
          await Promise.all([
            axios.get("/api/oac/todas-clases"),
            axios.get("/api/oac/todos-cursando"),
            axios.get("/api/comunas/todas-comunas"),
            axios.get("/api/consejos/todos-consejos-comunales"),
          ]);

        setTodasClases(clasesRes.data.clases || []);
        setTodosCursandos(cursandoRes.data.cursandos || []);
        setTodasComunas(comunasRes.data.comunas || []);
        setTodosConsejos(consejosRes.data.consejos || []);
      } catch (error) {
        console.log("Error, al obtener datos: " + error);
      }
    };

    fetchDatos();
  }, []);

  /** 
  useEffect(() => {
    setIdParroquia("");
    setIdComunaCircuito("");
    setIdConsejoComunal("");
    setTodasComunas([]);
    setTodosConsejos([]);
    setTodosVoceros([]);
    setNombreVocero("");
  }, [perteneceComunaCircuito]);
  */

  const toggleGenero = (id) => {
    setGeneroCursando(generoCursando === id ? null : id); // Cambia el estado, permitiendo deselección
  };

  const cambiarSeleccionComuna = (e) => {
    const valor = e.target.value;
    setIdComuna(valor);
  };

  const cambiarSeleccionConsejo = (e) => {
    const valor = e.target.value;
    setIdConsejo(valor);
  };

  const toggleClase = (id, nombre) => {
    setNameClase(nombre);
    setSeleccionarClase((prev) =>
      prev.includes(id) ? prev.filter((clase) => clase !== id) : [...prev, id]
    );
  };

  const crearClase = async () => {
    if (nombreClase.trim()) {
      try {
        // Verificación básica antes de enviar la solicitud
        if (!nombreClase.trim()) {
          console.warn("Todos los campos obligatorios deben estar completos.");
          return;
        }

        const response = await axios.post("/api/oac/crear-clase", {
          nombre: nombreClase,
        });

        setTodasClases([...todasClases, response.data.clase]);
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreClase(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear clase: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  const crearCursando = async () => {
    if (cedulaCursando.trim()) {
      try {
        // Verificación básica antes de enviar la solicitud
        if (!cedulaCursando.trim()) {
          console.warn("Todos los campos obligatorios deben estar completos.");
          return;
        }

        // Datos generales del vocero
        const data = {
          cedula: Number(cedulaCursando),
          genero: generoCursando,
          edad: Number(edadCursando),
          idParroquia: idParroquia,
          idComuna: idComuna,
          idConsejo: idConsejo,
          idClase: idClase,
          clases:
            seleccionarClase.length > 0
              ? seleccionarClase.map((id) => ({ id }))
              : [],
        };

        const response = await axios.post(
          "/api/oac/crear-cursando-clase",
          data
        );

        setTodosCursandos([...todosCursandos, response.data.cursando]);
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCedulaCursando(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setEdadCursando(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setGeneroCursando(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear cursando: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  const toggleConsultar = (id) => {
    const nuevoId = seleccionarConsulta === id ? null : id;
    setSeleccionarConsulta(nuevoId);
  };

  const toggleDondeCrear = (id) => {
    const nuevoId = seleccionarDondeCrear === id ? null : id;
    setSeleccionarDondeCrear(nuevoId);
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={
          accion === "clase"
            ? "¿Crear esta formación?"
            : "¿Crear este registro?"
        }
      >
        <ModalDatosContenedor>
          {accion === "clase" ? (
            <ModalDatos titulo={"Nombre"} descripcion={nombreClase} />
          ) : (
            <>
              <ModalDatos titulo={"Cedula"} descripcion={cedulaCursando} />
              <ModalDatos titulo={"Edad"} descripcion={edadCursando} />
              <ModalDatos titulo={"Genero"} descripcion={generoCursando} />
            </>
          )}
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

        <BotonesModal
          aceptar={accion === "clase" ? crearClase : crearCursando}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={
            accion === "clase"
              ? { nombreClase }
              : accion === "cursando"
              ? {
                  cedulaCursando,
                  edadCursando,
                  generoCursando,
                }
              : {}
          }
        />
      </Modal>

      <div className="flex flex-col mt-3">
        <div className="flex justify-start">
          <Titulos indice={2} titulo={"Consultas"} />
        </div>

        <div className="border border-gray-200 p-2 rounded-md mb-2">
          <div className="flex flex-wrap gap-2 sm:justify-between">
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={1}
                isChecked={seleccionarConsulta === 1}
                onToggle={toggleConsultar}
                nombre="Crear formación"
              />
            </div>
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={2}
                isChecked={seleccionarConsulta === 2}
                onToggle={toggleConsultar}
                nombre="Crear cursando"
              />
            </div>
          </div>
        </div>
      </div>

      {seleccionarConsulta && (
        <div className="flex flex-col mt-3">
          <div className="flex flex-wrap gap-2 sm:justify-between">
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={1}
                isChecked={seleccionarDondeCrear === 1}
                onToggle={toggleDondeCrear}
                nombre="Comuna"
              />
            </div>
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={2}
                isChecked={seleccionarDondeCrear === 2}
                onToggle={toggleDondeCrear}
                nombre="Consejo comunal"
              />
            </div>
          </div>
        </div>
      )}

      {seleccionarConsulta === 1 && !seleccionarDondeCrear && (
        <SectionRegistroMostrar>
          <DivUnoDentroSectionRegistroMostrar nombre={"Crear  clase"}>
            <FormCrearClase
              abrirModal={abrirModal}
              nombre={nombreClase}
              setNombre={setNombreClase}
            />
          </DivUnoDentroSectionRegistroMostrar>

          <DivDosDentroSectionRegistroMostrar>
            <ListadoGenaral
              isLoading={isLoading}
              listado={todasClases}
              nombreListado={"Formaciones"}
              mensajeVacio={"No hay formaciones disponibles..."}
            />
          </DivDosDentroSectionRegistroMostrar>
        </SectionRegistroMostrar>
      )}

      {seleccionarConsulta === 2 && seleccionarDondeCrear && (
        <SectionRegistroMostrar>
          <DivUnoDentroSectionRegistroMostrar nombre={"Crear cursando"}>
            <FormCrearCursando
              abrirModal={abrirModal}
              cedula={cedulaCursando}
              setCedula={setCedulaCursando}
              genero={generoCursando}
              setGenero={setGeneroCursando}
              edad={edadCursando}
              setEdad={setEdadCursando}
              dondeCrear={seleccionarDondeCrear}
              idComuna={idComuna}
              idConsejo={idConsejo}
              clases={todasClases}
              cambiarSeleccionComuna={cambiarSeleccionComuna}
              cambiarSeleccionConsejo={cambiarSeleccionConsejo}
              comunas={todasComunas}
              consejos={todosConsejos}
              setNameComuna={setNameComuna}
              setNameConsejo={setNameConsejo}
              seleccionarClases={seleccionarClase}
              toggleGenero={toggleGenero}
              toggleClases={toggleClase}
            />
          </DivUnoDentroSectionRegistroMostrar>

          <DivDosDentroSectionRegistroMostrar>
            <ListadoGenaral
              isLoading={isLoading}
              listado={todosCursandos}
              nombreListado={"Cursando"}
              mensajeVacio={"No hay personas disponibles..."}
            />
          </DivDosDentroSectionRegistroMostrar>
        </SectionRegistroMostrar>
      )}
    </>
  );
}
