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
import FormCrearCargo from "../formularios/FormCrearCargo";
import ListadoGenaral from "../ListadoGeneral";

export default function CargosForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreCargo, setNombreCargo] = useState("");
  const [todosCargos, setTodosCargos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchDatosCargos = async () => {
      try {
        const response = await axios.get("/api/cargos/todos-cargos");
        setTodosCargos(response.data.cargos || []);
      } catch (error) {
        console.log("Error, al obtener las cargos: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosCargos();
  }, []);

  const crearCargo = async () => {
    if (nombreCargo.trim()) {
      try {
        const response = await axios.post("/api/cargos/crear-cargo", {
          nombre: nombreCargo,
        });
        setTodosCargos([...todosCargos, response.data.cargo]); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreCargo(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear el cargo: " + error);
      }
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear este cargo?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreCargo} />
        </div>
        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearCargo}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreCargo,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear cargo"}>
          <FormCrearCargo
            nombre={nombreCargo}
            setNombre={setNombreCargo}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>
        <DivDosDentroSectionRegistroMostrar>
          <DivDosDentroSectionRegistroMostrar>
            <ListadoGenaral
              isLoading={isLoading}
              listado={todosCargos}
              nombreListado="Cargos"
              mensajeVacio="No hay cargos disponibles..."
            />
          </DivDosDentroSectionRegistroMostrar>
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
