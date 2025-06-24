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
import FormCrearVocero from "../formularios/FormCrearVocero";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

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

        const response = await axios.post("/api/oac/crear-cursando-clase", data);

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

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear este vocero?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Cedula"} descripcion={cedulaVocero} />
          <ModalDatos titulo={"Edad"} descripcion={edadVocero} />
          <ModalDatos titulo={"Primer nombre"} descripcion={nombreVocero} />
          <ModalDatos titulo={"Segundo nombre"} descripcion={nombreDosVocero} />
          <ModalDatos titulo={"Primer apellido"} descripcion={apellidoVocero} />
          <ModalDatos
            titulo={"Segundo apellido"}
            descripcion={apellidoDosVocero}
          />

          <ModalDatos
            titulo={"Genero"}
            descripcion={generoVocero == 1 ? "Masculino" : "Femenino"}
          />
          <ModalDatos titulo={"Telefono"} descripcion={telefonoVocero} />

          <ModalDatos titulo={"Correo"} descripcion={correoVocero} />
          <ModalDatos
            titulo={"Actividad laboral"}
            descripcion={actividadLaboralVocero}
          />

          <ModalDatos titulo={"Formación"} descripcion={nameClase} />
          <ModalDatos
            titulo={"Actividad laboral"}
            descripcion={actividadLaboralVocero}
          />

          <ModalDatos titulo={"Comuna"} descripcion={nombreComuna} />
          {nombreConsejoComunal && (
            <ModalDatos
              titulo={"Consejo comunal"}
              descripcion={nombreConsejoComunal}
            />
          )}
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearVocero}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreVocero,
            idParroquia,
            idComunaCircuito,
            idConsejoComunal,
          }}
        />
      </Modal>
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear vocero"}>
          <FormCrearVocero
            idParroquia={idParroquia}
            idComunaCircuito={idComunaCircuito}
            idConsejo={idConsejoComunal}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
            cambiarSeleccionConsejo={cambiarSeleccionConsejo}
            cambiarDondeGuardar={cambiarDondeGuardar}
            cambiarDondeCrear={cambiarDondeCrear}
            toggleGenero={toggleGenero}
            parroquias={parroquias}
            comunasCircuitos={todasComunas}
            consejos={todosConsejos}
            dondeGuardar={circuitoComuna}
            dondeCrear={perteneceComunaCircuito}
            setDondeGuardar={setCircuitoComuna}
            nombre={nombreVocero}
            setNombre={setNombreVocero}
            nombreDos={nombreDosVocero}
            setNombreDos={setNombreDosVocero}
            apellido={apellidoVocero}
            setApellido={setApellidoVocero}
            apellidoDos={apellidoDosVocero}
            setApellidoDos={setApellidoDosVocero}
            cedula={cedulaVocero}
            setCedula={setCedulaVocero}
            genero={generoVocero}
            setGenero={setGeneroVocero}
            edad={edadVocero}
            setEdad={setEdadVocero}
            telefono={telefonoVocero}
            setTelefono={setTelefonoVocero}
            direccion={direccionVocero}
            setDireccion={setDireccionVocero}
            correo={correoVocero}
            setCorreo={setCorreoVocero}
            actividadLaboral={actividadLaboralVocero}
            setActividadLaboral={setActividadLaboralVocero}
            seleccionarCargo={seleccionarCargo}
            setSeleccionarCargo={setSeleccionarCargo}
            cargos={cargos}
            toggleCargo={toggleCargos}
            seleccionarClase={seleccionarClase}
            formaciones={formaciones}
            toggleFormaciones={toggleFormacion}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            setNombreComuna={setNombreComuna}
            setNombreConsejoComunal={setNombreConsejoComunal}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todosVoceros}
            nombreListado={"Voceros"}
            mensajeVacio={"No hay voceros disponibles..."}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
