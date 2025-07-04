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
import ListadoOac from "./ListadoOac";
import ModalDatosContenedor from "../ModalDatosContenedor";
import Titulos from "../Titulos";
import FormCrearCursando from "./FormCrearCursando";
import FormCrearClase from "./FormCrearClase";
import InputCheckBox from "../InputCheckBox";
import FormCrearEstadistica from "./FormCrearEstadistica";

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
  const [todasEstadisticas, setTodasEstadisticas] = useState([]);

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [nombreComuna, setNombreComuna] = useState("");
  const [nombreConsejoComunal, setNombreConsejoComunal] = useState("");
  const [nameClase, setNameClase] = useState("");
  const [nameComuna, setNameComuna] = useState("");
  const [nameConsejo, setNameConsejo] = useState("");

  const [accion, setAccion] = useState("");
  const [datos, setDatos] = useState("");

  const [seleccionarConsulta, setSeleccionarConsulta] = useState("");
  const [seleccionarDondeCrear, setSeleccionarDondeCrear] = useState("");

  const [conteo, setConteo] = useState({
    mujeres: 0,
    hombres: 0,
    adultasMayores: 0,
    adultosMayores: 0,
  });

  const [cantidadMujeres, setCantidadMujeres] = useState("");
  const [cantidadHombres, setCantidadHombres] = useState("");
  const [modulo, setModulo] = useState("");
  const [fechaAprobado, setFechaAprobado] = useState("");
  const [nombreFacilitador, setNombreFacilitador] = useState("");

  const [seleccionarModulo, setSeleccionarModulo] = useState("");

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [
          clasesRes,
          cursandoRes,
          comunasRes,
          consejosRes,
          estadisticasRes,
        ] = await Promise.all([
          axios.get("/api/oac/todas-clases"),
          axios.get("/api/oac/todos-cursando"),
          axios.get("/api/comunas/todas-comunas"),
          axios.get("/api/consejos/todos-consejos-comunales"),
          axios.get("/api/oac/todas-estadisticas"),
        ]);

        setTodasClases(clasesRes.data.clases || []);
        setTodosCursandos(cursandoRes.data.cursandos || []);
        setTodasComunas(comunasRes.data.comunas || []);
        setTodosConsejos(consejosRes.data.consejos || []);
        setTodasComunas(estadisticasRes.data.estadisticas || []);
      } catch (error) {
        console.log("Error, al obtener datos: " + error);
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    if (idComuna && todasComunas?.length) {
      const comuna = todasComunas.find((c) => c.id === idComuna);
      setIdParroquia(comuna?.id_parroquia ?? null);
    } else if (idConsejo && todosConsejos?.length) {
      const consejo = todosConsejos.find((c) => c.id === idConsejo);
      setIdParroquia(consejo?.id_parroquia ?? null);
    }
  }, [idComuna, idConsejo]);

  useEffect(() => {
    if (!Array.isArray(todosCursandos)) return;

    let mujeres = 0;
    let hombres = 0;
    let adultasMayores = 0;
    let adultosMayores = 0;

    todosCursandos?.forEach((persona) => {
      if (persona?.borrado) return; // Ignorar si está marcada como borrada

      const { genero, edad } = persona;

      if (genero === false) {
        mujeres++;
        if (edad >= 55) adultasMayores++;
      } else if (genero === true) {
        hombres++;
        if (edad >= 60) adultosMayores++;
      }
    });

    setConteo({ mujeres, hombres, adultasMayores, adultosMayores });
  }, [todosCursandos]);

  useEffect(() => {
    setSeleccionarDondeCrear("");
    setIdComuna("");
    setIdConsejo("");
  }, [seleccionarConsulta]);

  useEffect(() => {
    if (seleccionarDondeCrear === 1) {
      setIdConsejo("");
    } else {
      setIdComuna("");
    }
  }, [seleccionarDondeCrear]);

  const toggleGenero = (id) => {
    setGeneroCursando(generoCursando === id ? null : id); // Cambia el estado, permitiendo deselección
  };

  /**
    const toggleModulo = (id) => {
      setSeleccionarModulo((prev) =>
        prev.includes(id) ? prev.filter((modulo) => modulo !== id) : [...prev, id]
      );
    };
  */

  const toggleModulo = (id) => {
    setModulo(modulo === id ? null : id); // Cambia el estado, permitiendo deselección
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

  const crearEstadistica = async () => {
    if (nombreFacilitador.trim()) {
      try {
        // Verificación básica antes de enviar la solicitud
        if (!nombreFacilitador.trim()) {
          console.warn("Todos los campos obligatorios deben estar completos.");
          return;
        }

        // Datos generales del vocero
        const data = {
          cantidadMujeres: Number(cantidadMujeres),
          cantidadHombres: Number(cantidadHombres),
          fechaAprobado: fechaAprobado,
          facilitador: nombreFacilitador,
          idParroquia: datos.id_parroquia,
          idComuna: datos.id_comuna,
          idConsejo: idConsejo,
          idClase: idClase,
          modulos: modulo,
        };

        const response = await axios.post("/api/oac/crear-estadistica", data);

        setTodasEstadisticas([...todasEstadisticas, response.data.estadistica]);
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCantidadMujeres(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCantidadHombres(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setSeleccionarModulo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setFechaAprobado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreFacilitador(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear estadistica: " + error);
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

  // Before your Modal component
const getTitulo = (accion) => {
  switch (accion) {
    case 'clase':
      return "¿Crear esta formación?";
    case 'cursando':
      return "¿Crear este registro?";
    case 'estadistica':
      return "¿Crear esta estadistica?";
    default:
      return ""; // Or a default title if none of the cases match
  }
};


  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={getTitulo(accion)}
      >
        <ModalDatosContenedor>
          {accion === "clase" && (
            <ModalDatos titulo={"Nombre"} descripcion={nombreClase} />
          )}
          
          {accion === 'cursando' &&(
            <>
              <ModalDatos titulo={"Cedula"} descripcion={cedulaCursando} />
              <ModalDatos titulo={"Edad"} descripcion={edadCursando} />
              <ModalDatos
                titulo={"Genero"}
                descripcion={generoCursando === 1 ? "MAsculino" : "Femenino"}
              />
            </>
          )}

          {accion === "estadistica" && (
           <>
            <ModalDatos titulo={"Cantidad mujeres"} descripcion={cantidadMujeres} />
            <ModalDatos titulo={"Cantidad Hombres"} descripcion={cantidadHombres} />
            <ModalDatos titulo={"Modulos"} descripcion={modulo === 1 ? 'Modulo I y II' : 'Modulo III'} />
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

      <div className="px-4">
        <div className="flex flex-col mt-3">
          <div className="flex justify-start">
            <Titulos indice={2} titulo={"Formaciones OAC"} />
          </div>

          <div className="border border-gray-200 p-2 rounded-md mb-2 flex justify-between">
            <div className="flex flex-wrap gap-4 sm:justify-between">
              <div
                onClick={() => setAccion("clase")}
                className="w-full sm:w-auto"
              >
                <InputCheckBox
                  id={1}
                  isChecked={seleccionarConsulta === 1}
                  onToggle={toggleConsultar}
                  nombre="Crear formación"
                />
              </div>
              <div
                onClick={() => setAccion("cursando")}
                className="w-full sm:w-auto"
              >
                <InputCheckBox
                  id={2}
                  isChecked={seleccionarConsulta === 2}
                  onToggle={toggleConsultar}
                  nombre="Crear cursando"
                />
              </div>

              <div
                onClick={() => setAccion("estadistica")}
                className="w-full sm:w-auto"
              >
                <InputCheckBox
                  id={3}
                  isChecked={seleccionarConsulta === 3}
                  onToggle={toggleConsultar}
                  nombre="Crear estadistica"
                />
              </div>
            </div>

            {seleccionarConsulta !== 3 ? (
              <div className="flex flex-wrap gap-2 sm:justify-between">
                {seleccionarConsulta && accion !== "clase" && (
                  <div className="flex flex-col">
                    <div className="flex flex-wrap gap-4 sm:justify-between">
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
              </div>
            ) : null}
          </div>
        </div>

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
              <ListadoOac
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
              <ListadoOac
                isLoading={isLoading}
                listado={todosCursandos}
                nombreListado={"Cursando"}
                mensajeVacio={"No hay personas disponibles..."}
                conteo={conteo}
              />
            </DivDosDentroSectionRegistroMostrar>
          </SectionRegistroMostrar>
        )}

        {seleccionarConsulta === 3 && (
          <SectionRegistroMostrar>
            <DivUnoDentroSectionRegistroMostrar nombre={"Crear estadistica"}>
              <FormCrearEstadistica
                abrirModal={abrirModal}
                limpiarCampos={limpiarCampos}
                cantidadMujeres={cantidadMujeres}
                setCantidadMujeres={setCantidadMujeres}
                cantidadHombres={cantidadHombres}
                setCantidadHombres={setCantidadHombres}
                modulo={modulo}
                setModulo={setModulo}
                fechaAprobado={fechaAprobado}
                setFechaAprobado={setFechaAprobado}
                nombreFacilitador={nombreFacilitador}
                setNombreFacilitador={setNombreFacilitador}
                idConsejo={idConsejo}
                clases={todasClases}
                cambiarSeleccionConsejo={cambiarSeleccionConsejo}
                consejos={todosConsejos}
                setNameConsejo={setNameConsejo}
                seleccionarClases={seleccionarClase}
                seleccionarModulo={seleccionarModulo}
                setSeleccionarModulo={setSeleccionarModulo}
                toggleModulo={toggleModulo}
                toggleClases={toggleClase}
                setDatos={setDatos}
              />
            </DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <ListadoOac
                isLoading={isLoading}
                listado={todasEstadisticas}
                nombreListado={"Estadisticas"}
                mensajeVacio={"No hay personas disponibles..."}
                conteo={conteo}
              />
            </DivDosDentroSectionRegistroMostrar>
          </SectionRegistroMostrar>
        )}
      </div>
    </>
  );
}
