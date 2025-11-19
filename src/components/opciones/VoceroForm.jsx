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
import FormCrearVocero from "../formularios/FormCrearVocero";
import ModalDatosContenedor from "../modales/ModalDatosContenedor";
import SelectOpcion from "../SelectOpcion";
import ListadoVoceros from "../listados/ListadoVoceros";
import InputCedula from "../inputs/InputCedula";
import Boton from "../botones/Boton";
import FormEditarVocero from "../formularios/FormEditarVocero";
import ModalEditar from "../modales/ModalEditar";
import BotonSelecOpcionVocero from "../botones/BotonSelecOpcion";

export default function VoceroForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
  id_usuario,
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

  const [open, setOpen] = useState(false);

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
    if (!idConsejoComunal && accion !== "editar") {
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
    setAccion("");
  }, [seleccionarConsulta]);

  useEffect(() => {
    if (!idParroquia && accion !== "editar") {
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
    if (!idComuna && accion !== "editar") {
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
        let response = await axios.get(`/api/voceros/todos-voceros-municipio`);

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

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter" && validarCedula) {
        consultarVoceroCedula();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [validarCedula, cedulaVocero]);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setGeneroVocero("");
    }
  }, [accion, mostrar]);

  const toggleGenero = (id) => {
    setGeneroVocero(generoVocero === id ? "" : id); // Cambia el estado, permitiendo deselección
  };

  const cambiarDondeGuardar = (e) => {
    const valor = e.target.value;
    setCircuitoComuna(valor);
  };

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const cambiarSeleccionComunaCircuito = (e) => {
    const valor = e.target.value; // ID de la comuna seleccionada

    setIdComuna(valor);

    // Filtrar voceros por ID de la comuna
    const vocerosSeleccionados =
      todasComunas.find((comuna) => comuna.id === Number(valor))?.voceros || [];

    setTodosVoceros(accion !== "editar" ? vocerosSeleccionados : todosVoceros);
  };

  const cambiarSeleccionConsejo = (e) => {
    const valor = e.target.value;
    setIdConsejoComunal(valor);
  };

  /**
    const toggleCargos = (id) => {
      setSeleccionarCargo((prev) =>
        prev.includes(id) ? prev.filter((cargo) => cargo !== id) : [...prev, id]
      );
    };
  */

  const toggleCargos = (id) => {
    setSeleccionarCargo([id]);
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
        const nuevoVocero = response?.data.vocero;

        if (todosVoceros?.length > 1) {
          console.log("Entramos a la primera condicion");

          setTodosVoceros((voceros) => {
            const arrayVoceros = Array.isArray(voceros) ? voceros : [];

            const yaExiste = arrayVoceros.some(
              (vocero) => vocero.cedula === nuevoVocero.cedula
            );

            if (yaExiste) {
              // Actualiza el vocero que ya existe
              return arrayVoceros.map((vocero) =>
                vocero.cedula === nuevoVocero.cedula ? nuevoVocero : vocero
              );
            } else {
              // Agrega el nuevo vocero al final
              return [...arrayVoceros, nuevoVocero];
            }
          });
        } else {
          setTodosVoceros(response.data.vocero);
        }

        //setTodosVoceros([...todosVoceros, response.data.vocero]);
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
          { accion: () => setSeleccionarCargo([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
      setIdParroquia(datos.comunas.id_parroquia);
      setIdComuna(datos.comunas.id);
      setIdCircuito(datos.circuitos ? datos.circuitos.id : "");
      setIdConsejoComunal(datos.consejos ? datos.consejos.id : "");

      setCedulaVocero(datos.cedula);
      setEdadVocero(datos.edad);
      setNombreVocero(datos.nombre);
      setNombreDosVocero(datos.nombre_dos ? datos.nombre_dos : "");

      setApellidoVocero(datos.apellido);
      setApellidoDosVocero(datos.apellido_dos ? datos.apellido_dos : "");

      setGeneroVocero(datos.genero ? 1 : 2);
      setTelefonoVocero(datos.telefono);

      setDireccionVocero(datos.direccion);
      setCorreoVocero(datos.correo);
      setActividadLaboralVocero(datos.laboral);
      setSeleccionarCargo([datos.cargos?.[0]?.id ? datos.cargos?.[0]?.id : []]);

      abrirModal();
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
          { accion: setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
          titulo={"Editar vocero"}
        >
          <div className="w-full">
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

              {nombreParroquia && (
                <ModalDatos
                  titulo={"Parroquia"}
                  descripcion={nombreParroquia}
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
        <DivUnoDentroSectionRegistroMostrar nombre={"Opciones vocero"}>
          <div className="w-full bg-gray-100 backdrop-blur-md rounded-md shadow-xl p-4 space-y-6 border border-gray-300">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <BotonSelecOpcionVocero
                consultar={() => toggleConsultar(1)}
                seleccionar={seleccionarConsulta}
                indice={1}
                nombre="Crear"
              />

              <BotonSelecOpcionVocero
                consultar={() => toggleConsultar(6)}
                seleccionar={seleccionarConsulta}
                indice={6}
                nombre="Por cédula"
              />

              <BotonSelecOpcionVocero
                consultar={() => toggleConsultar(2)}
                seleccionar={seleccionarConsulta}
                indice={2}
                nombre="Por parroquia"
              />

              <BotonSelecOpcionVocero
                consultar={() => toggleConsultar(3)}
                seleccionar={seleccionarConsulta}
                indice={3}
                nombre="Por comuna"
              />

              <BotonSelecOpcionVocero
                consultar={() => toggleConsultar(4)}
                seleccionar={seleccionarConsulta}
                indice={4}
                nombre="Por consejo"
              />

              <BotonSelecOpcionVocero
                consultar={() => toggleConsultar(5)}
                seleccionar={seleccionarConsulta}
                indice={5}
                nombre="Todos"
              />
            </div>
          </div>
        </DivUnoDentroSectionRegistroMostrar>

        {seleccionarConsulta === 1 && (
          <>
            <DivUnoDentroSectionRegistroMostrar nombre={"Crear vocero"}>
              <FormCrearVocero
                idComuna={idComuna}
                idConsejo={idConsejoComunal}
                cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
                cambiarSeleccionConsejo={cambiarSeleccionConsejo}
                cambiarDondeGuardar={cambiarDondeGuardar}
                toggleGenero={toggleGenero}
                comunasCircuitos={todasComunas}
                consejos={todosConsejos}
                dondeGuardar={circuitoComuna}
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
                open={open}
                setOpen={setOpen}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 2 && (
          <>
            <DivUnoDentroSectionRegistroMostrar>
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
                open={open}
                setOpen={setOpen}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 3 && (
          <>
            <DivUnoDentroSectionRegistroMostrar>
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
                open={open}
                setOpen={setOpen}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 4 && (
          <>
            <DivUnoDentroSectionRegistroMostrar>
              <SelectOpcion
                idOpcion={idConsejoComunal}
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
                open={open}
                setOpen={setOpen}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 5 && (
          <>
            <DivDosDentroSectionRegistroMostrar>
              <ListadoVoceros
                voceros={
                  Array.isArray(todosVoceros) ? todosVoceros : [todosVoceros]
                }
                editar={editando}
                open={open}
                setOpen={setOpen}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}

        {seleccionarConsulta === 6 && (
          <>
            <DivUnoDentroSectionRegistroMostrar>
              <div className="w-full flex flex-col gap-2 justify-center sm:flex-row items-center sm:space-x-4 p-2 bg-gray-100 shadow-lg rounded-md border border-gray-300 ">
                <div className="w-full">
                  <InputCedula
                    type={"text"}
                    indice={"cedula"}
                    value={cedulaVocero}
                    setValue={setCedulaVocero}
                    validarCedula={validarCedula}
                    setValidarCedula={setValidarCedula}
                    className={`bg-white`}
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
                open={open}
                setOpen={setOpen}
              />
            </DivDosDentroSectionRegistroMostrar>
          </>
        )}
      </SectionRegistroMostrar>
    </>
  );
}
