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
import FormCrearComuna from "../formularios/FormCrearComuna";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function ComunasForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreComuna, setNombreComuna] = useState("");
  const [rifComuna, setRifComuna] = useState("");
  const [idParroquia, setIdParroquia] = useState("");

  const [todasComunas, setTodasComunas] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

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
        const response = await axios.get(`/api/comunas/comunas-id`, {
          params: { idParroquia: idParroquia },
        });

        setTodasComunas(response.data.comunas || []); // Guarda la respuesta correctamente
      } catch (error) {
        console.log("Error, al obtener las comunas por parroquia: " + error);
      } finally {
        setIsLoading(false); // Solo desactiva la carga después de obtener los datos
      }
    };

    fetchComunasPorParroquia();
  }, [idParroquia]);

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

      setTodasComunas((prevComunas) => [...prevComunas, response.data.comuna]);

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

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta comuna?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreComuna} />
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
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear comuna"}>
          <FormCrearComuna
            idParroquia={idParroquia}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            parroquias={parroquias}
            nombre={nombreComuna}
            setNombre={setNombreComuna}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todasComunas}
            nombreListado={"Comunas"}
            mensajeVacio={"No hay comunas disponibles..."}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
