"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../modales/ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../botones/BotonesModal";
import FormCrearComuna from "../formularios/FormCrearComuna";
import ModalDatosContenedor from "../modales/ModalDatosContenedor";
import FormEditarComuna from "../formularios/FormEditarComuna";
import ModalEditar from "../modales/ModalEditar";
import ListadoComunas from "../listados/ListadoComunas";

export default function ComunasForm({
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
  const [nombreComuna, setNombreComuna] = useState("");
  const [rifComuna, setRifComuna] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");

  const [todasComunas, setTodasComunas] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [nombreParroquia, setNombreParroquia] = useState("");

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [accion, setAccion] = useState("");

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
      setTodasComunas([]); // Vacía comunas si no hay parroquia seleccionada
      return;
    }

    const fetchComunasPorParroquia = async () => {
      setIsLoading(true); // Activa la carga antes de la consulta

      try {
        const response = await axios.get(`/api/comunas/comunas-id-parroquia`, {
          params: { idParroquia: idParroquia },
        });

        setTodasComunas(response.data.comunas || []); // Guarda la respuesta correctamente
      } catch (error) {
        console.log("Error, al obtener las comunas por parroquia: " + error);
      } finally {
        setIsLoading(false); // Solo desactiva la carga después de obtener los datos
      }
    };

    if (accion !== "editar") {
      fetchComunasPorParroquia();
    }
  }, [idParroquia, accion]);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setIdComuna("");
    }
  }, [accion, mostrar]);

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const crearComuna = async () => {
    if (!nombreComuna.trim() || !idParroquia) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post("/api/comunas/crear-comuna", {
        nombre: nombreComuna,
        rif: rifComuna,
        id_parroquia: idParroquia,
      });

      setTodasComunas((prevComunas) => [...prevComunas, response.data.comunas]);

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setNombreComuna(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setRifComuna(""), tiempo: 3000 },
      ]);
    } catch (error) {
      console.log("Error, al crear la comuna: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  const editando = async (datos) => {
    try {
      setAccion("editar");
      setIdParroquia(datos.id_parroquia);
      setIdComuna(datos.id);
      setNombreComuna(datos.nombre);

      abrirModal();
    } catch (error) {
      console.log("Error, editando comuna: " + error);
    }
  };

  const editar = async () => {
    if (nombreComuna.trim()) {
      try {
        const data = {
          nombre: nombreComuna.trim(),
          id_parroquia: idParroquia,
          id_comuna: idComuna,
        };

        const response = await axios.post(
          "/api/comunas/actualizar-datos-comuna",
          data
        );

        setTodasComunas((prevComunas) =>
          prevComunas.map((comuna) =>
            comuna.id === response.data.comuna.id
              ? response.data.comuna
              : comuna
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreComuna(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdComuna(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos de la comuna: " + error);
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
          titulo={"¿Actualizar esta comuna?"}
        >
          <div className="w-full">
            <FormEditarComuna
              idParroquia={idParroquia}
              cambiarSeleccionParroquia={cambiarSeleccionParroquia}
              nombre={nombreComuna}
              setNombre={setNombreComuna}
              parroquias={parroquias}
              limpiarCampos={limpiarCampos}
              setNombreParroquia={setNombreParroquia}
              mostrarMensaje={mostrarMensaje}
              editar={editar}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear esta comuna?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Comuna"} descripcion={nombreComuna} />
            {nombreParroquia && (
              <ModalDatos titulo={"Parroquia"} descripcion={nombreParroquia} />
            )}
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearComuna}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreComuna,
              idParroquia,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear comuna"}>
          <FormCrearComuna
            idParroquia={idParroquia}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            parroquias={parroquias}
            nombre={nombreComuna}
            setNombre={setNombreComuna}
            setNombreParroquia={setNombreParroquia}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoComunas
            isLoading={isLoading}
            listado={todasComunas}
            nombreListado={"Comunas"}
            mensajeVacio={"No hay comunas disponibles..."}
            editando={editando}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
