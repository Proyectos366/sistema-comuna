"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import ModalEditar from "../modales/ModalEditar";
import FormEditarUsuario from "../formularios/FormEditarUsuario";
import { formatearFecha } from "@/utils/Fechas";
import FormCrearEditarImg from "../formularios/FormCrearEditarImg";
import ListaDetallesVocero from "../listados/ListaDetalleVocero";

export default function MostrarPerfilUsuario({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [perfilUsuario, setPerfilUsuario] = useState([]);

  const [imagen, setImagen] = useState(null);
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarApellido, setValidarApellido] = useState(false);

  const [accion, setAccion] = useState("");

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/usuarios/usuario-perfil");

        console.log(response.data);

        setPerfilUsuario(response.data.usuarioPerfil || []);
      } catch (error) {
        console.log("Error, al obtener los datos del usuario: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosUsuario();
  }, []);

  const editandoUsuario = async (datos) => {
    try {
      setNombreUsuario(datos.nombre);
      setApellidoUsuario(datos.apellido ? datos.apellido : "");

      abrirModal();
    } catch (error) {
      console.log("Error, editando usuario: " + error);
    }
  };

  const editarUsuario = async () => {
    if (nombreUsuario.trim()) {
      try {
        const response = await axios.post(
          "/api/usuarios/actualizar-datos-usuario",
          {
            nombre: nombreUsuario,
            apellido: apellidoUsuario,
          }
        );
        setPerfilUsuario(response.data.usuario); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setApellidoUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al obtener los datos del usuario: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const crearEditarImgPerfil = async () => {
    console.log("Imagen de perfil");

    try {
      const formData = new FormData();
      formData.append("imagen", file); // asegúrate de que `imagen` sea tipo File

      const response = await axios.post(
        "/api/usuarios/actualizar-img-perfil-usuario",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPerfilUsuario(response.data.usuarioPerfil); // Suponiendo que la API devuelve el usuario actualizado
      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 },
        { accion: () => setNombreUsuario(""), tiempo: 3000 },
        { accion: () => setApellidoUsuario(""), tiempo: 3000 },
        { accion: () => setImagen(null), tiempo: 3000 },
      ]);
    } catch (error) {
      console.log("Error al actualizar la imagen de perfil: " + error);
      abrirMensaje(error?.response?.data?.message);

      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  return (
    <>
      <ModalEditar
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={
          accion === "imagen" ? "Imagen de perfil" : "¿Actualizar este cargo?"
        }
      >
        {accion === "imagen" ? (
          <FormCrearEditarImg
            imgPrevia={imagen}
            setImgVistaPrevia={setImagen}
            setFile={setFile}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            crearEditar={crearEditarImgPerfil}
          />
        ) : (
          <div className="w-full">
            <FormEditarUsuario
              nombre={nombreUsuario}
              setNombre={setNombreUsuario}
              apellido={apellidoUsuario}
              setApellido={setApellidoUsuario}
              validarNombre={validarNombre}
              setValidarNombre={setValidarNombre}
              validarApellido={validarApellido}
              setValidarApellido={setValidarApellido}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarUsuario}
              mensaje={mensaje}
            />
          </div>
        )}
      </ModalEditar>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Perfil de usuario"}>
          <div className="flex flex-col items-center gap-4 w-full bg-gray-100 rounded-md p-2 sm:p-6">
            <div className="flex items-center justify-center">
              <div className="relative group w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden shadow-lg border-4 border-[#082158] hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <img
                  src={
                    perfilUsuario?.imagenes?.[0]?.path
                      ? perfilUsuario.imagenes[0].path
                      : "/img/logo2.png"
                  }
                  alt="Foto de perfil"
                  className="rounded-full w-full h-full object-cover group-hover:scale-105 transform transition-transform duration-300 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => {
                    abrirModal();
                    setAccion("imagen");
                  }}
                  className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-sm text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  {perfilUsuario?.imagenes?.[0]?.path ? "Cambiar" : "Asignar"}
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-gray-700 w-full">
              <ListaDetallesVocero
                indice={1}
                nombre={"Nombre"}
                valor={perfilUsuario?.nombre}
              />

              <ListaDetallesVocero
                indice={1}
                nombre={"Apellido"}
                valor={perfilUsuario?.apellido}
              />

              <ListaDetallesVocero
                indice={1}
                nombre={"Correo"}
                valor={perfilUsuario?.correo}
              />

              <ListaDetallesVocero
                indice={1}
                nombre={"Rol"}
                valor={perfilUsuario?.roles?.nombre}
              />

              <ListaDetallesVocero
                indice={5}
                nombre={"Acceso"}
                valor={perfilUsuario?.validado}
              />

              <ListaDetallesVocero
                indice={1}
                nombre={"Creado"}
                valor={formatearFecha(perfilUsuario?.createdAt)}
              />

              <ListaDetallesVocero
                indice={1}
                nombre={"Departamento"}
                valor={
                  perfilUsuario?.MiembrosDepartamentos?.nombre
                    ? perfilUsuario.MiembrosDepartamentos.nombre
                    : "sin asignar"
                }
              />
            </ul>
          </div>
        </DivUnoDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
