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
import FormCrearConsejo from "../formularios/FormCrearConsejo";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function ConsejoForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  // Estados para los selectores
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComunaCircuito, setIdComunaCircuito] = useState("");

  const [todosConsejos, setTodosConsejos] = useState([]);

  const [parroquias, setParroquias] = useState([]);
  const [todasComunasCircuitos, setTodasComunasCircuitos] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchParroquias = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener las parroquias: " + error);
      }
    };

    fetchParroquias();
  }, []);

  useEffect(() => {
    if (!idParroquia) {
      setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
      setTodosConsejos([]);
      setIdComunaCircuito("");
      return;
    }

    const fetchComunasCircuitosPorParroquia = async () => {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.get(`/api/comunas/comunas-id`, {
            params: { idParroquia: idParroquia },
          });
        } else if (circuitoComuna === 2) {
          response = await axios.get(`/api/circuitos/circuitos-id`, {
            params: { idParroquia: idParroquia },
          });
        }

        setTodasComunasCircuitos(
          response?.data?.comunas || response?.data?.circuitos
        );
      } catch (error) {
        console.log(
          "Error, al obtener las comunas/circuitos por parroquia: " + error
        );
      }
    };

    fetchComunasCircuitosPorParroquia();
  }, [idParroquia]);

  useEffect(() => {
    if (!idComunaCircuito) {
      setTodosConsejos([]); // Vacía comunas si no hay parroquia seleccionada
      setIdComunaCircuito("");
      return;
    }

    const fetchConsejosPorComunaCircuito = async () => {
      setIsLoading(true); // Activa la carga antes de la consulta

      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-comuna`,
            {
              params: { idComuna: idComunaCircuito },
            }
          );
        } else if (circuitoComuna === 2) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-circuito`,
            {
              params: { idCircuito: idComunaCircuito },
            }
          );
        }
        setTodosConsejos(response?.data?.consejos);
      } catch (error) {
        console.log(
          "Error, al obtener las comunas/circuitos por parroquia: " + error
        );
      } finally {
        setIsLoading(false); // Solo desactiva la carga después de obtener los datos
      }
    };

    fetchConsejosPorComunaCircuito();
  }, [idComunaCircuito]);

  useEffect(() => {
    setIdParroquia("");
    setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
    setTodosConsejos([]);
    setIdComunaCircuito("");
    setNombreConsejo("");
  }, [circuitoComuna]);


  
  const cambiarDondeGuardar = (e) => {
    const valor = e.target.value;
    setCircuitoComuna(valor);
  };

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const cambiarSeleccionComunaCircuito = (e) => {
    const valor = e.target.value;
    setIdComunaCircuito(valor);
  };

  // Manejo de envío del formulario
  const crearConsejoComunal = async () => {
    if (nombreConsejo.trim()) {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: idComunaCircuito,
            id_circuito: null,
            comunaCircuito: "comuna",
          });
        } else if (circuitoComuna === 2) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: null,
            id_circuito: idComunaCircuito,
            comunaCircuito: "circuito",
          });
        }

        setTodosConsejos([...todosConsejos, response.data.consejo]); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreConsejo(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear el consejo comunal: " + error);
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
        titulo={"¿Crear este consejo comunal?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreConsejo} />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearConsejoComunal}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreConsejo,
            idParroquia,
            idComunaCircuito,
          }}
        />
      </Modal>
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear consejo comunal"}>
          <FormCrearConsejo
            idParroquia={idParroquia}
            idComunaCircuito={idComunaCircuito}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
            cambiarDondeGuardar={cambiarDondeGuardar}
            parroquias={parroquias}
            comunasCircuitos={todasComunasCircuitos}
            dondeGuardar={circuitoComuna}
            setDondeGuardar={setCircuitoComuna}
            nombre={nombreConsejo}
            setNombre={setNombreConsejo}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todosConsejos}
            nombreListado={"Consejos comunales"}
            mensajeVacio={"No hay consejos comunales disponibles..."}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}




