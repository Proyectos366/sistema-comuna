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
import FormCrearParroquia from "../formularios/FormCrearParroquia";
import ListadoParroquias from "../formularios/listados/ListadoParroquias";

export default function ParroquiasForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
}) {
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [todasParroquias, setTodasParroquias] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchDatosParroquia = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setTodasParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error al obtener las parroquias:", error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosParroquia();
  }, []);

  const crearParroquia = async () => {
    if (nombreParroquia.trim()) {
      try {
        const response = await axios.post("/api/parroquias/crear-parroquia", {
          nombre: nombreParroquia,
        });

        setTodasParroquias((prev) =>
          prev ? [...prev, response.data.parroquia] : [response.data.parroquia]
        );
        setNombreParroquia("");
        abrirMensaje(response.data.message);

        setTimeout(() => {
          cerrarModal();
        }, 3000);
      } catch (error) {
        console.error("Error al crear la parroquia:", error);
      }
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta parroquia?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreParroquia} />
        </div>
        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearParroquia}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreParroquia,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear parroquia"}>
          <FormCrearParroquia
            nombre={nombreParroquia}
            setNombre={setNombreParroquia}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>
        <DivDosDentroSectionRegistroMostrar>
          {isLoading ? (
            <p className="text-center text-gray-600">Cargando parroquias...</p>
          ) : todasParroquias?.length > 0 ? (
            <ListadoParroquias
              nombreListado={"Parroquias"}
              parroquias={todasParroquias}
            />
          ) : (
            <p className="text-center text-gray-600">
              No hay parroquias disponibles.
            </p>
          )}
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
import FormCrearParroquia from "../formularios/FormCrearParroquia";

import ListadoParroquias from "../formularios/listados/ListadoParroquias";

export default function ParroquiasForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
}) {
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [todasParroquias, setTodasParroquias] = useState([]);

  useEffect(() => {
    const fetchDatosParroquia = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setTodasParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener las parroquias: " + error);
      }
    };

    fetchDatosParroquia();
  }, []);

  const crearParroquia = async () => {
    if (nombreParroquia.trim()) {
      try {
        const response = await axios.post("/api/parroquias/crear-parroquia", {
          nombre: nombreParroquia,
        });
        setTodasParroquias([...todasParroquias, response.data.parroquia]); // Suponiendo que la API devuelve el nombre guardado
        setNombreParroquia("");
        abrirMensaje(response.data.message);
        setTimeout(() => {
          setNombreParroquia("");
          cerrarModal();
        }, 3000);
      } catch (error) {
        console.error("Error al crear la parroquia:", error);
      }
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta parroquia?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreParroquia} />
        </div>
        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearParroquia}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreParroquia,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear parroquia"}>
          <FormCrearParroquia
            nombre={nombreParroquia}
            setNombre={setNombreParroquia}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>
        <DivDosDentroSectionRegistroMostrar>
          <ListadoParroquias
            nombreListado={'Parroquias'}
            parroquias={todasParroquias}
          />          
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}

*/

/**
 <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
  <div className="w-full max-w-lg bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Crear parroquia</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Nombre:</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Guardar
      </button>
    </form>
  </div>

  <div className="w-full max-w-lg mt-6 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
    <h3 className="text-lg font-bold mb-3 text-center text-gray-800">todasParroquias Guardados</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="borde-fondo p-3 text-left">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {todasParroquias.map((parroquia, index) => (
            <tr key={index} className="hover:bg-gray-100 transition-colors">
              <td className="borde-fondo p-3">{parroquia.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
 */

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
import FormCrearParroquia from "../formularios/FormCrearParroquia";

import ListadoParroquias from "../formularios/listados/ListadoParroquias";

export default function ParroquiasForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
}) {
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [todasParroquias, setTodasParroquias] = useState([]);

  useEffect(() => {
    const fetchDatosParroquia = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setTodasParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener las parroquias: " + error);
      }
    };

    fetchDatosParroquia();
  }, []);

  const crearParroquia = async () => {
    if (nombreParroquia.trim()) {
      try {
        const response = await axios.post("/api/parroquias/crear-parroquia", {
          nombre: nombreParroquia,
        });
        setTodasParroquias([...todasParroquias, response.data.parroquia]); // Suponiendo que la API devuelve el nombre guardado
        setNombreParroquia("");
        abrirMensaje(response.data.message);
        setTimeout(() => {
          setNombreParroquia("");
          cerrarModal();
        }, 3000);
      } catch (error) {
        console.error("Error al crear la parroquia:", error);
      }
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta parroquia?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreParroquia} />
        </div>
        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearParroquia}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreParroquia,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear parroquia"}>
          <FormCrearParroquia
            nombre={nombreParroquia}
            setNombre={setNombreParroquia}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>
        <DivDosDentroSectionRegistroMostrar>
          <ListadoParroquias
            nombreListado={'Parroquias'}
            parroquias={todasParroquias}
          />          
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}

 */
