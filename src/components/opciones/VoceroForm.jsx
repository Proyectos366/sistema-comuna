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
import InputCheckBox from "../inputs/InputCheckBox";
import SelectOpcion from "../SelectOpcion";
import ListadoVoceros from "../Listados/ListadoVoceros";
import Titulos from "../Titulos";
import InputCedula from "../inputs/InputCedula";
import LabelInput from "../inputs/LabelInput";
import Boton from "../Boton";
import FormEditarVocero from "../formularios/FormEditarVocero";
import ModalEditar from "../modales/ModalEditar";

export default function VoceroForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreVocero, setNombreVocero] = useState("");
  const [nombreDosVocero, setNombreDosVocero] = useState("");
  const [apellidoVocero, setApellidoVocero] = useState("");
  const [apellidoDosVocero, setApellidoDosVocero] = useState("");
  const [cedulaVocero, setCedulaVocero] = useState("");
  const [generoVocero, setGeneroVocero] = useState("");
  const [edadVocero, setEdadVocero] = useState("");
  const [telefonoVocero, setTelefonoVocero] = useState("");
  const [direccionVocero, setDireccionVocero] = useState("");
  const [correoVocero, setCorreoVocero] = useState("");
  const [actividadLaboralVocero, setActividadLaboralVocero] = useState("");

  const [seleccionarCargo, setSeleccionarCargo] = useState([]);
  const [seleccionarFormacion, setSeleccionarFormacion] = useState([]);

  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idCircuito, setIdCircuito] = useState("");
  const [idConsejoComunal, setIdConsejoComunal] = useState("");

  const [todasParroquias, setTodasParroquias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [formaciones, setFormaciones] = useState([]);

  const [todasComunas, setTodasComunas] = useState([]);
  const [todosConsejos, setTodosConsejos] = useState([]);
  const [todosVoceros, setTodosVoceros] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState("");
  const [perteneceComunaCircuito, setPerteneceComunaCircuito] = useState("");

  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [validarCedula, setValidarCedula] = useState(false);
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarNombreDos, setValidarNombreDos] = useState(false);
  const [validarApellido, setValidarApellido] = useState(false);
  const [validarApellidoDos, setValidarApellidoDos] = useState(false);
  const [validarEdad, setValidarEdad] = useState(false);
  const [validarTelefono, setValidarTelefono] = useState(false);

  const [validarCorreo, setValidarCorreo] = useState(false);
  const [validarActividadLaboral, setValidarActividadLaboral] = useState(false);

  const [nombreParroquia, setNombreParroquia] = useState("");
  const [nombreComuna, setNombreComuna] = useState("");
  const [nombreConsejoComunal, setNombreConsejoComunal] = useState("");
  const [nombreFormacion, setNombreFormacion] = useState("");

  const [accion, setAccion] = useState("");
  const [datos, setDatos] = useState("");

  const [seleccionarConsulta, setSeleccionarConsulta] = useState("");

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [
          parroquiasRes,
          comunasRes,
          consejosRes,
          cargosRes,
          formacionesRes,
        ] = await Promise.all([
          axios.get("/api/parroquias/todas-parroquias"),
          axios.get("/api/comunas/todas-comunas"),
          axios.get("/api/consejos/todos-consejos-comunales"),
          axios.get("/api/cargos/todos-cargos"),
          axios.get("/api/formaciones/todas-formaciones"),
        ]);

        setTodasParroquias(parroquiasRes.data.parroquias || []);
        setTodasComunas(comunasRes.data.comunas || []);
        setTodosConsejos(consejosRes.data.consejos || []);
        setCargos(cargosRes.data.cargos || []);
        setFormaciones(formacionesRes.data.formaciones || []);
      } catch (error) {
        console.log("Error, al obtener datos: " + error);
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    if (!idConsejoComunal) {
      setTodosVoceros([]);
      return;
    }

    const fetchVocerosPorConsejo = async () => {
      setIsLoading(true);
      try {
        let response = await axios.get(
          `/api/voceros/consejo-comunal-vocero-id`,
          {
            params: { idConsejo: idConsejoComunal },
          }
        );

        setTodosVoceros(response?.data?.voceros);
      } catch (error) {
        console.log(
          "Error, al obtener los voceros por consejo comunal: " + error
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (accion !== "editar") {
      fetchVocerosPorConsejo();
    }
  }, [idConsejoComunal]);

  useEffect(() => {
    if (!idConsejoComunal && !idComuna && accion !== "editar") {
      setTodosVoceros([]);
      setCedulaVocero("");
      setEdadVocero("");
      setNombreVocero("");
      setNombreDosVocero("");
      setApellidoVocero("");
      setApellidoDosVocero("");
      setCedulaVocero("");
      setGeneroVocero("");
      setEdadVocero("");
      setTelefonoVocero("");
      setDireccionVocero("");
      setCorreoVocero("");
      setActividadLaboralVocero("");
    }
  }, [idComuna, idConsejoComunal]);

  useEffect(() => {
    console.log("ajklsdfhoashdokasj");

    setTodosVoceros([]);
    setIdParroquia("");
    setIdComuna("");
    setCircuitoComuna("");
    setIdConsejoComunal("");
    setTodosVoceros([]);
    setNombreVocero("");
    setNombreDosVocero("");
    setApellidoVocero("");
    setApellidoDosVocero("");
    setCedulaVocero("");
    setGeneroVocero("");
    setEdadVocero("");
    setTelefonoVocero("");
    setDireccionVocero("");
    setCorreoVocero("");
    setActividadLaboralVocero("");
  }, [seleccionarConsulta]);

  useEffect(() => {
    if (!idParroquia) {
      setTodosVoceros([]);

      return;
    }

    const fetchVoceroPorParroquia = async () => {
      setIsLoading(true);
      try {
        let response = await axios.get(`/api/voceros/parroquia-vocero-id`, {
          params: { idParroquia: idParroquia },
        });

        setTodosVoceros(response?.data?.voceros);
      } catch (error) {
        console.log("Error, al obtener los voceros por parroquia: " + error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accion !== "editar") {
      fetchVoceroPorParroquia();
    }
  }, [idParroquia]);

  useEffect(() => {
    if (!idComuna) {
      setTodosVoceros([]);

      return;
    }

    const fetchVoceroPorComuna = async () => {
      setIsLoading(true);
      try {
        let response = await axios.get(`/api/voceros/comuna-vocero-id`, {
          params: { idComuna: idComuna },
        });

        setTodosVoceros(response?.data?.voceros);
      } catch (error) {
        console.log("Error, al obtener los voceros por comuna: " + error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accion !== "editar") {
      fetchVoceroPorComuna();
    }
  }, [idComuna]);

  useEffect(() => {
    /**
      if (seleccionarConsulta !== 5) {
        setTodosVoceros([]);
        return;
      }
    */

    const fetchTodosVoceros = async () => {
      setIsLoading(true);
      try {
        let response = await axios.get(`/api/voceros/todos-voceros`);

        setTodosVoceros(response?.data?.voceros);
      } catch (error) {
        console.log("Error, al obtener todos los voceros: " + error);
      } finally {
        setIsLoading(false);
      }
    };

    if (seleccionarConsulta === 5 && accion !== "editar") {
      fetchTodosVoceros();
    }
  }, [seleccionarConsulta]);

  const toggleGenero = (id) => {
    setGeneroVocero(generoVocero === id ? null : id); // Cambia el estado, permitiendo deselección
  };

  const cambiarDondeGuardar = (e) => {
    const valor = e.target.value;
    setCircuitoComuna(valor);
  };

  const cambiarDondeCrear = (e) => {
    const valor = e.target.value;
    setPerteneceComunaCircuito(valor);
  };

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  /**
    const cambiarSeleccionComunaCircuito = (e) => {
      const valor = e.target.value;
      setIdComuna(valor);
    };
  */

  const cambiarSeleccionComunaCircuito = (e) => {
    const valor = e.target.value; // ID de la comuna seleccionada

    setIdComuna(valor);

    // Filtrar voceros por ID de la comuna
    const vocerosSeleccionados =
      todasComunas.find((comuna) => comuna.id === Number(valor))?.voceros || [];

    setTodosVoceros(vocerosSeleccionados);
  };

  const cambiarSeleccionConsejo = (e) => {
    const valor = e.target.value;
    setIdConsejoComunal(valor);
  };

  const toggleCargos = (id) => {
    setSeleccionarCargo((prev) =>
      prev.includes(id) ? prev.filter((cargo) => cargo !== id) : [...prev, id]
    );
  };

  const toggleFormacion = (id, nombre) => {
    setNombreFormacion(nombre);
    setSeleccionarFormacion((prev) =>
      prev.includes(id)
        ? prev.filter((formacion) => formacion !== id)
        : [...prev, id]
    );
  };

  /**
    // esto es en caso que solo se vaya a seleccionar una formacion
    const toggleFormacion = (id) => {
      setSeleccionarFormacion((formacion) => (formacion === id ? null : id));
    };
  */

  const crearVocero = async () => {
    if (nombreVocero.trim()) {
      try {
        const data = {
          nombre: nombreVocero.trim(),
          nombre_dos: nombreDosVocero,
          apellido: apellidoVocero.trim(),
          apellido_dos: apellidoDosVocero,
          cedula: cedulaVocero,
          genero: generoVocero,
          edad: Number(edadVocero),
          telefono: telefonoVocero,
          direccion: "No especificada",
          correo: correoVocero.trim(),
          laboral: actividadLaboralVocero,
          cargos:
            seleccionarCargo.length > 0
              ? seleccionarCargo.map((id) => ({ id }))
              : [],
          formaciones:
            seleccionarFormacion.length > 0
              ? seleccionarFormacion.map((id) => ({ id }))
              : [],

          id_parroquia: datos.id_parroquia || null,
          id_comuna: circuitoComuna === 1 ? datos.id : datos.id_comuna,
          id_circuito: circuitoComuna === 2 ? datos.id_circuito || null : null,
          id_consejo: circuitoComuna === 3 ? datos.id : null,
        };

        const response = await axios.post("/api/voceros/crear-vocero", data);

        setTodosVoceros([...todosVoceros, response.data.vocero]);
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCedulaVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setEdadVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreDosVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setApellidoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setApellidoDosVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setGeneroVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setTelefonoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCorreoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setActividadLaboralVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear el vocero: " + error);
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

  const getTitulo = (accion) => {
    switch (accion) {
      case 2:
        return "Voceros por parroquia";
      case 3:
        return "Voceros por comuna";
      case 4:
        return "Voceros por consejo comunal";
      case 5:
        return "Todos los voceros";
      case 6:
        return "Vocero por cédula";
      default:
        return ""; // Or a default title if none of the cases match
    }
  };

  const consultarVoceroCedula = async () => {
    try {
      const response = await axios.post("/api/voceros/cedula-vocero", {
        cedula: cedulaVocero,
      });

      setTodosVoceros(response.data.vocero);

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al consultar vocero: " + error);
      abrirMensaje(error?.response?.data.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
      setTodosVoceros([]);
    }
  };

  const editando = async (datos) => {
    try {
      setAccion("editar");
      setIdComuna(datos.comunas.id);
      setIdCircuito(datos.circuito ? datos.circuito.id : "");
      setIdParroquia(datos.comunas.id_parroquia);

      setCedulaVocero(datos.cedula);
      setEdadVocero(datos.edad);
      setNombreVocero(datos.nombre);
      setNombreDosVocero(datos.nombre_dos);

      setApellidoVocero(datos.apellido);
      setApellidoDosVocero(datos.apellido_dos);

      setGeneroVocero(datos.genero ? 1 : 2);
      setTelefonoVocero(datos.telefono);

      setDireccionVocero(datos.direccion);
      setCorreoVocero(datos.correo);
      setActividadLaboralVocero(datos.laboral);

      abrirModal();
      console.log(datos);
    } catch (error) {
      console.log("Error, editando vocero: " + error);
    }
  };

  const editar = async () => {
    if (nombreVocero.trim()) {
      try {
        const data = {
          nombre: nombreVocero.trim(),
          nombre_dos: nombreDosVocero,
          apellido: apellidoVocero.trim(),
          apellido_dos: apellidoDosVocero,
          cedula: cedulaVocero,
          genero: generoVocero,
          edad: Number(edadVocero),
          telefono: telefonoVocero,
          direccion: "No especificada",
          correo: correoVocero.trim(),
          laboral: actividadLaboralVocero,
          cargos:
            seleccionarCargo.length > 0
              ? seleccionarCargo.map((id) => ({ id }))
              : [],
          formaciones:
            seleccionarFormacion.length > 0
              ? seleccionarFormacion.map((id) => ({ id }))
              : [],

          id_parroquia: idParroquia,
          id_comuna: idComuna,
          id_circuito: idCircuito ? idCircuito : null,
          id_consejo: idConsejoComunal ? idConsejoComunal : null,
        };

        const response = await axios.post(
          "/api/voceros/actualizar-datos-vocero",
          data
        );

        if (todosVoceros?.length > 1) {
          setTodosVoceros((voceros) => {
            const arrayVoceros = Array.isArray(voceros) ? voceros : [];
            return arrayVoceros.map((vocero) =>
              vocero.cedula === response.data.vocero.cedula
                ? response.data.vocero
                : vocero
            );
          });
        } else {
          setTodosVoceros(response.data.vocero);
        }

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCedulaVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setEdadVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreDosVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setApellidoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setApellidoDosVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setGeneroVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setTelefonoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCorreoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setActividadLaboralVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del vocero: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  console.log(circuitoComuna);

  return (
    <>
      {accion === "editar" ? (
        <ModalEditar
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"Editar vocero"}
        >
          <div className="-mt-5 w-full">
            <FormEditarVocero
              idComuna={idComuna}
              idConsejo={idConsejoComunal}
              cambiarSeleccionComuna={cambiarSeleccionComunaCircuito}
              cambiarSeleccionConsejo={cambiarSeleccionConsejo}
              toggleGenero={toggleGenero}
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
              todasComunas={todasComunas}
              todosConsejos={todosConsejos}
              cargos={cargos}
              toggleCargo={toggleCargos}
              formaciones={formaciones}
              toggleFormaciones={toggleFormacion}
              seleccionarCargo={seleccionarCargo}
              setSeleccionarCargo={setSeleccionarCargo}
              seleccionarFormacion={seleccionarFormacion}
              setSeleccionarFormacion={setSeleccionarFormacion}
              abrirModal={abrirModal}
              limpiarCampos={limpiarCampos}
              setNombreComuna={setNombreComuna}
              setNombreConsejoComunal={setNombreConsejoComunal}
              validarCedula={validarCedula}
              setValidarCedula={setValidarCedula}
              validarNombre={validarNombre}
              setValidarNombre={setValidarNombre}
              validarNombreDos={validarNombreDos}
              setValidarNombreDos={setValidarNombreDos}
              validarApellido={validarApellido}
              setValidarApellido={setValidarApellido}
              validarApellidoDos={validarApellidoDos}
              setValidarApellidoDos={setValidarApellidoDos}
              validarEdad={validarEdad}
              setValidarEdad={setValidarEdad}
              validarTelefono={validarTelefono}
              setValidarTelefono={setValidarTelefono}
              validarCorreo={validarCorreo}
              setValidarCorreo={setValidarCorreo}
              validarActividadLaboral={validarActividadLaboral}
              setValidarActividadLaboral={setValidarActividadLaboral}
              setDatos={setDatos}
              mostrarMensaje={mostrarMensaje}
              mensaje={mensaje}
              editar={editar}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este vocero?"}
        >
          <>
            <ModalDatosContenedor>
              <ModalDatos titulo={"Cedula"} descripcion={cedulaVocero} />
              <ModalDatos titulo={"Edad"} descripcion={edadVocero} />
              <ModalDatos titulo={"Primer nombre"} descripcion={nombreVocero} />
              <ModalDatos
                titulo={"Segundo nombre"}
                descripcion={nombreDosVocero}
              />
              <ModalDatos
                titulo={"Primer apellido"}
                descripcion={apellidoVocero}
              />
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

              <ModalDatos titulo={"Formación"} descripcion={nombreFormacion} />
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

            <MostarMsjEnModal
              mostrarMensaje={mostrarMensaje}
              mensaje={mensaje}
            />
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
                idComuna,
                idConsejoComunal,
              }}
            />
          </>
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar>
          <div className="w-full bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl p-6">
            <div className="w-full text-center mb-2">
              <Titulos indice={3} titulo={"Opciones vocero"} />
            </div>

            <div
              className="grid gap-4 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3"
            >
              <div className="w-full">
                <InputCheckBox
                  id={1}
                  isChecked={seleccionarConsulta === 1}
                  onToggle={toggleConsultar}
                  nombre="Crear"
                />
              </div>

              <div className="w-full">
                <InputCheckBox
                  id={6}
                  isChecked={seleccionarConsulta === 6}
                  onToggle={toggleConsultar}
                  nombre="Por cédula"
                />
              </div>

              <div className="w-full">
                <InputCheckBox
                  id={2}
                  isChecked={seleccionarConsulta === 2}
                  onToggle={toggleConsultar}
                  nombre="Por parroquia"
                />
              </div>

              <div className="w-full">
                <InputCheckBox
                  id={3}
                  isChecked={seleccionarConsulta === 3}
                  onToggle={toggleConsultar}
                  nombre="Por comuna"
                />
              </div>

              <div className="w-full">
                <InputCheckBox
                  id={4}
                  isChecked={seleccionarConsulta === 4}
                  onToggle={toggleConsultar}
                  nombre="Por consejo comunal"
                />
              </div>

              <div className="w-full">
                <InputCheckBox
                  id={5}
                  isChecked={seleccionarConsulta === 5}
                  onToggle={toggleConsultar}
                  nombre="Todos"
                />
              </div>
            </div>
          </div>
        </DivUnoDentroSectionRegistroMostrar>

        {seleccionarConsulta === 1 && (
          <>
            <DivUnoDentroSectionRegistroMostrar nombre={"Crear vocero"}>
              <FormCrearVocero
                idParroquia={idParroquia}
                idComuna={idComuna}
                idConsejo={idConsejoComunal}
                cambiarSeleccionParroquia={cambiarSeleccionParroquia}
                cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
                cambiarSeleccionConsejo={cambiarSeleccionConsejo}
                cambiarDondeGuardar={cambiarDondeGuardar}
                cambiarDondeCrear={cambiarDondeCrear}
                toggleGenero={toggleGenero}
                parroquias={todasParroquias}
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
                seleccionarFormacion={seleccionarFormacion}
                formaciones={formaciones}
                toggleFormaciones={toggleFormacion}
                abrirModal={abrirModal}
                limpiarCampos={limpiarCampos}
                setNombreComuna={setNombreComuna}
                setNombreConsejoComunal={setNombreConsejoComunal}
                validarCedula={validarCedula}
                setValidarCedula={setValidarCedula}
                validarNombre={validarNombre}
                setValidarNombre={setValidarNombre}
                validarNombreDos={validarNombreDos}
                setValidarNombreDos={setValidarNombreDos}
                validarApellido={validarApellido}
                setValidarApellido={setValidarApellido}
                validarApellidoDos={validarApellidoDos}
                setValidarApellidoDos={setValidarApellidoDos}
                validarEdad={validarEdad}
                setValidarEdad={setValidarEdad}
                validarTelefono={validarTelefono}
                setValidarTelefono={setValidarTelefono}
                validarCorreo={validarCorreo}
                setValidarCorreo={setValidarCorreo}
                validarActividadLaboral={validarActividadLaboral}
                setValidarActividadLaboral={setValidarActividadLaboral}
                setDatos={setDatos}
              />
            </DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 2 && (
          <>
            <DivUnoDentroSectionRegistroMostrar
              nombre={getTitulo(seleccionarConsulta)}
            >
              <SelectOpcion
                idOpcion={idParroquia}
                nombre={"Parroquia"}
                handleChange={cambiarSeleccionParroquia}
                opciones={todasParroquias}
                seleccione={"Seleccione"}
                setNombre={setNombreParroquia}
                setDatos={setDatos}
                indice={1}
              />
            </DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 3 && (
          <>
            <DivUnoDentroSectionRegistroMostrar
              nombre={getTitulo(seleccionarConsulta)}
            >
              <SelectOpcion
                idOpcion={idComuna}
                nombre={"Comunas"}
                handleChange={cambiarSeleccionComunaCircuito}
                opciones={todasComunas}
                seleccione={"Seleccione"}
                setNombre={setNombreComuna}
                setDatos={setDatos}
                indice={1}
              />
            </DivUnoDentroSectionRegistroMostrar>
            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 4 && (
          <>
            <DivUnoDentroSectionRegistroMostrar
              nombre={getTitulo(seleccionarConsulta)}
            >
              <SelectOpcion
                idOpcion={idComuna}
                nombre={"Consejos comunales"}
                handleChange={cambiarSeleccionConsejo}
                opciones={todosConsejos}
                seleccione={"Seleccione"}
                setNombre={setNombreConsejoComunal}
                setDatos={setDatos}
                indice={1}
              />
            </DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 5 && (
          <>
            <DivUnoDentroSectionRegistroMostrar
              nombre={getTitulo(seleccionarConsulta)}
            ></DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 6 && (
          <>
            <DivUnoDentroSectionRegistroMostrar
              nombre={getTitulo(seleccionarConsulta)}
            >
              <div className="w-full flex flex-col justify-center sm:flex-row items-center sm:space-x-4 p-2 bg-gray-100 shadow-lg rounded-md border border-gray-300 ">
                <div className="w-full">
                  <InputCedula
                    type={"text"}
                    indice={"cedula"}
                    value={cedulaVocero}
                    setValue={setCedulaVocero}
                    validarCedula={validarCedula}
                    setValidarCedula={setValidarCedula}
                  />
                </div>
                <div className="w-1/3">
                  <Boton
                    disabled={!cedulaVocero}
                    nombre={"Consultar"}
                    onClick={() => {
                      consultarVoceroCedula();
                    }}
                    className={`color-fondo text-white`}
                  />
                </div>
              </div>
            </DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}
      </SectionRegistroMostrar>
    </>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Modal from "../Modal";
// import ModalDatos from "../ModalDatos";
// import SectionRegistroMostrar from "../SectionRegistroMostrar";
// import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
// import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
// import MostarMsjEnModal from "../MostrarMsjEnModal";
// import BotonesModal from "../BotonesModal";
// import FormCrearVocero from "../formularios/FormCrearVocero";
// import ListadoGenaral from "../ListadoGeneral";
// import ModalDatosContenedor from "../ModalDatosContenedor";

// export default function VoceroForm({
//   mostrar,
//   abrirModal,
//   cerrarModal,
//   mensaje,
//   mostrarMensaje,
//   abrirMensaje,
//   limpiarCampos,
//   ejecutarAccionesConRetraso,
// }) {
//   const [nombreVocero, setNombreVocero] = useState("");
//   const [nombreDosVocero, setNombreDosVocero] = useState("");
//   const [apellidoVocero, setApellidoVocero] = useState("");
//   const [apellidoDosVocero, setApellidoDosVocero] = useState("");
//   const [cedulaVocero, setCedulaVocero] = useState("");
//   const [generoVocero, setGeneroVocero] = useState("");
//   const [edadVocero, setEdadVocero] = useState("");
//   const [telefonoVocero, setTelefonoVocero] = useState("");
//   const [direccionVocero, setDireccionVocero] = useState("");
//   const [correoVocero, setCorreoVocero] = useState("");
//   const [actividadLaboralVocero, setActividadLaboralVocero] = useState("");

//   const [seleccionarCargo, setSeleccionarCargo] = useState([]);
//   const [seleccionarFormacion, setSeleccionarFormacion] = useState([]);

//   const [idParroquia, setIdParroquia] = useState("");
//   const [idComuna, setIdComuna] = useState("");
//   const [idConsejoComunal, setIdConsejoComunal] = useState("");

//   const [parroquias, setTodasParroquias] = useState([]);
//   const [cargos, setCargos] = useState([]);
//   const [formaciones, setFormaciones] = useState([]);

//   const [todasComunas, setTodasComunas] = useState([]);
//   const [todosConsejos, setTodosConsejos] = useState([]);
//   const [todosVoceros, setTodosVoceros] = useState([]);

//   const [circuitoComuna, setCircuitoComuna] = useState("");
//   const [perteneceComunaCircuito, setPerteneceComunaCircuito] = useState("");

//   const [isLoading, setIsLoading] = useState(false); // Estado de carga
//   const [validarCedula, setValidarCedula] = useState(false);
//   const [validarNombre, setValidarNombre] = useState(false);
//   const [validarNombreDos, setValidarNombreDos] = useState(false);
//   const [validarApellido, setValidarApellido] = useState(false);
//   const [validarApellidoDos, setValidarApellidoDos] = useState(false);
//   const [validarEdad, setValidarEdad] = useState(false);
//   const [validarTelefono, setValidarTelefono] = useState(false);

//   const [validarCorreo, setValidarCorreo] = useState(false);
//   const [validarActividadLaboral, setValidarActividadLaboral] = useState(false);

//   const [nombreComuna, setNombreComuna] = useState("");
//   const [nombreConsejoComunal, setNombreConsejoComunal] = useState("");
//   const [nombreFormacion, setNombreFormacion] = useState("");

//   const [accion, setAccion] = useState("");

//   // Consultar parroquias al cargar el componente
//   useEffect(() => {
//     const fetchParroquias = async () => {
//       try {
//         const [parroquiasRes, cargosRes, formacionesRes] = await Promise.all([
//           axios.get("/api/parroquias/todas-parroquias"),
//           axios.get("/api/cargos/todos-cargos"),
//           axios.get("/api/formaciones/todas-formaciones"),
//         ]);

//         setTodasParroquias(parroquiasRes.data.parroquias || []);
//         setCargos(cargosRes.data.cargos || []);
//         setFormaciones(formacionesRes.data.formaciones || []);
//       } catch (error) {
//         console.log("Error, al obtener las parroquias: " + error);
//       }
//     };

//     fetchParroquias();
//   }, []);

//   useEffect(() => {
//     if (!idParroquia) {
//       setTodasComunas([]); // Vacía comunas si no hay parroquia seleccionada
//       setTodosConsejos([]);
//       setTodosConsejos([]);
//       setIdComuna("");
//       setIdConsejoComunal("");
//       return;
//     }

//     const fetchComunasCircuitosPorParroquia = async () => {
//       try {
//         let response;
//         if (circuitoComuna === 1 || perteneceComunaCircuito === 1) {
//           response = await axios.get(`/api/comunas/comunas-id`, {
//             params: { idParroquia: idParroquia },
//           });
//         } else if (circuitoComuna === 2 || perteneceComunaCircuito === 2) {
//           response = await axios.get(`/api/circuitos/circuitos-id`, {
//             params: { idParroquia: idParroquia },
//           });
//         }

//         setTodasComunas(
//           response?.data?.comunas || response?.data?.circuitos
//         );
//       } catch (error) {
//         console.log(
//           "Error, al obtener las comunas/circuitos por parroquia: " + error
//         );
//       }
//     };

//     fetchComunasCircuitosPorParroquia();
//   }, [idParroquia]);

//   useEffect(() => {
//     if (!idComuna) {
//       setTodosConsejos([]);
//       setTodosVoceros([]);
//       setIdComuna("");
//       setIdConsejoComunal("");
//       return;
//     }

//     const fetchConsejosPorComunaCircuito = async () => {
//       try {
//         let response;

//         if (circuitoComuna === 1) {
//           response = await axios.get(
//             `/api/consejos/consejos-comunales-id-comuna`,
//             {
//               params: { idComuna: idComuna },
//             }
//           );
//         } else if (circuitoComuna === 2) {
//           response = await axios.get(
//             `/api/consejos/consejos-comunales-id-circuito`,
//             {
//               params: { idCircuito: idComuna },
//             }
//           );
//         } else if (circuitoComuna === 3) {
//           if (perteneceComunaCircuito === 1) {
//             response = await axios.get(
//               `/api/consejos/consejos-comunales-id-comuna`,
//               {
//                 params: { idComuna: idComuna },
//               }
//             );
//           } else if (perteneceComunaCircuito === 2) {
//             response = await axios.get(
//               `/api/consejos/consejos-comunales-id-circuito`,
//               {
//                 params: { idCircuito: idComuna },
//               }
//             );
//           }
//         }

//         setTodosConsejos(response?.data?.consejos);
//       } catch (error) {
//         console.log(
//           "Error, al obtener las comunas/circuitos por parroquia: " + error
//         );
//       }
//     };

//     fetchConsejosPorComunaCircuito();
//   }, [idComuna]);

//   useEffect(() => {
//     if (!idConsejoComunal) {
//       setTodosConsejos([]);
//       setTodosVoceros([]);
//       setIdComuna("");
//       setIdConsejoComunal("");
//       return;
//     }

//     const fetchVocerosPorConsejo = async () => {
//       setIsLoading(true); // Activa la carga antes de la consulta
//       try {
//         let response = await axios.get(
//           `/api/voceros/vocero-consejo-comunal-id`,
//           {
//             params: { idConsejo: idConsejoComunal },
//           }
//         );

//         setTodosVoceros(response?.data?.voceros);
//       } catch (error) {
//         console.log(
//           "Error, al obtener los voceros por consejo comunal: " + error
//         );
//       } finally {
//         setIsLoading(false); // Solo desactiva la carga después de obtener los datos
//       }
//     };

//     fetchVocerosPorConsejo();
//   }, [idConsejoComunal]);

//   useEffect(() => {
//     setIdParroquia("");
//     setIdComuna("");
//     setIdConsejoComunal("");
//     setPerteneceComunaCircuito("");
//     setTodasComunas([]);
//     setTodosConsejos([]);
//     setTodosVoceros([]);
//     setNombreVocero("");
//   }, [circuitoComuna]);

//   useEffect(() => {
//     setIdParroquia("");
//     setIdComuna("");
//     setIdConsejoComunal("");
//     setTodasComunas([]);
//     setTodosConsejos([]);
//     setTodosVoceros([]);
//     setNombreVocero("");
//   }, [perteneceComunaCircuito]);

//   const toggleGenero = (id) => {
//     setGeneroVocero(generoVocero === id ? null : id); // Cambia el estado, permitiendo deselección
//   };

//   const cambiarDondeGuardar = (e) => {
//     const valor = e.target.value;
//     setCircuitoComuna(valor);
//   };

//   const cambiarDondeCrear = (e) => {
//     const valor = e.target.value;
//     setPerteneceComunaCircuito(valor);
//   };

//   const cambiarSeleccionParroquia = (e) => {
//     const valor = e.target.value;
//     setIdParroquia(valor);
//   };

//   /**
//     const cambiarSeleccionComunaCircuito = (e) => {
//       const valor = e.target.value;
//       setIdComuna(valor);
//     };
//   */

//   const cambiarSeleccionComunaCircuito = (e) => {
//     const valor = e.target.value; // ID de la comuna seleccionada

//     setIdComuna(valor);

//     // Filtrar voceros por ID de la comuna
//     const vocerosSeleccionados =
//       todasComunas.find((comuna) => comuna.id === Number(valor))
//         ?.voceros || [];

//     setTodosVoceros(vocerosSeleccionados);
//   };

//   const cambiarSeleccionConsejo = (e) => {
//     const valor = e.target.value;
//     setIdConsejoComunal(valor);
//   };

//   const toggleCargos = (id) => {
//     setSeleccionarCargo((prev) =>
//       prev.includes(id) ? prev.filter((cargo) => cargo !== id) : [...prev, id]
//     );
//   };

//   const toggleFormacion = (id, nombre) => {
//     setNombreFormacion(nombre);
//     setSeleccionarFormacion((prev) =>
//       prev.includes(id)
//         ? prev.filter((formacion) => formacion !== id)
//         : [...prev, id]
//     );
//   };

//   /**
//     // esto es en caso que solo se vaya a seleccionar una formacion
//     const toggleFormacion = (id) => {
//       setSeleccionarFormacion((formacion) => (formacion === id ? null : id));
//     };
//   */

//   const crearVocero = async () => {
//     if (nombreVocero.trim()) {
//       try {
//         // Verificación básica antes de enviar la solicitud
//         if (!nombreVocero.trim() || !idParroquia || !circuitoComuna) {
//           console.warn("Todos los campos obligatorios deben estar completos.");
//           return;
//         }

//         // Configurar valores según `circuitoComuna`
//         const config = {
//           1: {
//             pertenece: "comuna",
//             id_comuna: idComuna,
//             id_circuito: null,
//             id_consejo: null,
//           },
//           2: {
//             pertenece: "circuito",
//             id_comuna: null,
//             id_circuito: idComuna,
//             id_consejo: null,
//           },
//           3: {
//             pertenece: "consejo",
//             id_comuna: perteneceComunaCircuito === 1 ? idComuna : null,
//             id_circuito:
//               perteneceComunaCircuito === 2 ? idComuna : null,
//             id_consejo: idConsejoComunal,
//           },
//         };

//         // Datos generales del vocero
//         const data = {
//           nombre: nombreVocero.trim(),
//           nombre_dos: nombreDosVocero,
//           apellido: apellidoVocero.trim(),
//           apellido_dos: apellidoDosVocero,
//           cedula: cedulaVocero,
//           genero: generoVocero,
//           edad: Number(edadVocero),
//           telefono: telefonoVocero,
//           direccion: "No especificada",
//           correo: correoVocero.trim(),
//           laboral: actividadLaboralVocero,
//           cargos:
//             seleccionarCargo.length > 0
//               ? seleccionarCargo.map((id) => ({ id }))
//               : [],
//           formaciones:
//             seleccionarFormacion.length > 0
//               ? seleccionarFormacion.map((id) => ({ id }))
//               : [],
//           id_parroquia: idParroquia,
//           ...config[circuitoComuna], // Asignar valores específicos según `circuitoComuna`
//         };

//         const response = await axios.post("/api/voceros/crear-vocero", data);

//         setTodosVoceros([...todosVoceros, response.data.vocero]);
//         abrirMensaje(response.data.message);

//         ejecutarAccionesConRetraso([
//           { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setCedulaVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setEdadVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setNombreVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setNombreDosVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setApellidoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setApellidoDosVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setGeneroVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setTelefonoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setCorreoVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setActividadLaboralVocero(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//         ]);
//       } catch (error) {
//         console.log("Error, al crear el vocero: " + error);
//         abrirMensaje(error?.response?.data?.message);
//         ejecutarAccionesConRetraso([
//           { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//         ]);
//       }
//     } else {
//       console.log("Todos los campos son obligatorios.");
//     }
//   };

//   const editando = (datosVocero) => {
//     try {
//       setAccion("editar");
//       abrirModal();
//       setNombreVocero(datosVocero.nombre)
//       console.log("Datos del vocero: ");
//       console.log(datosVocero);
//     } catch (error) {
//       console.log("Error, al intentar editar vocero: " + error);
//     }
//   };

//   return (
//     <>
//       <Modal
//         isVisible={mostrar}
//         onClose={cerrarModal}
//         titulo={
//           accion === "editar" ? "¿Editar este vocero?" : "¿Crear este vocero?"
//         }
//       >
//         {accion === "editar" ? (
//           <ModalDatosContenedor>
//             <div>Hola mundo</div>
//           </ModalDatosContenedor>
//         ) : (
//           <ModalDatosContenedor>
//             <ModalDatos titulo={"Cedula"} descripcion={cedulaVocero} />
//             <ModalDatos titulo={"Edad"} descripcion={edadVocero} />
//             <ModalDatos titulo={"Primer nombre"} descripcion={nombreVocero} />
//             <ModalDatos
//               titulo={"Segundo nombre"}
//               descripcion={nombreDosVocero}
//             />
//             <ModalDatos
//               titulo={"Primer apellido"}
//               descripcion={apellidoVocero}
//             />
//             <ModalDatos
//               titulo={"Segundo apellido"}
//               descripcion={apellidoDosVocero}
//             />

//             <ModalDatos
//               titulo={"Genero"}
//               descripcion={generoVocero == 1 ? "Masculino" : "Femenino"}
//             />
//             <ModalDatos titulo={"Telefono"} descripcion={telefonoVocero} />

//             <ModalDatos titulo={"Correo"} descripcion={correoVocero} />
//             <ModalDatos
//               titulo={"Actividad laboral"}
//               descripcion={actividadLaboralVocero}
//             />

//             <ModalDatos titulo={"Formación"} descripcion={nombreFormacion} />
//             <ModalDatos
//               titulo={"Actividad laboral"}
//               descripcion={actividadLaboralVocero}
//             />

//             <ModalDatos titulo={"Comuna"} descripcion={nombreComuna} />
//             {nombreConsejoComunal && (
//               <ModalDatos
//                 titulo={"Consejo comunal"}
//                 descripcion={nombreConsejoComunal}
//               />
//             )}
//           </ModalDatosContenedor>
//         )}

//         <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
//         <BotonesModal
//           aceptar={crearVocero}
//           cancelar={cerrarModal}
//           indiceUno={"crear"}
//           indiceDos={"cancelar"}
//           nombreUno={"Aceptar"}
//           nombreDos={"Cancelar"}
//           campos={{
//             nombreVocero,
//             idParroquia,
//             idComuna,
//             idConsejoComunal,
//           }}
//         />
//       </Modal>
//       <SectionRegistroMostrar>
//         <DivUnoDentroSectionRegistroMostrar nombre={"Crear vocero"}>
//           <FormCrearVocero
//             idParroquia={idParroquia}
//             idComuna={idComuna}
//             idConsejo={idConsejoComunal}
//             cambiarSeleccionParroquia={cambiarSeleccionParroquia}
//             cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
//             cambiarSeleccionConsejo={cambiarSeleccionConsejo}
//             cambiarDondeGuardar={cambiarDondeGuardar}
//             cambiarDondeCrear={cambiarDondeCrear}
//             toggleGenero={toggleGenero}
//             parroquias={parroquias}
//             comunasCircuitos={todasComunas}
//             consejos={todosConsejos}
//             dondeGuardar={circuitoComuna}
//             dondeCrear={perteneceComunaCircuito}
//             setDondeGuardar={setCircuitoComuna}
//             nombre={nombreVocero}
//             setNombre={setNombreVocero}
//             nombreDos={nombreDosVocero}
//             setNombreDos={setNombreDosVocero}
//             apellido={apellidoVocero}
//             setApellido={setApellidoVocero}
//             apellidoDos={apellidoDosVocero}
//             setApellidoDos={setApellidoDosVocero}
//             cedula={cedulaVocero}
//             setCedula={setCedulaVocero}
//             genero={generoVocero}
//             setGenero={setGeneroVocero}
//             edad={edadVocero}
//             setEdad={setEdadVocero}
//             telefono={telefonoVocero}
//             setTelefono={setTelefonoVocero}
//             direccion={direccionVocero}
//             setDireccion={setDireccionVocero}
//             correo={correoVocero}
//             setCorreo={setCorreoVocero}
//             actividadLaboral={actividadLaboralVocero}
//             setActividadLaboral={setActividadLaboralVocero}
//             seleccionarCargo={seleccionarCargo}
//             setSeleccionarCargo={setSeleccionarCargo}
//             cargos={cargos}
//             toggleCargo={toggleCargos}
//             seleccionarFormacion={seleccionarFormacion}
//             formaciones={formaciones}
//             toggleFormaciones={toggleFormacion}
//             abrirModal={abrirModal}
//             limpiarCampos={limpiarCampos}
//             setNombreComuna={setNombreComuna}
//             setNombreConsejoComunal={setNombreConsejoComunal}
//             validarCedula={validarCedula}
//             setValidarCedula={setValidarCedula}
//             validarNombre={validarNombre}
//             setValidarNombre={setValidarNombre}
//             validarNombreDos={validarNombreDos}
//             setValidarNombreDos={setValidarNombreDos}
//             validarApellido={validarApellido}
//             setValidarApellido={setValidarApellido}
//             validarApellidoDos={validarApellidoDos}
//             setValidarApellidoDos={setValidarApellidoDos}
//             validarEdad={validarEdad}
//             setValidarEdad={setValidarEdad}
//             validarTelefono={validarTelefono}
//             setValidarTelefono={setValidarTelefono}
//             validarCorreo={validarCorreo}
//             setValidarCorreo={setValidarCorreo}
//             validarActividadLaboral={validarActividadLaboral}
//             setValidarActividadLaboral={setValidarActividadLaboral}
//           />
//         </DivUnoDentroSectionRegistroMostrar>

//         <DivDosDentroSectionRegistroMostrar>
//           <ListadoGenaral
//             isLoading={isLoading}
//             listado={todosVoceros}
//             nombreListado={"Voceros"}
//             mensajeVacio={"No hay voceros disponibles..."}
//             editar={editando}
//           />
//         </DivDosDentroSectionRegistroMostrar>
//       </SectionRegistroMostrar>
//     </>
//   );
// }

function EditarVocero({}) {}

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Modal from "../Modal";
// import ModalDatos from "../ModalDatos";
// import ModalDatosCargos from "../ModalDatosCargos";
// import Boton from "../Boton";
// import VocerosFormMostrar from "./VocerosFormMostrar";

// export default function VoceroForm({
//   mostrar,
//   abrirModal,
//   cerrarModal,
//   mensaje,
//   mostrarMensaje,
//   abrirMensaje,
//   limpiarCampos,
// }) {
//   // Estados para los selectores
//   const [nombreVocero, setNombreVocero] = useState("");

//   const [nombreDosVocero, setNombreDosVocero] = useState("");
//   const [apellidoVocero, setApellidoVocero] = useState("");
//   const [apellidoDosVocero, setApellidoDosVocero] = useState("");
//   const [cedulaVocero, setCedulaVocero] = useState("");
//   const [generoVocero, setGeneroVocero] = useState("");
//   const [edadVocero, setEdadVocero] = useState("");
//   const [telefonoVocero, setTelefonoVocero] = useState("");
//   const [direccionVocero, setDireccionVocero] = useState("");
//   const [correoVocero, setCorreoVocero] = useState("");

//   const [proyectoVocero, setProyectoVocero] = useState("");
//   const [verificadoVocero, setVerificadoVocero] = useState("");
//   const [certificadoVocero, setCertificadoVocero] = useState("");

//   const [idParroquia, setIdParroquia] = useState("");
//   const [idComuna, setIdComuna] = useState("");
//   const [idConsejoComunal, setIdConsejoComunal] = useState("");

//   // Estados para almacenar datos consultados
//   const [parroquias, setTodasParroquias] = useState([]);
//   const [comunas, setComunas] = useState([]);

//   const [consejoPorComuna, setConsejoPorComuna] = useState([]);
//   const [cargos, setCargos] = useState([]);
//   const [vocerosPorConsejo, setVocerosPorConsejo] = useState([]);

//   const [circuitoComuna, setCircuitoComuna] = useState(0);

//   const [idCrearEnComunaCircuito, setIdCrearEnComunaCircuito] = useState("");

//   const [selectedCargos, setSelectedCargos] = useState([]);

//   const toggleCargo = (id) => {
//     setSelectedCargos((prev) =>
//       prev.includes(id) ? prev.filter((cargo) => cargo !== id) : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [parroquiasRes, cargosRes] = await Promise.all([
//           axios.get("/api/parroquias/todas-parroquias"),
//           axios.get("/api/cargos/todos-cargos"),
//         ]);

//         setTodasParroquias(parroquiasRes.data.parroquias || []);
//         setCargos(cargosRes.data.cargos || []);
//       } catch (error) {
//         console.log("Error, al obtener datos (parroquias, cargos): " + error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     setIdParroquia("");
//     setIdComuna("");
//     setIdConsejoComunal("");
//     setIdCrearEnComunaCircuito("");
//   }, [circuitoComuna]);

//   useEffect(() => {
//     setIdParroquia("");
//     setIdComuna("");
//     setIdConsejoComunal("");
//   }, [idCrearEnComunaCircuito]);

//   const fetchComunas = async (parroquiaId) => {
//     try {
//       setIdParroquia(parroquiaId);
//       setIdComuna(""); // Resetear comuna cuando cambia la parroquia
//       setIdConsejoComunal("");

//       if (!parroquiaId) {
//         setComunas([]);
//         return;
//       }

//       let response;
//       if (circuitoComuna === 1 || idCrearEnComunaCircuito === "Comuna") {
//         response = await axios.get(`/api/comunas/comunas-id`, {
//           params: { idParroquia: parroquiaId },
//         });
//       } else if (
//         circuitoComuna === 2 ||
//         idCrearEnComunaCircuito === "Circuito"
//       ) {
//         response = await axios.get(`/api/circuitos/circuitos-id`, {
//           params: { idParroquia: parroquiaId },
//         });
//       }

//       setComunas(response?.data?.comunas || response?.data?.circuitos);
//     } catch (error) {
//       console.log("Error al obtener comunas o circuitos:", error);
//     }
//   };

//   const fetchConsejoComunal = async (consejoId) => {
//     try {
//       //setIdComuna(""); // Resetear comuna cuando cambia la parroquia
//       setIdConsejoComunal("");

//       setIdComuna(consejoId);

//       if (!consejoId) {
//         setConsejoPorComuna([]);
//         return;
//       }

//       let response;
//       if (idCrearEnComunaCircuito === "Comuna") {
//         response = await axios.get(
//           `/api/consejos/consejos-comunales-id-comuna`,
//           {
//             params: { idComuna: consejoId },
//           }
//         );
//       } else if (idCrearEnComunaCircuito === "Circuito") {
//         response = await axios.get(
//           `/api/consejos/consejos-comunales-id-circuito`,
//           {
//             params: { idCircuito: consejoId },
//           }
//         );
//       }

//       //setComunas(response?.data?.comunas || response?.data?.circuitos);

//       setConsejoPorComuna(response?.data?.consejos);
//     } catch (error) {
//       console.log("Error al obtener consejos por id: " + error);
//     }
//   };

//   const fetchVoceroConsejoComunal = async (consejoId) => {
//     try {
//       setIdConsejoComunal(consejoId);

//       //setIdConsejoComunal("");

//       if (!consejoId) {
//         setVocerosPorConsejo([]);
//         return;
//       }

//       const response = await axios.get(
//         `/api/voceros/vocero-consejo-comunal-id`,
//         {
//           params: { idConsejo: consejoId },
//         }
//       );

//       setVocerosPorConsejo(response?.data?.voceros);
//     } catch (error) {
//       console.log("Error al obtener voceros consejo comunal: " + error);
//     }
//   };

//   const crearVocero = async () => {
//     if (nombreVocero.trim() && idParroquia.trim() && idComuna.trim()) {
//       try {
//         // Verificación básica antes de enviar la solicitud
//         if (!nombreVocero.trim() || !idParroquia || !circuitoComuna) {
//           console.warn("Todos los campos obligatorios deben estar completos.");
//           return;
//         }

//         // Configurar valores según `circuitoComuna`
//         const config = {
//           1: {
//             pertenece: "comuna",
//             id_comuna: idComuna,
//             id_circuito: null,
//             id_consejo: null,
//           },
//           2: {
//             pertenece: "circuito",
//             id_comuna: null,
//             id_circuito: idComuna,
//             id_consejo: null,
//           },
//           3: {
//             pertenece: "consejo",
//             id_comuna: idCrearEnComunaCircuito === "Comuna" ? idComuna : null,
//             id_circuito:
//               idCrearEnComunaCircuito === "Circuito" ? idComuna : null,
//             id_consejo: idConsejoComunal,
//           },
//         };

//         // Datos generales del vocero
//         const data = {
//           nombre: nombreVocero.trim(),
//           nombre_dos: nombreDosVocero.trim(),
//           apellido: apellidoVocero.trim(),
//           apellido_dos: apellidoDosVocero.trim(),
//           cedula: Number(cedulaVocero), // Convertir a número
//           genero: generoVocero,
//           edad: Number(edadVocero),
//           telefono: telefonoVocero,
//           direccion: direccionVocero || "No especificada",
//           correo: correoVocero.trim(),
//           proyecto: proyectoVocero === "1" ? "1" : "2",
//           certificado: certificadoVocero === "1" ? "1" : "2",
//           verificado: verificadoVocero === "1" ? "1" : "2",
//           borrado: false,
//           cargos:
//             selectedCargos.length > 0
//               ? selectedCargos.map((id) => ({ id }))
//               : [],
//           id_parroquia: idParroquia,
//           ...config[circuitoComuna], // Asignar valores específicos según `circuitoComuna`
//         };

//         // Enviar datos al backend
//         const response = await axios.post("/api/voceros/crear-vocero", data);

//         // Actualizar estado
//         setVocerosPorConsejo(response?.data?.vocero);
//         setNombreVocero("");

//         console.log("Vocero creado con éxito:", response.data);
//       } catch (error) {
//         console.error(
//           "Error al crear vocero:",
//           error.response?.data || error.message
//         );
//       }
//     } else {
//       console.warn("Todos los campos son obligatorios.");
//     }
//   };

//   return (
//     <>
//       <Modal
//         isVisible={mostrar}
//         onClose={cerrarModal}
//         titulo={"¿Crear este vocero?"}
//       >
//         <div className="flex flex-col justify-center items-center space-y-1 pb-4">
//           <ModalDatos titulo={"Nombre"} descripcion={nombreVocero} />
//           <ModalDatos titulo={"Segundo nombre"} descripcion={nombreDosVocero} />
//           <ModalDatos titulo={"Apellido"} descripcion={apellidoVocero} />
//           <ModalDatos
//             titulo={"Segundo apellido"}
//             descripcion={apellidoDosVocero}
//           />
//           <ModalDatos titulo={"Cedula"} descripcion={cedulaVocero} />
//           <ModalDatos
//             titulo={"Genero"}
//             descripcion={
//               generoVocero && generoVocero === 1 ? "Hombre" : "Mujer"
//             }
//           />
//           <ModalDatos titulo={"Edad"} descripcion={edadVocero} />
//           <ModalDatos titulo={"Telefono"} descripcion={telefonoVocero} />
//           <ModalDatos titulo={"Direccion"} descripcion={direccionVocero} />
//           <ModalDatos titulo={"Correo"} descripcion={correoVocero} />
//           <ModalDatos
//             titulo={"R. proyecto"}
//             descripcion={proyectoVocero && proyectoVocero === "1" ? "Si" : "No"}
//           />
//           <ModalDatos
//             titulo={"Verificado"}
//             descripcion={
//               verificadoVocero && verificadoVocero === "1" ? "Si" : "No"
//             }
//           />
//           <ModalDatos
//             titulo={"Certificado"}
//             descripcion={
//               certificadoVocero && certificadoVocero === "1" ? "Si" : "No"
//             }
//           />
//           <ModalDatosCargos
//             nombre={"Cargos"}
//             cargos={cargos}
//             todosCargos={selectedCargos}
//           />
//         </div>

//         <div className="flex space-x-2 px-10">
//           <Boton
//             className={`py-2`}
//             nombre={"Aceptar"}
//             onClick={() => {
//               crearVocero();
//               setMostrar(false);
//             }}
//           />

//           <Boton
//             className={`py-2`}
//             nombre={"Cancelar"}
//             onClick={() => {
//               setMostrar(false);
//             }}
//           />
//         </div>
//       </Modal>

//       <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
//         <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
//           <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
//             Crear vocero
//           </h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//             }}
//             className="space-y-4"
//           >
//             <MenuDesplegable>
//               <label className="block">
//                 <span className="text-gray-700 font-medium">
//                   Selecciona donde crearlo
//                 </span>
//                 <div className="flex gap-4 mt-2">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       value="1"
//                       checked={circuitoComuna === 1}
//                       onChange={() =>
//                         setCircuitoComuna(circuitoComuna === 1 ? 0 : 1)
//                       }
//                       className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//                     />
//                     <span>Comuna</span>
//                   </label>

//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       value="2"
//                       checked={circuitoComuna === 2}
//                       onChange={() =>
//                         setCircuitoComuna(circuitoComuna === 2 ? 0 : 2)
//                       }
//                       className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//                     />
//                     <span>Circuito comunal</span>
//                   </label>

//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       value="2"
//                       checked={circuitoComuna === 3}
//                       onChange={() =>
//                         setCircuitoComuna(circuitoComuna === 3 ? 0 : 3)
//                       }
//                       className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//                     />
//                     <span>Consejo comunal</span>
//                   </label>
//                 </div>
//               </label>

//               {circuitoComuna === 3 && (
//                 <>
//                   <label className="block">
//                     <span className="text-gray-700 font-medium">
//                       ¿Donde crear el vocero?
//                     </span>
//                     <select
//                       value={idCrearEnComunaCircuito}
//                       onChange={(e) =>
//                         setIdCrearEnComunaCircuito(e.target.value)
//                       }
//                       className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//                     >
//                       <option value="">Seleccione</option>

//                       <option key={1}>Comuna</option>
//                       <option key={2}>Circuito</option>
//                     </select>
//                   </label>

//                   {idCrearEnComunaCircuito && (
//                     <label className="block">
//                       <span className="text-gray-700 font-medium">
//                         Parroquias:
//                       </span>
//                       <select
//                         value={idParroquia}
//                         onChange={(e) => fetchComunas(e.target.value)}
//                         className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//                       >
//                         <option value="">Seleccione</option>
//                         {parroquias.map((parroquia) => (
//                           <option key={parroquia.id} value={parroquia.id}>
//                             {parroquia.nombre}
//                           </option>
//                         ))}
//                       </select>
//                     </label>
//                   )}
//                 </>
//               )}

//               {(circuitoComuna === 1 || circuitoComuna === 2) && (
//                 <>
//                   <label className="block">
//                     <span className="text-gray-700 font-medium">
//                       Parroquias:
//                     </span>
//                     <select
//                       value={idParroquia}
//                       onChange={(e) => fetchComunas(e.target.value)}
//                       className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//                     >
//                       <option value="">Selecciona una parroquia</option>
//                       {parroquias.map((parroquia) => (
//                         <option key={parroquia.id} value={parroquia.id}>
//                           {parroquia.nombre}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                 </>
//               )}

//               {idParroquia && circuitoComuna !== 3 && (
//                 <>
//                   <label className="block">
//                     <span className="text-gray-700 font-medium">
//                       {circuitoComuna === 1 ? "Comunas" : "Circuitos comunales"}
//                       :
//                     </span>
//                     <select
//                       value={idComuna}
//                       onChange={(e) => setIdComuna(e.target.value)}
//                       className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//                     >
//                       <option value="">
//                         {circuitoComuna === 1
//                           ? "Selecciona una comuna"
//                           : "Selecciona circuito comunal"}
//                       </option>
//                       {comunas.map((comun) => (
//                         <option key={comun.id} value={comun.id}>
//                           {comun.nombre}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                 </>
//               )}

//               {circuitoComuna == 3 && (
//                 <Prueba
//                   idCrearEnComunaCircuito={idCrearEnComunaCircuito}
//                   idParroquia={idParroquia}
//                   fetchConsejoComunal={fetchConsejoComunal}
//                   idComuna={idComuna}
//                   idConsejoComunal={idConsejoComunal}
//                   fetchVoceroConsejoComunal={fetchVoceroConsejoComunal}
//                   consejoPorComuna={consejoPorComuna}
//                   nombreVocero={nombreVocero}
//                   setNombreVocero={setNombreVocero}
//                   comunas={comunas}
//                 />
//               )}
//             </MenuDesplegable>

//             {idParroquia && circuitoComuna !== 3 && idComuna && (
//               <>
//                 <FormularioVocero
//                   nombre={nombreVocero}
//                   setNombre={setNombreVocero}
//                   nombreDos={nombreDosVocero}
//                   setNombreDos={setNombreDosVocero}
//                   apellido={apellidoVocero}
//                   setApellido={setApellidoVocero}
//                   apellidoDos={apellidoDosVocero}
//                   setApellidoDos={setApellidoDosVocero}
//                   cedula={cedulaVocero}
//                   setCedula={setCedulaVocero}
//                   genero={generoVocero}
//                   setGenero={setGeneroVocero}
//                   edad={edadVocero}
//                   setEdad={setEdadVocero}
//                   telefono={telefonoVocero}
//                   setTelefono={setTelefonoVocero}
//                   direccion={direccionVocero}
//                   setDireccion={setDireccionVocero}
//                   correo={correoVocero}
//                   setCorreo={setCorreoVocero}
//                   proyecto={proyectoVocero}
//                   setProyecto={setProyectoVocero}
//                   verificado={verificadoVocero}
//                   setVerificado={setVerificadoVocero}
//                   certificado={certificadoVocero}
//                   setCertificado={setCertificadoVocero}
//                   mostrarModal={mostrarModal}
//                   cargos={cargos}
//                   seleccioneCargos={selectedCargos}
//                   setSeleccioneCargos={setSelectedCargos}
//                   toggleCargo={toggleCargo}
//                 />
//               </>
//             )}

//             {idConsejoComunal && (
//               <>
//                 <FormularioVocero
//                   nombre={nombreVocero}
//                   setNombre={setNombreVocero}
//                   nombreDos={nombreDosVocero}
//                   setNombreDos={setNombreDosVocero}
//                   apellido={apellidoVocero}
//                   setApellido={setApellidoVocero}
//                   apellidoDos={apellidoDosVocero}
//                   setApellidoDos={setApellidoDosVocero}
//                   cedula={cedulaVocero}
//                   setCedula={setCedulaVocero}
//                   genero={generoVocero}
//                   setGenero={setGeneroVocero}
//                   edad={edadVocero}
//                   setEdad={setEdadVocero}
//                   telefono={telefonoVocero}
//                   setTelefono={setTelefonoVocero}
//                   direccion={direccionVocero}
//                   setDireccion={setDireccionVocero}
//                   correo={correoVocero}
//                   setCorreo={setCorreoVocero}
//                   proyecto={proyectoVocero}
//                   setProyecto={setProyectoVocero}
//                   verificado={verificadoVocero}
//                   setVerificado={setVerificadoVocero}
//                   certificado={certificadoVocero}
//                   setCertificado={setCertificadoVocero}
//                   mostrarModal={mostrarModal}
//                   cargos={cargos}
//                   seleccioneCargos={selectedCargos}
//                   setSeleccioneCargos={setSelectedCargos}
//                   toggleCargo={toggleCargo}
//                 />
//               </>
//             )}
//           </form>
//         </div>

//         <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
//           <VocerosFormMostrar
//             idParroquia={idParroquia}
//             idComuna={idComuna}
//             idConsejo={idConsejoComunal}
//             vocerosPorConsejo={vocerosPorConsejo}
//             pertenece={circuitoComuna}
//           />
//         </div>
//       </section>
//     </>
//   );
// }

// function Prueba({
//   idCrearEnComunaCircuito,
//   idParroquia,
//   fetchConsejoComunal,
//   idComuna,
//   idConsejoComunal,
//   fetchVoceroConsejoComunal,
//   consejoPorComuna,
//   nombreVocero,
//   setNombreVocero,
//   comunas,
// }) {
//   useEffect(() => {
//     if (
//       !idParroquia ||
//       !idComuna ||
//       idConsejoComunal ||
//       !idCrearEnComunaCircuito
//     ) {
//       setNombreVocero("");
//     }
//   }, [
//     !idParroquia || !idComuna || idConsejoComunal || !idCrearEnComunaCircuito,
//   ]);

//   return (
//     <>
//       {idCrearEnComunaCircuito === "Comuna" && idParroquia && (
//         <>
//           <label className="block">
//             <span className="text-gray-700 font-medium">Comunas:</span>
//             <select
//               value={idComuna}
//               onChange={(e) => fetchConsejoComunal(e.target.value)}
//               className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//             >
//               <option value="">Selecciona una comuna</option>
//               {comunas.map((comun) => (
//                 <option key={comun.id} value={comun.id}>
//                   {comun.nombre}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </>
//       )}

//       {/* Selector de Comunas (Solo se muestra si hay parroquia seleccionada) */}
//       {idComuna && (
//         <label className="block mt-4">
//           <span className="text-gray-700 font-medium">Consejo comunal</span>
//           <select
//             value={idConsejoComunal}
//             onChange={(e) => fetchVoceroConsejoComunal(e.target.value)}
//             className="mt-1 cursor-pointer uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           >
//             <option value="">Selecciona consejo comunal</option>
//             {consejoPorComuna.map((consejo) => (
//               <option key={consejo.id} value={consejo.id}>
//                 {consejo.nombre}
//               </option>
//             ))}
//           </select>
//         </label>
//       )}
//     </>
//   );
// }

// function MenuDesplegable({ children }) {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className="rounded-md shadow-md w-full ">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full text-left p-3 color-fondo text-white font-semibold rounded-md flex justify-between items-center"
//       >
//         <span>Menú de opciones</span>
//         <span>{isOpen ? "▲" : "▼"}</span> {/* Ícono cambia según estado */}
//       </button>

//       {isOpen && (
//         <div className="p-4 bg-white rounded-b-lg transition-all duration-300">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// function FormularioVocero({
//   nombre,
//   setNombre,
//   nombreDos,
//   setNombreDos,
//   apellido,
//   setApellido,
//   apellidoDos,
//   setApellidoDos,
//   cedula,
//   setCedula,
//   genero,
//   setGenero,
//   edad,
//   setEdad,
//   telefono,
//   setTelefono,
//   direccion,
//   setDireccion,
//   correo,
//   setCorreo,
//   proyecto,
//   setProyecto,
//   verificado,
//   setVerificado,
//   certificado,
//   setCertificado,
//   mostrarModal,
//   cargos,
//   seleccioneCargos,
//   setSeleccioneCargos,
//   toggleCargo,
// }) {
//   return (
//     <div className="flex flex-col space-y-3">
//       {/* Grupo: Nombre y Segundo Nombre */}
//       <div className="grid grid-cols-2 gap-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Nombre:</span>
//           <input
//             type="text"
//             value={nombre}
//             onChange={(e) => setNombre(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700 font-medium">Segundo Nombre:</span>
//           <input
//             type="text"
//             value={nombreDos}
//             onChange={(e) => setNombreDos(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//       </div>

//       {/* Grupo: Apellido y Segundo Apellido */}
//       <div className="grid grid-cols-2 gap-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Apellido:</span>
//           <input
//             type="text"
//             value={apellido}
//             onChange={(e) => setApellido(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700 font-medium">Segundo Apellido:</span>
//           <input
//             type="text"
//             value={apellidoDos}
//             onChange={(e) => setApellidoDos(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//       </div>

//       {/* Grupo: Cédula y Género */}
//       <div className="grid grid-cols-2 gap-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Cédula:</span>
//           <input
//             type="text"
//             value={cedula}
//             onChange={(e) => setCedula(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700 font-medium">Género:</span>
//           <select
//             value={genero}
//             onChange={(e) => setGenero(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           >
//             <option value="">Seleccione</option>
//             <option value="1">Hombre</option>
//             <option value="2">Mujer</option>
//           </select>
//         </label>
//       </div>

//       {/* Grupo: Edad y Teléfono */}
//       <div className="grid grid-cols-2 gap-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Edad:</span>
//           <input
//             type="number"
//             value={edad}
//             onChange={(e) => setEdad(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700 font-medium">Teléfono:</span>
//           <input
//             type="text"
//             value={telefono}
//             onChange={(e) => setTelefono(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//       </div>

//       {/* Grupo: Dirección y Correo */}
//       <div className="grid grid-cols-2 gap-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Dirección:</span>
//           <input
//             type="text"
//             value={direccion}
//             onChange={(e) => setDireccion(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700 font-medium">Correo Electrónico:</span>
//           <input
//             type="email"
//             value={correo}
//             onChange={(e) => setCorreo(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           />
//         </label>
//       </div>

//       {/* Grupo: Proyecto y Certificado */}
//       <div className="grid grid-cols-2 gap-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Proyecto:</span>
//           <select
//             value={proyecto}
//             onChange={(e) => setProyecto(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           >
//             <option value="">Seleccione</option>
//             <option value="1">Sí</option>
//             <option value="2">No</option>
//           </select>
//         </label>

//         <label className="block">
//           <span className="text-gray-700 font-medium">Verificado:</span>
//           <select
//             value={verificado}
//             onChange={(e) => setVerificado(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           >
//             <option value="">Seleccione</option>
//             <option value="1">Sí</option>
//             <option value="2">No</option>
//           </select>
//         </label>

//         <label className="block">
//           <span className="text-gray-700 font-medium">Certificado:</span>
//           <select
//             value={certificado}
//             onChange={(e) => setCertificado(e.target.value)}
//             className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//           >
//             <option value="">Seleccione</option>
//             <option value="1">Sí</option>
//             <option value="2">No</option>
//           </select>
//         </label>
//       </div>

//       {/* Grupo: Cargos */}
//       <div className="grid grid-cols-2 gap-4">
//         {cargos.map((cargo) => (
//           <label key={cargo.id} className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={seleccioneCargos.includes(cargo.id)}
//               onChange={() => toggleCargo(cargo.id)}
//               className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//             />
//             <span>{cargo.nombre}</span>
//           </label>
//         ))}
//       </div>

//       {/* Botón Guardar */}
//       <button
//         disabled={!nombre || !cedula || !correo}
//         type="bottom"
//         onClick={() => mostrarModal()}
//         className={`${
//           !nombre || !cedula || !correo
//             ? "cursor-not-allowed opacity-50"
//             : "cursor-pointer"
//         } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
//       >
//         Guardar
//       </button>
//     </div>
//   );
// }