/**
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
import FormCrearConsejo from "../formularios/FormCrearConsejo";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

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
  // Estados para los selectores
  const [nombreVocero, setNombreVocero] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComunaCircuito, setIdComunaCircuito] = useState("");
  const [idConsejoComunal, setIdConsejoComunal] = useState("");

  const [parroquias, setParroquias] = useState([]);
  const [todasComunasCircuitos, setTodasComunasCircuitos] = useState([]);
  const [todosConsejos, setTodosConsejos] = useState([]);
  const [todosVoceros, setTodosVoceros] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchParroquias = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener las parroquias: " + error);
      }
    };

    fetchParroquias();
  }, []);

  useEffect(() => {
    if (!idParroquia) {
      setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
      setTodosConsejos([]);
      setTodosConsejos([]);
      setIdComunaCircuito("");
      setIdConsejoComunal("");
      return;
    }

    const fetchComunasCircuitosPorParroquia = async () => {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.get(`/api/comunas/comunas-id`, {
            params: { idParroquia: idParroquia },
          });
        } else if (circuitoComuna === 2) {
          response = await axios.get(`/api/circuitos/circuitos-id`, {
            params: { idParroquia: idParroquia },
          });
        }

        setTodasComunasCircuitos(
          response?.data?.comunas || response?.data?.circuitos
        );
      } catch (error) {
        console.log(
          "Error, al obtener las comunas/circuitos por parroquia: " + error
        );
      }
    };

    fetchComunasCircuitosPorParroquia();
  }, [idParroquia]);

  useEffect(() => {
    if (!idComunaCircuito) {
      setTodosConsejos([]);
      setTodosVoceros([]);
      setIdComunaCircuito("");
      setIdConsejoComunal("");
      return;
    }

    const fetchConsejosPorComunaCircuito = async () => {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-comuna`,
            {
              params: { idComuna: idComunaCircuito },
            }
          );
        } else if (circuitoComuna === 2) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-circuito`,
            {
              params: { idCircuito: idComunaCircuito },
            }
          );
        }
        setTodosConsejos(response?.data?.consejos);
      } catch (error) {
        console.log(
          "Error, al obtener las comunas/circuitos por parroquia: " + error
        );
      }
    };

    fetchConsejosPorComunaCircuito();
  }, [idComunaCircuito]);

  useEffect(() => {
    if (!idComunaCircuito) {
      setTodosConsejos([]);
      setTodosVoceros([]);
      setIdComunaCircuito("");
      setIdConsejoComunal("");
      return;
    }

    const fetchVocerosPorConsejo = async () => {
      try {
        let response = await axios.get(
          `/api/voceros/vocero-consejo-comunal-id`,
          {
            params: { idConsejo: idConsejoComunal },
          }
        );

        setTodosVoceros(response?.data?.voceros);
      } catch (error) {
        console.log(
          "Error, al obtener los voceros por consejo comunal: " + error
        );
      }
    };

    fetchVocerosPorConsejo();
  }, [idConsejoComunal]);

  useEffect(() => {
    setIdParroquia("");
    setIdComunaCircuito("");
    setIdConsejoComunal("");
    setTodasComunasCircuitos([]);
    setTodosConsejos([]);
    setTodosVoceros([]);
    setNombreVocero("");
  }, [circuitoComuna]);



  const cambiarDondeGuardar = (e) => {
    const valor = e.target.value;
    setCircuitoComuna(valor);
  };

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const cambiarSeleccionComunaCircuito = (e) => {
    const valor = e.target.value;
    setIdComunaCircuito(valor);
  };

  const cambiarSeleccionConsejo = (e) => {
    const valor = e.target.value;
    setIdConsejoComunal(valor);
  };

  // Manejo de envío del formulario
  const crearVocero = async () => {
    if (nombreVocero.trim()) {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreVocero,
            id_parroquia: idParroquia,
            id_comuna: idComunaCircuito,
            id_circuito: null,
            comunaCircuito: "comuna",
          });
        } else if (circuitoComuna === 2) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreVocero,
            id_parroquia: idParroquia,
            id_comuna: null,
            id_circuito: idComunaCircuito,
            comunaCircuito: "circuito",
          });
        }

        setTodosConsejos([...todosConsejos, response.data.consejo]); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreVocero(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear el consejo comunal: " + error);
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
        titulo={"¿Crear este consejo comunal?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreVocero} />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearConsejoComunal}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreVocero,
            idParroquia,
            idComunaCircuito,
          }}
        />
      </Modal>
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear consejo comunal"}>
          <FormCrearConsejo
            idParroquia={idParroquia}
            idComunaCircuito={idComunaCircuito}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
            cambiarDondeGuardar={cambiarDondeGuardar}
            parroquias={parroquias}
            comunasCircuitos={todasComunasCircuitos}
            dondeGuardar={circuitoComuna}
            setDondeGuardar={setCircuitoComuna}
            nombre={nombreVocero}
            setNombre={setNombreVocero}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todosConsejos}
            nombreListado={"Consejos comunales"}
            mensajeVacio={"No hay consejos comunales disponibles..."}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}

 */

