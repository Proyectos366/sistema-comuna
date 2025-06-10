"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import ComunaFormMostrar from "./ComunaFormMostrar";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import FormCrearComuna from "../formularios/FormCrearComuna";

export default function ComunasForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
}) {
  const [nombreComuna, setNombreComuna] = useState("");
  const [rifComuna, setRifComuna] = useState("");
  const [idParroquia, setIdParroquia] = useState("");

  const [nuevaComuna, setNuevaComuna] = useState([]);
  const [parroquias, setParroquias] = useState([]);

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

  const cambiarSeleccionParroquia = (e) => {
    setIdParroquia(e.target.value);
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

      setNuevaComuna(response.data.comuna);
      abrirMensaje(response.data.message);
      setTimeout(() => {
        setNombreComuna("");
        setRifComuna("");
        cerrarModal();
      }, 3000);
    } catch (error) {
      console.log(
        "Error,  al crear la comuna:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta comuna?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreComuna} />
        </div>
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
          <ComunaFormMostrar
            idParroquia={idParroquia}
            nuevaComuna={nuevaComuna}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
