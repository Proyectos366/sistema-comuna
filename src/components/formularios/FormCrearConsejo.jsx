import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";

export default function FormCrearConsejo({
  idParroquia,
  idComunaCircuito,
  cambiarSeleccionParroquia,
  cambiarSeleccionComunaCircuito,
  parroquias,
  comunasCircuitos,
  dondeGuardar,
  setDondeGuardar,
  nombre,
  setNombre,
  abrirModal,
  limpiarCampos,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="text-gray-700 font-medium">Selecciona:</span>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value="1"
              checked={dondeGuardar === 1}
              onChange={() => setDondeGuardar(dondeGuardar === 1 ? 0 : 1)}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <span>Comuna</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value="2"
              checked={dondeGuardar === 2}
              onChange={() => setDondeGuardar(dondeGuardar === 2 ? 0 : 2)}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <span>Circuito comunal</span>
          </label>
        </div>
      </label>

      <MenuDesplegable>
        {dondeGuardar !== 0 && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={cambiarSeleccionParroquia}
            opciones={parroquias}
            seleccione={"Seleccione"}
          />
        )}

        {dondeGuardar !== 0 && idParroquia && (
          <SelectOpcion
            idOpcion={idComunaCircuito}
            nombre={dondeGuardar === 1 ? "Comunas" : "Circuitos"}
            handleChange={cambiarSeleccionComunaCircuito}
            opciones={comunasCircuitos}
            seleccione={"Seleccione"}
          />
        )}
      </MenuDesplegable>

      {dondeGuardar !== 0 && idParroquia && idComunaCircuito && (
        <>
          <LabelInput nombre={"Nombre"} value={nombre} setValue={setNombre} />

          <div className="flex space-x-3">
            <BotonAceptarCancelar
              indice={"aceptar"}
              aceptar={abrirModal}
              nombre={"Crear"}
              campos={{
                nombre,
                idParroquia,
                idComunaCircuito,
              }}
            />

            <BotonAceptarCancelar
              indice={"limpiar"}
              aceptar={() => {
                limpiarCampos({ setNombre });
              }}
              nombre={"Limpiar"}
              campos={{
                nombre,
                idParroquia,
                idComunaCircuito,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
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

export default function ConsejoForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
}) {
  // Estados para los selectores
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComunaCircuitoCircuito, setidComunaCircuitoCircuito] = useState("");

  const [todosConsejos, setTodosConsejos] = useState([]);

  const [parroquias, setParroquias] = useState([]);
  const [todasComunasCircuitos, setTodasComunasCircuitos] = useState([]);

  const [dondeGuardar, setDondeGuardar] = useState(0);

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchParroquias = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setParroquias(response.data.parroquias || []);
      } catch (error) {
        console.error("Error al obtener las parroquias:", error);
      }
    };

    fetchParroquias();
  }, []);

  useEffect(() => {
    if (!idParroquia) {
      setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
      return;
    }

    const fetchComunasCircuitosPorParroquia = async () => {
      setIsLoading(true); // Activa la carga antes de la consulta

      try {
        let response;
        if (dondeGuardar === 1) {
          response = await axios.get(`/api/comunas/comunas-id`, {
            params: { idParroquia: idParroquia },
          });
        } else if (dondeGuardar === 2) {
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
    if (!idComunaCircuitoCircuito) {
      setTodosConsejos([]); // Vacía comunas si no hay parroquia seleccionada
      return;
    }

    const fetchConsejosPorComunaCircuito = async () => {
      setIsLoading(true); // Activa la carga antes de la consulta

      try {
        let response;
        if (dondeGuardar === 1) {
          response = await axios.get(`/api/comunas/comunas-id`, {
            params: { idComunaCircuito: idComunaCircuitoCircuito },
          });
        } else if (dondeGuardar === 2) {
          response = await axios.get(`/api/circuitos/circuitos-id`, {
            params: { idCircuito: idComunaCircuitoCircuito },
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

    fetchConsejosPorComunaCircuito();
  }, [idComunaCircuitoCircuito]);

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const cambiarSeleccionComunaCircuito = (e) => {
    const valor = e.target.value;
    setidComunaCircuitoCircuito(valor);
  };

  // Manejo de envío del formulario
  const crearConsejoComunal = async () => {
    if (nombreConsejo.trim() && idParroquia.trim() && idComunaCircuito.trim()) {
      try {
        let response;
        if (dondeGuardar === 1) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: idComunaCircuito,
            id_circuito: null,
            comunaCircuito: "comuna",
          });
        } else if (dondeGuardar === 2) {
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
        console.log(
          "Error al crear el consejo comunal:",
          error.response ? error.response.data : error.message
        );
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
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreConsejo} />
        </div>
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
            idComunaCircuitoCircuito,
          }}
        />
      </Modal>
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear comuna"}>
          <FormCrearConsejo
            idParroquia={idParroquia}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
            comunasCircuitos={todasComunasCircuitos}
            parroquias={parroquias}
            dondeGuardar={dondeGuardar}
            setDondeGuardar={setDondeGuardar}
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

 */
