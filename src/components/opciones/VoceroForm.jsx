"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import ModalDatosCargos from "../ModalDatosCargos";
import Boton from "../Boton";
import VocerosFormMostrar from "./VocerosFormMostrar";

export default function VoceroForm() {
  // Estados para los selectores
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

  const [proyectoVocero, setProyectoVocero] = useState("");
  const [verificadoVocero, setVerificadoVocero] = useState("");
  const [certificadoVocero, setCertificadoVocero] = useState("");

  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idConsejoComunal, setIdConsejoComunal] = useState("");

  // Estados para almacenar datos consultados
  const [parroquias, setParroquias] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [consejoPorComuna, setConsejoPorComuna] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [vocerosPorConsejo, setVocerosPorConsejo] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);

  const [idCrearEnComunaCircuito, setIdCrearEnComunaCircuito] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const [selectedCargos, setSelectedCargos] = useState([]);

  const toggleCargo = (id) => {
    setSelectedCargos((prev) =>
      prev.includes(id) ? prev.filter((cargo) => cargo !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parroquiasRes, cargosRes] = await Promise.all([
          axios.get("/api/parroquias/todas-parroquias"),
          axios.get("/api/cargos/todos-cargos"),
        ]);

        setParroquias(parroquiasRes.data.parroquias || []);
        setCargos(cargosRes.data.cargos || []);
      } catch (error) {
        console.log("Error, al obtener datos (parroquias, cargos): " + error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIdParroquia("");
    setIdComuna("");
    setIdConsejoComunal("");
    setIdCrearEnComunaCircuito("");
  }, [circuitoComuna]);

  useEffect(() => {
    setIdParroquia("");
    setIdComuna("");
    setIdConsejoComunal("");
  }, [idCrearEnComunaCircuito]);

  const fetchComunas = async (parroquiaId) => {
    try {
      setIdParroquia(parroquiaId);
      setIdComuna(""); // Resetear comuna cuando cambia la parroquia
      setIdConsejoComunal("");

      if (!parroquiaId) {
        setComunas([]);
        return;
      }

      let response;
      if (circuitoComuna === 1 || idCrearEnComunaCircuito === "Comuna") {
        response = await axios.get(`/api/comunas/comunas-id`, {
          params: { idParroquia: parroquiaId },
        });
      } else if (
        circuitoComuna === 2 ||
        idCrearEnComunaCircuito === "Circuito"
      ) {
        response = await axios.get(`/api/circuitos/circuitos-id`, {
          params: { idParroquia: parroquiaId },
        });
      }

      setComunas(response?.data?.comunas || response?.data?.circuitos);
    } catch (error) {
      console.log("Error al obtener comunas o circuitos:", error);
    }
  };

  const fetchConsejoComunal = async (consejoId) => {
    try {
      //setIdComuna(""); // Resetear comuna cuando cambia la parroquia
      setIdConsejoComunal("");

      setIdComuna(consejoId);

      if (!consejoId) {
        setConsejoPorComuna([]);
        return;
      }

      let response;
      if (idCrearEnComunaCircuito === "Comuna") {
        response = await axios.get(
          `/api/consejos/consejos-comunales-id-comuna`,
          {
            params: { idComuna: consejoId },
          }
        );
      } else if (idCrearEnComunaCircuito === "Circuito") {
        response = await axios.get(
          `/api/consejos/consejos-comunales-id-circuito`,
          {
            params: { idCircuito: consejoId },
          }
        );
      }

      //setComunas(response?.data?.comunas || response?.data?.circuitos);

      setConsejoPorComuna(response?.data?.consejos);
    } catch (error) {
      console.log("Error al obtener consejos por id: " + error);
    }
  };

  const fetchVoceroConsejoComunal = async (consejoId) => {
    try {
      setIdConsejoComunal(consejoId);

      //setIdConsejoComunal("");

      if (!consejoId) {
        setVocerosPorConsejo([]);
        return;
      }

      const response = await axios.get(
        `/api/voceros/vocero-consejo-comunal-id`,
        {
          params: { idConsejo: consejoId },
        }
      );

      setVocerosPorConsejo(response?.data?.voceros);
    } catch (error) {
      console.log("Error al obtener voceros consejo comunal: " + error);
    }
  };

  const crearVocero = async () => {
    if (nombreVocero.trim() && idParroquia.trim() && idComuna.trim()) {
      try {
        // Verificación básica antes de enviar la solicitud
        if (!nombreVocero.trim() || !idParroquia || !circuitoComuna) {
          console.warn("Todos los campos obligatorios deben estar completos.");
          return;
        }

        // Configurar valores según `circuitoComuna`
        const config = {
          1: {
            pertenece: "comuna",
            id_comuna: idComuna,
            id_circuito: null,
            id_consejo: null,
          },
          2: {
            pertenece: "circuito",
            id_comuna: null,
            id_circuito: idComuna,
            id_consejo: null,
          },
          3: {
            pertenece: "consejo",
            id_comuna: idCrearEnComunaCircuito === "Comuna" ? idComuna : null,
            id_circuito:
              idCrearEnComunaCircuito === "Circuito" ? idComuna : null,
            id_consejo: idConsejoComunal,
          },
        };

        // Datos generales del vocero
        const data = {
          nombre: nombreVocero.trim(),
          nombre_dos: nombreDosVocero.trim(),
          apellido: apellidoVocero.trim(),
          apellido_dos: apellidoDosVocero.trim(),
          cedula: Number(cedulaVocero), // Convertir a número
          genero: generoVocero,
          edad: Number(edadVocero),
          telefono: telefonoVocero,
          direccion: direccionVocero || "No especificada",
          correo: correoVocero.trim(),
          proyecto: proyectoVocero === "1" ? "1" : "2",
          certificado: certificadoVocero === "1" ? "1" : "2",
          verificado: verificadoVocero === "1" ? "1" : "2",
          borrado: false,
          cargos:
            selectedCargos.length > 0
              ? selectedCargos.map((id) => ({ id }))
              : [],
          id_parroquia: idParroquia,
          ...config[circuitoComuna], // Asignar valores específicos según `circuitoComuna`
        };

        // Enviar datos al backend
        const response = await axios.post("/api/voceros/crear-vocero", data);

        // Actualizar estado
        setVocerosPorConsejo(response?.data?.vocero);
        setNombreVocero("");

        console.log("Vocero creado con éxito:", response.data);
      } catch (error) {
        console.error(
          "Error al crear vocero:",
          error.response?.data || error.message
        );
      }
    } else {
      console.warn("Todos los campos son obligatorios.");
    }
  };

  const mostrarModal = () => {
    setMostrar(true);
  };

  const cerrarModal = () => {
    setMostrar(false);
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear este vocero?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1 pb-4">
          <ModalDatos titulo={"Nombre"} descripcion={nombreVocero} />
          <ModalDatos titulo={"Segundo nombre"} descripcion={nombreDosVocero} />
          <ModalDatos titulo={"Apellido"} descripcion={apellidoVocero} />
          <ModalDatos
            titulo={"Segundo apellido"}
            descripcion={apellidoDosVocero}
          />
          <ModalDatos titulo={"Cedula"} descripcion={cedulaVocero} />
          <ModalDatos
            titulo={"Genero"}
            descripcion={
              generoVocero && generoVocero === 1 ? "Hombre" : "Mujer"
            }
          />
          <ModalDatos titulo={"Edad"} descripcion={edadVocero} />
          <ModalDatos titulo={"Telefono"} descripcion={telefonoVocero} />
          <ModalDatos titulo={"Direccion"} descripcion={direccionVocero} />
          <ModalDatos titulo={"Correo"} descripcion={correoVocero} />
          <ModalDatos
            titulo={"R. proyecto"}
            descripcion={proyectoVocero && proyectoVocero === "1" ? "Si" : "No"}
          />
          <ModalDatos
            titulo={"Verificado"}
            descripcion={
              verificadoVocero && verificadoVocero === "1" ? "Si" : "No"
            }
          />
          <ModalDatos
            titulo={"Certificado"}
            descripcion={
              certificadoVocero && certificadoVocero === "1" ? "Si" : "No"
            }
          />
          <ModalDatosCargos
            nombre={"Cargos"}
            cargos={cargos}
            todosCargos={selectedCargos}
          />
        </div>

        <div className="flex space-x-2 px-10">
          <Boton
            className={`py-2`}
            nombre={"Aceptar"}
            onClick={() => {
              crearVocero();
              setMostrar(false);
            }}
          />

          <Boton
            className={`py-2`}
            nombre={"Cancelar"}
            onClick={() => {
              setMostrar(false);
            }}
          />
        </div>
      </Modal>

      <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
        <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Crear vocero
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <MenuDesplegable>
              <label className="block">
                <span className="text-gray-700 font-medium">
                  Selecciona donde crearlo
                </span>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="1"
                      checked={circuitoComuna === 1}
                      onChange={() =>
                        setCircuitoComuna(circuitoComuna === 1 ? 0 : 1)
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span>Comuna</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="2"
                      checked={circuitoComuna === 2}
                      onChange={() =>
                        setCircuitoComuna(circuitoComuna === 2 ? 0 : 2)
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span>Circuito comunal</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="2"
                      checked={circuitoComuna === 3}
                      onChange={() =>
                        setCircuitoComuna(circuitoComuna === 3 ? 0 : 3)
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span>Consejo comunal</span>
                  </label>
                </div>
              </label>

              {circuitoComuna === 3 && (
                <>
                  <label className="block">
                    <span className="text-gray-700 font-medium">
                      ¿Donde crear el vocero?
                    </span>
                    <select
                      value={idCrearEnComunaCircuito}
                      onChange={(e) =>
                        setIdCrearEnComunaCircuito(e.target.value)
                      }
                      className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="">Seleccione</option>

                      <option key={1}>Comuna</option>
                      <option key={2}>Circuito</option>
                    </select>
                  </label>

                  {idCrearEnComunaCircuito && (
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Parroquias:
                      </span>
                      <select
                        value={idParroquia}
                        onChange={(e) => fetchComunas(e.target.value)}
                        className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                      >
                        <option value="">Seleccione</option>
                        {parroquias.map((parroquia) => (
                          <option key={parroquia.id} value={parroquia.id}>
                            {parroquia.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </>
              )}

              {(circuitoComuna === 1 || circuitoComuna === 2) && (
                <>
                  <label className="block">
                    <span className="text-gray-700 font-medium">
                      Parroquias:
                    </span>
                    <select
                      value={idParroquia}
                      onChange={(e) => fetchComunas(e.target.value)}
                      className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="">Selecciona una parroquia</option>
                      {parroquias.map((parroquia) => (
                        <option key={parroquia.id} value={parroquia.id}>
                          {parroquia.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {idParroquia && circuitoComuna !== 3 && (
                <>
                  <label className="block">
                    <span className="text-gray-700 font-medium">
                      {circuitoComuna === 1 ? "Comunas" : "Circuitos comunales"}
                      :
                    </span>
                    <select
                      value={idComuna}
                      onChange={(e) => setIdComuna(e.target.value)}
                      className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="">
                        {circuitoComuna === 1
                          ? "Selecciona una comuna"
                          : "Selecciona circuito comunal"}
                      </option>
                      {comunas.map((comun) => (
                        <option key={comun.id} value={comun.id}>
                          {comun.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {circuitoComuna == 3 && (
                <Prueba
                  idCrearEnComunaCircuito={idCrearEnComunaCircuito}
                  idParroquia={idParroquia}
                  fetchConsejoComunal={fetchConsejoComunal}
                  idComuna={idComuna}
                  idConsejoComunal={idConsejoComunal}
                  fetchVoceroConsejoComunal={fetchVoceroConsejoComunal}
                  consejoPorComuna={consejoPorComuna}
                  nombreVocero={nombreVocero}
                  setNombreVocero={setNombreVocero}
                  comunas={comunas}
                />
              )}
            </MenuDesplegable>

            {idParroquia && circuitoComuna !== 3 && idComuna && (
              <>
                <FormularioVocero
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
                  proyecto={proyectoVocero}
                  setProyecto={setProyectoVocero}
                  verificado={verificadoVocero}
                  setVerificado={setVerificadoVocero}
                  certificado={certificadoVocero}
                  setCertificado={setCertificadoVocero}
                  mostrarModal={mostrarModal}
                  cargos={cargos}
                  seleccioneCargos={selectedCargos}
                  setSeleccioneCargos={setSelectedCargos}
                  toggleCargo={toggleCargo}
                />
              </>
            )}

            {idConsejoComunal && (
              <>
                <FormularioVocero
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
                  proyecto={proyectoVocero}
                  setProyecto={setProyectoVocero}
                  verificado={verificadoVocero}
                  setVerificado={setVerificadoVocero}
                  certificado={certificadoVocero}
                  setCertificado={setCertificadoVocero}
                  mostrarModal={mostrarModal}
                  cargos={cargos}
                  seleccioneCargos={selectedCargos}
                  setSeleccioneCargos={setSelectedCargos}
                  toggleCargo={toggleCargo}
                />
              </>
            )}
          </form>
        </div>

        <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
          <VocerosFormMostrar
            idParroquia={idParroquia}
            idComuna={idComuna}
            idConsejo={idConsejoComunal}
            vocerosPorConsejo={vocerosPorConsejo}
            pertenece={circuitoComuna}
          />
        </div>
      </section>
    </>
  );
}

function Prueba({
  idCrearEnComunaCircuito,
  idParroquia,
  fetchConsejoComunal,
  idComuna,
  idConsejoComunal,
  fetchVoceroConsejoComunal,
  consejoPorComuna,
  nombreVocero,
  setNombreVocero,
  comunas,
}) {
  useEffect(() => {
    if (
      !idParroquia ||
      !idComuna ||
      idConsejoComunal ||
      !idCrearEnComunaCircuito
    ) {
      setNombreVocero("");
    }
  }, [
    !idParroquia || !idComuna || idConsejoComunal || !idCrearEnComunaCircuito,
  ]);

  return (
    <>
      {idCrearEnComunaCircuito === "Comuna" && idParroquia && (
        <>
          <label className="block">
            <span className="text-gray-700 font-medium">Comunas:</span>
            <select
              value={idComuna}
              onChange={(e) => fetchConsejoComunal(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((comun) => (
                <option key={comun.id} value={comun.id}>
                  {comun.nombre}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {/* Selector de Comunas (Solo se muestra si hay parroquia seleccionada) */}
      {idComuna && (
        <label className="block mt-4">
          <span className="text-gray-700 font-medium">Consejo comunal</span>
          <select
            value={idConsejoComunal}
            onChange={(e) => fetchVoceroConsejoComunal(e.target.value)}
            className="mt-1 cursor-pointer uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Selecciona consejo comunal</option>
            {consejoPorComuna.map((consejo) => (
              <option key={consejo.id} value={consejo.id}>
                {consejo.nombre}
              </option>
            ))}
          </select>
        </label>
      )}
    </>
  );
}

function MenuDesplegable({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-md shadow-md w-full ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 color-fondo text-white font-semibold rounded-md flex justify-between items-center"
      >
        <span>Menú de opciones</span>
        <span>{isOpen ? "▲" : "▼"}</span> {/* Ícono cambia según estado */}
      </button>

      {isOpen && (
        <div className="p-4 bg-white rounded-b-lg transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

function FormularioVocero({
  nombre,
  setNombre,
  nombreDos,
  setNombreDos,
  apellido,
  setApellido,
  apellidoDos,
  setApellidoDos,
  cedula,
  setCedula,
  genero,
  setGenero,
  edad,
  setEdad,
  telefono,
  setTelefono,
  direccion,
  setDireccion,
  correo,
  setCorreo,
  proyecto,
  setProyecto,
  verificado,
  setVerificado,
  certificado,
  setCertificado,
  mostrarModal,
  cargos,
  seleccioneCargos,
  setSeleccioneCargos,
  toggleCargo,
}) {
  return (
    <div className="flex flex-col space-y-3">
      {/* Grupo: Nombre y Segundo Nombre */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Nombre:</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Segundo Nombre:</span>
          <input
            type="text"
            value={nombreDos}
            onChange={(e) => setNombreDos(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
      </div>

      {/* Grupo: Apellido y Segundo Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Apellido:</span>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Segundo Apellido:</span>
          <input
            type="text"
            value={apellidoDos}
            onChange={(e) => setApellidoDos(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
      </div>

      {/* Grupo: Cédula y Género */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Cédula:</span>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Género:</span>
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Seleccione</option>
            <option value="1">Hombre</option>
            <option value="2">Mujer</option>
          </select>
        </label>
      </div>

      {/* Grupo: Edad y Teléfono */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Edad:</span>
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Teléfono:</span>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
      </div>

      {/* Grupo: Dirección y Correo */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Dirección:</span>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Correo Electrónico:</span>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          />
        </label>
      </div>

      {/* Grupo: Proyecto y Certificado */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Proyecto:</span>
          <select
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Seleccione</option>
            <option value="1">Sí</option>
            <option value="2">No</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Verificado:</span>
          <select
            value={verificado}
            onChange={(e) => setVerificado(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Seleccione</option>
            <option value="1">Sí</option>
            <option value="2">No</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Certificado:</span>
          <select
            value={certificado}
            onChange={(e) => setCertificado(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Seleccione</option>
            <option value="1">Sí</option>
            <option value="2">No</option>
          </select>
        </label>
      </div>

      {/* Grupo: Cargos */}
      <div className="grid grid-cols-2 gap-4">
        {cargos.map((cargo) => (
          <label key={cargo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={seleccioneCargos.includes(cargo.id)}
              onChange={() => toggleCargo(cargo.id)}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <span>{cargo.nombre}</span>
          </label>
        ))}
      </div>

      {/* Botón Guardar */}
      <button
        disabled={!nombre || !cedula || !correo}
        type="bottom"
        onClick={() => mostrarModal()}
        className={`${
          !nombre || !cedula || !correo
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
      >
        Guardar
      </button>
    </div>
  );
}
