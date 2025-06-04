import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  direccionLocal,
  Input,
  InputArchivos,
  TituloInput,
  BotonRegistro,
} from "../components/Universal";
import io from "socket.io-client";
import { VideoChat } from "../components/VideoRepro";
import { AudioChat } from "../components/AudioRepro";

export function Chat() {
  const [msj, setMsj] = useState("");
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [todosContactos, setTodosContactos] = useState([]);
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const [conversando, setConversando] = useState("");
  const [userActivo, setUserActivo] = useState("");

  const [todosMensajesNuevos, setTodosMensajesNuevos] = useState([]);
  const [todosMensajes, setTodosMensajes] = useState([]);
  const [socket, setSocket] = useState(null);
  const [todasConversaciones, setTodasConversaciones] = useState([]);

  const [menuMsjIndividual, setMenuMsjIndividual] = useState(null);
  const [openReenviar, setOpenReenviar] = useState(false);
  const [listadoContacto, setListadoContacto] = useState(false);
  const [opcionesConversacion, setOpcionesConversacion] = useState("");
  const [opcionesContactos, setOpcionesContactos] = useState("");
  const [messagejReenviado, setMessageReenviado] = useState("");
  const [perfilUsuario, setPerfilUsuario] = useState(false);

  const refMenuOpcContacto = useRef(null);
  const refMenuOpcConversacion = useRef(null);
  const refMenuOpcPerfil = useRef(null);
  const refMenuOpcMsj = useRef(null);

  const [opcsConversacion, setOpcsConversacion] = useState("");
  const [menu, setMenu] = useState(false);

  const [archivo, setArchivoMsj] = useState("");

  useEffect(() => {
    if (!hasRunOnce) {
      async function fetchData() {
        try {
          axios.defaults.withCredentials = true;
          const cookie = document.cookie;

          if (!cookie) {
            window.location.href = "/";
          } else {
            const userResponse = await axios.post(
              `${direccionLocal}/api/usuario-activo`,
              {
                cookie,
              }
            );

            if (
              userResponse.data.correo[0] &&
              userResponse.data.correo.length > 0
            ) {
              setUserActivo(userResponse.data.correo[0]);

              // Obtener todos los contactos
              const contactsResponse = await axios.post(
                `${direccionLocal}/api/todos-contactos`,
                {
                  cookie,
                }
              );

              console.log(contactsResponse.data);

              if (contactsResponse.data.status === "ok") {
                setTodosContactos(contactsResponse.data.contacto);
              }

              // Obtener todos los mensajes
              const messagesResponse = await axios.post(
                `${direccionLocal}/api/todos-mensajes`,
                {
                  cookie,
                }
              );
              setTodosMensajes(messagesResponse.data.mensaje);
              setTodosMensajesNuevos(false);

              // Obtener todas las conversaciones
              const conversationsResponse = await axios.post(
                `${direccionLocal}/api/todas-conversaciones`,
                {
                  cookie,
                }
              );
              setTodasConversaciones(conversationsResponse.data.conversaciones);

              // Conectar al servidor WebSocket
              const socketConnection = io(`${direccionLocal}`, {
                auth: {
                  cookie: cookie, // Enviar la cookie al servidor
                },
              });

              /** Si socket no funciona utilizaremos socketConnection */
              setSocket(socketConnection);

              // Suscribirse a eventos WebSocket
              socketConnection.on("nuevoContacto", (nuevoContacto) => {
                if (
                  nuevoContacto.id_usuario === userResponse.data.correo[0].id
                ) {
                  setTodosContactos((prevContactos) => ({
                    ...prevContactos,
                    [nuevoContacto.id]: nuevoContacto,
                  }));
                }
              });

              socketConnection.on("nuevoUsuario", async () => {
                try {
                  const updatedContactsResponse = await axios.post(
                    `${direccionLocal}/api/todos-contactos`,
                    {
                      cookie,
                    }
                  );
                  setTodosContactos(updatedContactsResponse.data.contacto);
                } catch (error) {
                  console.error("Update contacto, nuevo usuario: ", error);
                }
              });

              socketConnection.on("mensajes actualizados", async () => {
                try {
                  const updatedMessagesResponse = await axios.post(
                    `${direccionLocal}/api/todos-mensajes`,
                    {
                      cookie,
                    }
                  );
                  setTodosMensajes(updatedMessagesResponse.data.mensaje);
                  setTodosMensajesNuevos(false);
                } catch (error) {
                  console.log("Error al actualizar msj: ", error);
                }
              });

              socketConnection.on("chat mensaje", (data) => {
                setTodosMensajes((prevMensajes) => [
                  ...prevMensajes,
                  {
                    enviadoId: data.enviadoId,
                    recibidoId: data.recibidoId,
                    id_contacto: data.id_contacto,
                    id: data.id,
                    contenido: data.contenido,
                    nombre_contacto: data.nombre_contacto,
                    imagen: data.imagen,
                    visto: data.visto,
                    borrado: data.borrado,
                    ocultar_usuario1: data.ocultar_usuario1,
                    ocultar_usuario2: data.ocultar_usuario2,
                    id_conversacion: data.id_conversacion,
                    reenviado: data.reenviado,
                    tipo: data.tipo,
                  },
                ]);
              });

              socketConnection.on("todos mensajes", (data) => {
                setTodosMensajes((prevMensajes) => [
                  ...prevMensajes,
                  {
                    enviadoId: data.enviadoId,
                    recibidoId: data.recibidoId,
                    id_contacto: data.id_contacto,
                    id: data.id,
                    contenido: data.contenido,
                    nombre_contacto: data.nombre_contacto,
                    imagen: data.imagen,
                    visto: data.visto,
                    borrado: data.borrado,
                    ocultar_usuario1: data.ocultar_usuario1,
                    ocultar_usuario2: data.ocultar_usuario2,
                    id_conversacion: data.id_conversacion,
                    reenviado: data.reenviado,
                    tipo: data.tipo,
                  },
                ]);
              });

              socketConnection.on("todos los contactos", async () => {
                try {
                  const todosContacs = await axios.post(
                    `${direccionLocal}/api/todos-contactos`,
                    {
                      cookie,
                    }
                  );
                  setTodosContactos(todosContacs.data.contacto);
                } catch (error) {
                  console.error("Error emit, todos los contactos: ", error);
                }
              });

              socketConnection.on(
                "un contacto eliminado",
                (contactosActualizados) => {
                  setTodosContactos(contactosActualizados.contactos);
                }
              );

              socketConnection.on(
                "contacto actualizado",
                (contactoActualizado) => {
                  // Verificar si el contacto actualizado pertenece al usuario actual
                  if (
                    contactoActualizado.id_usuario ===
                    userResponse.data.correo[0].id
                  ) {
                    setTodosContactos((prevContactos) => {
                      // Crear una copia del objeto prevContactos
                      const updatedContactos = { ...prevContactos };

                      // Verificar si el contacto ya existe en la lista
                      if (updatedContactos[contactoActualizado.id]) {
                        // Actualizar el contacto en la copia
                        updatedContactos[contactoActualizado.id] =
                          contactoActualizado;

                        // Eliminar el contacto antiguo de la copia
                        delete updatedContactos[contactoActualizado.id_antiguo];
                      } else {
                        // Agregar el nuevo contacto a la copia
                        updatedContactos[contactoActualizado.id] =
                          contactoActualizado;
                      }

                      // Filtrar la copia para eliminar duplicados
                      const filteredContactos = Object.values(
                        updatedContactos
                      ).reduce((acc, contacto) => {
                        const existingContactIndex = acc.findIndex(
                          (c) => c.id === contacto.id
                        );
                        if (existingContactIndex === -1) {
                          acc.push(contacto);
                        } else {
                          // Actualizar el contacto existente con los nuevos datos
                          acc[existingContactIndex] = contacto;
                        }
                        return acc;
                      }, []);

                      // Devolver el array filtrado
                      return filteredContactos;
                    });
                  }
                }
              );

              socketConnection.on("nueva conversacion", async () => {
                try {
                  const conversationsRespons = await axios.post(
                    `${direccionLocal}/api/todas-conversaciones`,
                    {
                      cookie,
                    }
                  );
                  setTodasConversaciones(
                    conversationsRespons.data.conversaciones
                  );
                } catch (error) {
                  console.log("Error, emit nueva conversacion: ", error);
                }
              });

              // Limpiar la conexión WebsocketConnection al desmontar el componente
              return () => {
                socketConnection.disconnect();
              };
            }
          }
        } catch (error) {
          console.error("Error, useEffect:", error);
        }
      }

      fetchData();
      setHasRunOnce(true);
    }
  }, [direccionLocal, todosMensajesNuevos]);

  const handleClickOutside = (event) => {
    if (
      refMenuOpcContacto.current &&
      !refMenuOpcContacto.current.contains(event.target)
    ) {
      setOpcionesConversacion("");
      setOpcsConversacion("");
      setMenu(false);
      setMenuMsjIndividual(0);
    }

    if (
      refMenuOpcConversacion.current &&
      !refMenuOpcConversacion.current.contains(event.target)
    ) {
      setOpcionesConversacion("");
      setOpcsConversacion("");
      setMenu(false);
      setMenuMsjIndividual(0);
    }

    if (
      refMenuOpcPerfil.current &&
      !refMenuOpcPerfil.current.contains(event.target)
    ) {
      setOpcionesConversacion("");
      setOpcsConversacion("");
      setMenu(false);
      setMenuMsjIndividual(0);
    }

    if (
      refMenuOpcMsj.current &&
      !refMenuOpcMsj.current.contains(event.target)
    ) {
      setOpcionesConversacion("");
      setOpcsConversacion("");
      setMenu(false);
      setMenuMsjIndividual(0);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const nuevoMsj = () => {
    const reenviado = 0;
    guardarMsj(msj, setMsj, conversando, reenviado, archivo, setArchivoMsj);
  };

  const nuevoContacto = () => {
    const id_contact_desconocido = "";
    guardarContacto(
      nombre,
      correo,
      id_contact_desconocido,
      setCorreo,
      setNombre
    );
  };

  const toggleOpcionesConversacion = (contacto) => {
    setOpcionesConversacion((prevState) =>
      prevState?.id === contacto.id ? null : contacto
    );
  };

  const toggleMenuConversaciones = (index) => {
    setOpcsConversacion(opcsConversacion === index ? null : index);
  };

  const mostrarPerfilUsuario = () => {
    setPerfilUsuario(!perfilUsuario);
    setMenu(false);
    setConversando(null);
    setOpcionesContactos(null);
  };

  const msjReenviado = (datos) => {
    const msj = messagejReenviado.contenido;
    const reenviado = 1;
    const conversandos = { correo: datos.correo, nombre: datos.nombre };
    guardarMsj(msj, setMsj, conversandos, reenviado);
    setOpenReenviar(false);
    setConversando(datos);
  };

  return (
    <>
      {openReenviar && (
        <section className="fixed w-screen h-screen top-0 left-0 right-0 bg-[#a6ece8]">
          <div className="container mx-auto h-8 flex justify-end">
            <button
              onClick={() => setOpenReenviar(false)}
              className="text-2xl font-bold"
            >
              X
            </button>
          </div>
          <div className="container mx-auto flex flex-col h-screen">
            <span className="w-full h-10 flex items-center text-lg font-semibold text-pink-600">
              Reenviar mensaje a:
            </span>

            <div className="rounded w-full">
              <ul className="space-y-2">
                {Object.values(todosContactos)
                  .filter(
                    (contacto) =>
                      (contacto.verificado === 1 ||
                        contacto.verificado === true) &&
                      contacto.nombre !== "Desconocido" &&
                      contacto.nombre !== "Desconocidos"
                  )
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((contacto) =>
                    contacto.id_contacto === messagejReenviado.enviadoId ||
                    contacto.id_contacto ===
                      messagejReenviado.recibidoId ? null : (
                      <div
                        key={contacto.id_contacto}
                        onClick={() => msjReenviado(contacto)}
                        className="flex justify-center items-center space-x-3 px-4 py-2 bg-purple-200 cursor-pointer rounded hover:bg-gray-200"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[red]">
                          <img
                            className="w-full h-full"
                            src={`${direccionLocal}/${contacto.imagen}`}
                            alt=""
                          />
                        </div>
                        <li
                          className=""
                          onClick={(e) => {
                            setConversando(contacto);
                          }}
                        >
                          {contacto.nombre}
                        </li>
                      </div>
                    )
                  )}
              </ul>
            </div>
          </div>
        </section>
      )}
      <HeaderChat />
      <MainChat
        msj={msj}
        setMsj={setMsj}
        nuevoMsj={nuevoMsj}
        nombre={nombre}
        setNombre={setNombre}
        correo={correo}
        setCorreo={setCorreo}
        nuevoContacto={nuevoContacto}
        todosContactos={todosContactos}
        conversando={conversando}
        setConversando={setConversando}
        todosMensajes={todosMensajes}
        userActivo={userActivo}
        setUserActivo={setUserActivo}
        todasConversaciones={todasConversaciones}
        setTodasConversaciones={setTodasConversaciones}
        openReenviar={openReenviar}
        setOpenReenviar={setOpenReenviar}
        menuMsjIndividual={menuMsjIndividual}
        setMenuMsjIndividual={setMenuMsjIndividual}
        listadoContacto={listadoContacto}
        setListadoContacto={setListadoContacto}
        opcionesConversacion={opcionesConversacion}
        setOpcionesConversacion={setOpcionesConversacion}
        opcionesContactos={opcionesContactos}
        setOpcionesContactos={setOpcionesContactos}
        toggleOpcionesConversacion={toggleOpcionesConversacion}
        setMessageReenviado={setMessageReenviado}
        perfilUsuario={perfilUsuario}
        setPerfilUsuario={setPerfilUsuario}
        refMenuOpcContacto={refMenuOpcContacto}
        refMenuOpcConversacion={refMenuOpcConversacion}
        refMenuOpcPerfil={refMenuOpcPerfil}
        opcsConversacion={opcsConversacion}
        setOpcsConversacion={setOpcsConversacion}
        toggleMenuConversaciones={toggleMenuConversaciones}
        menu={menu}
        setMenu={setMenu}
        mostrarPerfilUsuario={mostrarPerfilUsuario}
        refMenuOpcMsj={refMenuOpcMsj}
        setArchivoMsj={setArchivoMsj}
        archivo={archivo}
      />
    </>
  );
}

function HeaderChat() {
  return (
    <header>
      <nav>
        <span>Inicio</span>
        <span>Mensajes</span>
        <span>Notificaciones</span>
      </nav>
    </header>
  );
}

function MainChat({
  msj,
  setMsj,
  nuevoMsj,
  correo,
  nombre,
  todosContactos,
  setCorreo,
  setNombre,
  nuevoContacto,
  conversando,
  setConversando,
  todosMensajes,
  userActivo,
  todasConversaciones,
  setTodasConversaciones,
  openReenviar,
  setOpenReenviar,
  menuMsjIndividual,
  setMenuMsjIndividual,
  listadoContacto,
  setListadoContacto,
  opcionesConversacion,
  setOpcionesConversacion,
  opcionesContactos,
  setOpcionesContactos,
  toggleOpcionesConversacion,
  setMessageReenviado,
  perfilUsuario,
  setPerfilUsuario,
  refMenuOpcContacto,
  refMenuOpcConversacion,
  refMenuOpcPerfil,
  opcsConversacion,
  setOpcsConversacion,
  toggleMenuConversaciones,
  menu,
  setMenu,
  mostrarPerfilUsuario,
  refMenuOpcMsj,
  setArchivoMsj,
  archivo,
}) {
  const [crearContacto, setCrearContacto] = useState(false);

  const eliminarUnContacto = (index) => {
    borrarUnContacto(index);
    setOpcionesConversacion(null);
  };

  const editarUnContacto = (index) => {
    setOpcionesContactos(opcionesContactos === index ? null : index);
    setConversando(null);
    setOpcionesConversacion(null);
    setPerfilUsuario(false);
  };

  const newContacto = () => {
    setCrearContacto(!crearContacto);
  };

  const listaContacto = () => {
    setListadoContacto(!listadoContacto);
  };

  const mostrarMenu = () => {
    setMenu(!menu);
  };

  const cerrarSesion = () => {
    try {
      const response = axios.get(`${direccionLocal}/api/cerrar-sesion`);
      response
        .then((data) => {
          if (data.data.status === "ok") {
            window.location.href = data.data.redirect;
          }
        })
        .catch((error) => {
          console.error("Error en la response. Chat.jsx: " + error);
        });
    } catch (error) {
      console.log("Cerrar sesion. Chat.jsx: " + error);
    }
  };

  return (
    <main className="container mx-auto flex mt-10 py-4 space-x-4 border border-red-500">
      <section className="w-1/3 space-y-5">
        <div className="space-y-2 border border-red-600 rounded">
          <button
            onClick={listaContacto}
            className="bg-purple-300 rounded w-full h-12"
          >
            Listado de contactos
          </button>

          {listadoContacto && (
            <div className="border border-black rounded w-full">
              <ul className="space-y-2">
                {Object.values(todosContactos)
                  .filter(
                    (contacto) =>
                      (contacto.verificado == 1 ||
                        contacto.verificado == true) &&
                      contacto.nombre != "Desconocido" &&
                      contacto.nombre != "Desconocidos"
                  )
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((contacto) => (
                    <div
                      key={contacto.id}
                      className="flex justify-between items-center px-4 py-2 bg-purple-200 cursor-pointer hover:bg-gray-200"
                    >
                      <div className="flex flex-1 items-center space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[red]">
                          <img
                            className="w-full h-full"
                            src={direccionLocal + "/" + contacto.imagen}
                            alt=""
                          />
                        </div>
                        <li
                          className=""
                          onClick={(e) => {
                            setConversando(contacto);
                            setOpcionesContactos(null);
                            setPerfilUsuario(false);
                          }}
                        >
                          {contacto.nombre}
                        </li>
                      </div>

                      <button
                        className="w-5"
                        onClick={() =>
                          toggleOpcionesConversacion({
                            id: contacto.id,
                            nombre: contacto.nombre,
                            correo: contacto.correo,
                          })
                        }
                      >
                        <svg
                          viewBox="0 0 30 30"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="Layer_49">
                            <path d="m13 6c0-1.6543 1.3457-3 3-3s3 1.3457 3 3-1.3457 3-3 3-3-1.3457-3-3zm3 7c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3zm0 10c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3z" />
                          </g>
                        </svg>
                      </button>
                    </div>
                  ))}

                {opcionesConversacion && (
                  <div className="absolute bg-purple-300 flex flex-col rounded text-white text-lg font-semibold p-4 space-y-2 w-40 mt-8">
                    <div ref={refMenuOpcContacto} className="space-y-2">
                      <button
                        onClick={() => eliminarUnContacto(opcionesConversacion)}
                        className="block bg-blue-200"
                      >
                        eliminar
                      </button>
                      <button
                        onClick={() => editarUnContacto(opcionesConversacion)}
                        className="block"
                      >
                        editar
                      </button>
                    </div>
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>

        <NuevoContacto
          correo={correo}
          nombre={nombre}
          setCorreo={setCorreo}
          setNombre={setNombre}
          nuevoContacto={nuevoContacto}
          newContacto={newContacto}
          crearContacto={crearContacto}
        />

        <Conversaciones
          opcionesContactos={opcionesContactos}
          setOpcionesContactos={setOpcionesContactos}
          conversando={conversando}
          setConversando={setConversando}
          todosMensajes={todosMensajes}
          todosContactos={todosContactos}
          userActivo={userActivo}
          todasConversaciones={todasConversaciones}
          setTodasConversaciones={setTodasConversaciones}
          setCorreo={setCorreo}
          setNombre={setNombre}
          setPerfilUsuario={setPerfilUsuario}
          refMenuOpcConversacion={refMenuOpcConversacion}
          opcsConversacion={opcsConversacion}
          setOpcsConversacion={setOpcsConversacion}
          toggleMenuConversaciones={toggleMenuConversaciones}
        />
      </section>

      <section className="w-2/3  border border-green-500">
        <div className="text-xl h-10 px-4 flex justify-between items-center mb-4 text-white bg-blue-500">
          <div className="flex">
            <h3>
              Usuario activo: <b>{userActivo.nombre}</b>
            </h3>
            <div className="border border-[red] ms-4 w-10 h-10">
              <img
                className="w-full h-full"
                src={
                  userActivo.length !== 0
                    ? direccionLocal + "/" + userActivo.imagen
                    : null
                }
                alt=""
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="w-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                <path d="m23.83 20-1.73-.7a3.22 3.22 0 0 1-1.05-2.3c0-2.29-.05-6.22-.05-6.37V8.92A7.76 7.76 0 0 0 13.43 1h-1.86A7.76 7.76 0 0 0 4 8.92V17a3.19 3.19 0 0 1-1.06 2.31L1.17 20a.49.49 0 0 0-.31.55.5.5 0 0 0 .49.41h6.72c.31 1.69 2.17 3 4.43 3s4.12-1.31 4.43-3h6.72a.5.5 0 0 0 .49-.41.49.49 0 0 0-.31-.55zM12.5 23a3.43 3.43 0 0 1-3.43-2h6.86a3.43 3.43 0 0 1-3.43 2zm-8.84-3A4.21 4.21 0 0 0 5 17V8.92A6.76 6.76 0 0 1 11.57 2h1.86A6.76 6.76 0 0 1 20 8.92v1.73c0 .15 0 4.08.05 6.39a4.18 4.18 0 0 0 1.3 3z" />
              </svg>
            </div>
            <button onClick={mostrarMenu} className="w-8">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_49">
                  <path d="m13 6c0-1.6543 1.3457-3 3-3s3 1.3457 3 3-1.3457 3-3 3-3-1.3457-3-3zm3 7c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3zm0 10c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3z" />
                </g>
              </svg>
            </button>
          </div>
        </div>

        {conversando && (
          <div className="border border-green-400">
            <div className="bg-blue-200 w-full h-10 flex justify-between">
              <h3>conversando con: {conversando.nombre}</h3>
              <button onClick={() => setConversando("")} className="w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                </svg>
              </button>
            </div>

            <div className="px-4">
              <Conversando
                menuMsjIndividual={menuMsjIndividual}
                setMenuMsjIndividual={setMenuMsjIndividual}
                openReenviar={openReenviar}
                setOpenReenviar={setOpenReenviar}
                todosContactos={todosContactos}
                userActivo={userActivo}
                conversando={conversando}
                todosMensajes={todosMensajes}
                setMessageReenviado={setMessageReenviado}
                refMenuOpcMsj={refMenuOpcMsj}
              />
            </div>

            <FormEnvioMensaje
              nuevoMsj={nuevoMsj}
              setArchivoMsj={setArchivoMsj}
              setMsj={setMsj}
              archivo={archivo}
              msj={msj}
              conversando={conversando}
            />
          </div>
        )}

        <OpcionesContactos
          setConversando={setConversando}
          opcionesContactos={opcionesContactos}
          setOpcionesContactos={setOpcionesContactos}
        />

        {perfilUsuario && (
          <MostrarPerfilUsuario
            userActivo={userActivo}
            setPerfilUsuario={setPerfilUsuario}
          />
        )}

        {menu && (
          <div className="absolute bg-purple-300 flex flex-col rounded text-white text-lg font-semibold top-20 right-0 p-4 space-y-2 w-60 me-20 mt-10">
            <div ref={refMenuOpcPerfil} className="space-y-2">
              <button onClick={mostrarPerfilUsuario} className="block">
                Perfil
              </button>
              <button onClick={cerrarSesion} className="block">
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function FormEnvioMensaje({
  nuevoMsj,
  setArchivoMsj,
  setMsj,
  archivo,
  msj,
  conversando,
}) {
  return (
    <div className="w-full mt-10 px-4">
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          nuevoMsj();
        }}
        className="flex items-center py-2 space-x-2"
      >
        <InputArchivos setArchivoMsj={setArchivoMsj} />
        <AudioChat
          setArchivoMsj={setArchivoMsj}
          conversando={conversando}
          setMsj={setMsj}
        />

        <Input
          className={
            "px-4 py-2 outline-none flex-1 rounded border border-purple-300"
          }
          name={"mensaje"}
          type={"text"}
          value={msj}
          placeHolder={"Nuevo mensaje"}
          onChange={(e) => setMsj(e.target.value)}
        />

        <button
          disabled={msj || archivo ? false : true}
          className="bg-purple-300 rounded w-20 h-10 "
          type="submit"
        >
          guardar
        </button>
      </form>
    </div>
  );
}

function MostrarPerfilUsuario({ userActivo, setPerfilUsuario }) {
  const cerrarPerfil = () => {
    setPerfilUsuario(false);
  };

  return (
    <>
      <section className="flex flex-col items-center border border-[#9a0dff]">
        <button
          onClick={cerrarPerfil}
          className="text-2xl absolute right-0 me-10"
        >
          x
        </button>
        <h4 className="text-xl text-center">Perfil del usaurio</h4>
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[red]">
          <img
            className="w-full h-full"
            src={direccionLocal + "/" + userActivo.imagen}
            alt="perfil"
          />
        </div>
        <div className="flex flex-col">
          <span>
            Nombre: <b>{userActivo.nombre}</b>
          </span>
          <span>
            Correo: <b>{userActivo.correo}</b>
          </span>
        </div>
      </section>
    </>
  );
}

function Conversando({
  userActivo,
  conversando,
  todosMensajes,
  todosContactos,
  openReenviar,
  setOpenReenviar,
  menuMsjIndividual,
  setMenuMsjIndividual,
  setMessageReenviado,
  refMenuOpcMsj,
}) {
  const [detalles, setDetalles] = useState(null);

  const mostrarMenuMsjIndividual = (id) => {
    setMenuMsjIndividual(menuMsjIndividual === id ? null : id);
  };

  const eliminarUnMsj = (infoMsj) => {
    borrarUnMensaje(infoMsj.id);
  };

  const reenviarUnMsj = (infoMsj) => {
    setOpenReenviar(!openReenviar);
    setMenuMsjIndividual(0);
    setMessageReenviado(infoMsj);
  };

  const detallesMensaje = (id) => {
    setDetalles(detalles === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col space-y-4 mt-4">
      {todosMensajes &&
        Object.values(todosMensajes)
          .filter(
            (msjEnviados) =>
              (msjEnviados.enviadoId == conversando.id_contacto &&
                msjEnviados.recibidoId == userActivo.id) ||
              (msjEnviados.enviadoId == userActivo.id &&
                msjEnviados.recibidoId == conversando.id_contacto)
          )
          .sort((a, b) => a.id - b.id)
          .map((mensajesTodos, index) => {
            const contacto = Object.values(todosContactos).find((datos) => {
              if (
                datos.id_contacto == mensajesTodos.enviadoId ||
                datos.id_contacto == mensajesTodos.recibidoId
              ) {
                return datos;
              }
            });

            return (
              <div
                key={index}
                className={` ${
                  mensajesTodos.ocultar_usuario1 == userActivo.id ||
                  mensajesTodos.ocultar_usuario2 == userActivo.id
                    ? "hidden"
                    : ""
                } flex w-full justify-${
                  mensajesTodos.enviadoId == userActivo.id ? "start" : "end"
                } items-start`}
              >
                {mensajesTodos.enviadoId == mensajesTodos.ocultar_usuario1 ? (
                  <>
                    {mensajesTodos.recibidoId == userActivo.id &&
                      mensajesTodos.ocultar_usuario2 == 0 && (
                        <div className="bg-gray-200 rounded-md p-2 max-w-[70%] flex ">
                          <div>
                            <p className="text-gray-600">Mensaje borrado</p>
                          </div>
                          <div className="w-[13%]">
                            <button
                              onClick={() =>
                                mostrarMenuMsjIndividual(mensajesTodos.id)
                              }
                              className="w-8 pe-2"
                            >
                              <svg
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g id="Layer_49">
                                  <path d="m13 6c0-1.6543 1.3457-3 3-3s3 1.3457 3 3-1.3457 3-3 3-3-1.3457-3-3zm3 7c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3zm0 10c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3z" />
                                </g>
                              </svg>
                            </button>
                          </div>
                          {menuMsjIndividual == mensajesTodos.id && (
                            <div className="relative">
                              <div
                                className={`absolute shadow shadow-blue-400 rounded-md w-24 px-1 text-white font-semibold space-y-1 -mt-28 flex flex-col items-center justify-center py-2 bg-pink-400 overflow-visible
                        ${
                          mensajesTodos.enviadoId != userActivo.id
                            ? "right-0 -me-10"
                            : "-ms-5 left-[50%] transform -translate-x-1/2"
                        }`}
                              >
                                <div
                                  onClick={() => reenviarUnMsj(mensajesTodos)}
                                  className="w-full flex items-center justify-center border border-black rounded hover:bg-red-500 cursor-pointer"
                                >
                                  Reenviar
                                </div>
                                <div
                                  onClick={() => eliminarUnMsj(mensajesTodos)}
                                  className="w-full flex items-center justify-center border border-black rounded hover:bg-red-500 cursor-pointer"
                                >
                                  Eliminar
                                </div>
                                <div
                                  className={`absolute w-0 h-0 border-t-8 border-t-pink-400 border-l-8 border-l-transparent border-r-8 border-r-transparent ${
                                    mensajesTodos.enviadoId !== userActivo.id
                                      ? "right-1/2 -bottom-4 transform translate-x-1/2"
                                      : "left-1/2 -bottom-4 transform -translate-x-1/2"
                                  }`}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </>
                ) : (
                  <>
                    {mensajesTodos.ocultar_usuario1 == userActivo.id ||
                    mensajesTodos.ocultar_usuario2 == userActivo.id ? null : (
                      <div className="flex flex-col w-[45%]">
                        <div
                          className={`bg-${
                            mensajesTodos.enviadoId == userActivo.id
                              ? "blue-400"
                              : "gray-300"
                          } py-2 ${
                            mensajesTodos.reenviado == 1 ||
                            mensajesTodos.reenviado == true
                              ? "rounded-t-lg"
                              : "rounded-lg"
                          }  w-[100%] cursor-pointer flex items-center justify-${
                            mensajesTodos.enviadoId == userActivo.id
                              ? "between"
                              : "between"
                          }`}
                        >
                          <img
                            className="w-6 h-6 rounded-full border-2 border-pink-400 mx-1"
                            src={
                              mensajesTodos.enviadoId == userActivo.id
                                ? direccionLocal + "/" + userActivo.imagen
                                : direccionLocal + "/" + contacto.imagen
                            }
                            alt="img mensaje que se muestra en la conversacion"
                          />
                          <div
                            onClick={() => detallesMensaje(mensajesTodos.id)}
                            className="text-gray-800 w-[60%]"
                          >
                            {mensajesTodos.tipo == "texto" ? (
                              <div>{mensajesTodos.contenido}</div>
                            ) : mensajesTodos.tipo == "imagen" ? (
                              <img
                                className="w-full h-32 rounded"
                                src={
                                  direccionLocal + "/" + mensajesTodos.contenido
                                }
                                alt=""
                              />
                            ) : mensajesTodos.tipo == "video" ? (
                              <VideoChat
                                classNames={"w-full h-32"}
                                videoUrl={mensajesTodos.contenido}
                              />
                            ) : mensajesTodos.tipo == "audio" ? (
                              <VideoChat
                                classNames={"w-full"}
                                videoUrl={mensajesTodos.contenido}
                              />
                            ) : (
                              <div>Otros</div>
                            )}

                            {detalles == mensajesTodos.id && (
                              <div className="bg-pink-100 mt-4">
                                <div>
                                  {mensajesTodos.enviadoId != userActivo.id ? (
                                    <span>
                                      Recibido:{" "}
                                      {getTimeAgo(mensajesTodos.createdAt)}
                                    </span>
                                  ) : (
                                    <span>
                                      Enviado:{" "}
                                      {getTimeAgo(mensajesTodos.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <div className="">
                                  {getTimeAgo(mensajesTodos.createdAt) !=
                                  getTimeAgo(mensajesTodos.updatedAt) ? (
                                    <div>
                                      Visto:{" "}
                                      {getTimeAgo(mensajesTodos.updatedAt)}
                                    </div>
                                  ) : (
                                    <div>Sin leer</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {menuMsjIndividual == mensajesTodos.id && (
                            <div ref={refMenuOpcMsj} className="relative">
                              <div
                                className={`absolute shadow shadow-blue-400 rounded-md w-24 px-1 text-white font-semibold space-y-1 -mt-28 flex flex-col items-center justify-center py-2 bg-pink-400 overflow-visible ${
                                  mensajesTodos.enviadoId != userActivo.id
                                    ? "right-0 -me-10"
                                    : "-ms-5 left-[50%] transform -translate-x-1/2"
                                }`}
                              >
                                <div
                                  onClick={() => reenviarUnMsj(mensajesTodos)}
                                  className="w-full flex items-center justify-center border border-black rounded hover:bg-red-500"
                                >
                                  Reenviar
                                </div>
                                <div
                                  onClick={() => eliminarUnMsj(mensajesTodos)}
                                  className="w-full flex items-center justify-center border border-black rounded hover:bg-red-500"
                                >
                                  Eliminar
                                </div>
                                <div
                                  className={`absolute w-0 h-0 border-t-8 border-t-pink-400 border-l-8 border-l-transparent border-r-8 border-r-transparent ${
                                    mensajesTodos.enviadoId != userActivo.id
                                      ? "right-1/2 -bottom-4 transform translate-x-1/2"
                                      : "left-1/2 -bottom-4 transform -translate-x-1/2"
                                  }`}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="w-[13%]">
                            <button
                              onClick={() =>
                                mostrarMenuMsjIndividual(mensajesTodos.id)
                              }
                              className="w-8 pe-2"
                            >
                              <svg
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g id="Layer_49">
                                  <path d="m13 6c0-1.6543 1.3457-3 3-3s3 1.3457 3 3-1.3457 3-3 3-3-1.3457-3-3zm3 7c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3zm0 10c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3z" />
                                </g>
                              </svg>
                            </button>
                          </div>
                        </div>
                        {mensajesTodos.reenviado == 1 ||
                        mensajesTodos.reenviado == true ? (
                          <div className="flex justify-center bg-[pink] rounded-b-lg font-semibold">
                            Reenviado
                          </div>
                        ) : null}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
    </div>
  );
}

function OpcionesContactos({
  opcionesContactos,
  setOpcionesContactos,
  setConversando,
}) {
  const [nombreContacto, setNombreContacto] = useState("");

  const nuevoNombreGuardado = (index) => {
    actualizarUnContacto(
      opcionesContactos,
      nombreContacto,
      setOpcionesContactos,
      setNombreContacto
    );
    //console.log(opcionesContactos);
  };

  return (
    <>
      {opcionesContactos && (
        <div className="border border-pink-400">
          <div className="bg-blue-200 w-full h-10 flex justify-between">
            <h3>Editando contacto</h3>
            {nombreContacto && (
              <button onClick={nuevoNombreGuardado} className="w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M18 19H19V6.82843L17.1716 5H16V9H7V5H5V19H6V12H18V19ZM4 3H18L20.7071 5.70711C20.8946 5.89464 21 6.149 21 6.41421V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM8 14V19H16V14H8Z"></path>
                </svg>
              </button>
            )}

            <button
              onClick={() => setOpcionesContactos("")}
              className="w-10 h-10"
            >
              x
            </button>
          </div>

          <div className="px-4 flex flex-col mb-2">
            <div className="flex flex-col">
              <span>Viejo nombre: </span>
              <b>{opcionesContactos.nombre}</b>
              <span>Correo: </span>
              <b>{opcionesContactos.correo}</b>
            </div>
            <span>Nuevo nombre</span>
            <input
              className="outline-none p-2 border border-black rounded"
              type="text"
              value={nombreContacto}
              onChange={(e) => setNombreContacto(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
}

function NuevoContacto({
  correo,
  nombre,
  setCorreo,
  setNombre,
  nuevoContacto,
  newContacto,
  crearContacto,
}) {
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarCorreoContacto, setValidarCorreoContacto] = useState(false);

  return (
    <>
      <button
        onClick={newContacto}
        className="bg-purple-300 rounded w-full h-10"
      >
        Nuevo contacto
      </button>
      {crearContacto && (
        <div className="border border-black rounded p-2">
          <h6>Nuevo contacto</h6>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nuevoContacto();
            }}
            className="flex flex-col space-y-2"
          >
            <div>
              <TituloInput nombre={"Nombre"} />
              <Input
                validar={"nombre"}
                validarNombre={validarNombre}
                setValidarNombre={setValidarNombre}
                name={"nombre"}
                type={"text"}
                value={nombre}
                placeHolder={"ejemplo: Carlos"}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <TituloInput nombre={"Correo"} />
              <Input
                validarCorreoContacto={validarCorreoContacto}
                setValidarCorreoContacto={setValidarCorreoContacto}
                validar={"correoC"}
                name={"correo"}
                type={"email"}
                value={correo}
                placeHolder={"ejemplo@ejemplo.com"}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div>
              <BotonRegistro
                disabled={!validarNombre || !validarCorreoContacto}
                type={"submit"}
                nombre={"Guardar"}
                className={`${
                  !validarNombre || !validarCorreoContacto
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Conversaciones({
  todasConversaciones,
  setConversando,
  todosContactos,
  todosMensajes,
  userActivo,
  conversando,
  setCorreo,
  setNombre,
  opcionesContactos,
  setOpcionesContactos,
  setPerfilUsuario,
  refMenuOpcConversacion,
  toggleMenuConversaciones,
  opcsConversacion,
  setOpcsConversacion,
}) {
  const [msjVisto, setMsjVisto] = useState("");

  const eliminarConversacion = (index) => {
    console.log(`Conversación ${index} eliminada...`);
    borrarUnaConversacion(index);
    setOpcsConversacion(null);
    setConversando(null);
  };

  const mensajeVisto = (mensajeVisto) => {
    console.log("Mensaje visto: " + mensajeVisto);
    mensajeLeido(mensajeVisto);
  };

  const mostrarConversacion = (contacto) => {
    setConversando(contacto);
  };

  return (
    <div className="flex flex-col space-y-2 pb-4">
      {todasConversaciones &&
        Object.values(todasConversaciones).map((conversation, index) => {
          const contacto =
            todosContactos &&
            Object.values(todosContactos).find((datos) => {
              if (
                datos.id_contacto == conversation.id_usuario1 ||
                datos.id_contacto == conversation.id_usuario2
              ) {
                return datos;
              }
            });

          if (contacto) {
          } else {
            const nombreD = "Desconocidos";
            const correoD = "";
            const id_contact_desconocido = conversation.id_usuario1;
            guardarContacto(
              nombreD,
              correoD,
              id_contact_desconocido,
              setCorreo,
              setNombre
            );
          }

          const ultimoMensaje =
            todosMensajes &&
            Object.values(todosMensajes)
              .filter((datos) => {
                return (
                  datos.id_conversacion == conversation.id && // Filtrar por id_conversacion
                  ((datos.ocultar_usuario1 == 0 &&
                    datos.ocultar_usuario2 != userActivo.id) ||
                    (datos.ocultar_usuario1 == 0 &&
                      datos.ocultar_usuario2 == 0))
                );
              })
              .reduce((prev, current) => {
                if (!prev) {
                  return current;
                }
                return prev.createdAt > current.createdAt ? prev : current;
              }, null);

          const ultimoMensajeBorrado =
            todosMensajes &&
            Object.values(todosMensajes)
              .filter((datos) => {
                return datos.recibidoId == userActivo.id;
              })
              .reduce((prev, current) => {
                if (!prev) {
                  return current;
                }
                return prev.createdAt > current.createdAt ? prev : current;
              }, null);

          if (
            conversando &&
            ultimoMensaje &&
            !ultimoMensaje.visto &&
            ultimoMensaje.enviadoId != userActivo.id
          ) {
            if (conversando.id == contacto.id) {
              mensajeVisto(conversation.id);
            }
          } else if (
            conversando &&
            ultimoMensajeBorrado &&
            !ultimoMensajeBorrado.visto &&
            ultimoMensajeBorrado.enviadoId != userActivo.id
          ) {
            if (conversando.id == contacto.id) {
              mensajeVisto(conversation.id);
            }
          }

          let contar = 0;
          const mensajesSinLeer =
            todosMensajes &&
            Object.values(todosMensajes).filter((msjSinLeer) => {
              if (
                msjSinLeer.visto == false &&
                ((msjSinLeer.enviadoId == conversation.id_usuario1 &&
                  msjSinLeer.recibidoId == conversation.id_usuario2) ||
                  (msjSinLeer.enviadoId == conversation.id_usuario2 &&
                    msjSinLeer.recibidoId == conversation.id_usuario1))
              ) {
                contar++;
                return true;
              }
              return false;
            });

          return (
            <article
              key={conversation.id}
              onClick={(e) => {
                setPerfilUsuario(false);
                setOpcionesContactos(null);
                if (
                  (ultimoMensaje ? ultimoMensaje : ultimoMensajeBorrado) &&
                  !(ultimoMensaje ? ultimoMensaje : ultimoMensajeBorrado)
                    .visto &&
                  (ultimoMensaje ? ultimoMensaje : ultimoMensajeBorrado)
                    .enviadoId != userActivo.id
                ) {
                  mensajeVisto(conversation.id);
                }
              }}
              className={`
              ${
                conversation.ocultar_usuario1 == userActivo.id
                  ? "hidden"
                  : conversation.ocultar_usuario2 == userActivo.id
                  ? "hidden"
                  : "sm:flex"
              } hidden flex-col items-center cursor-pointer border border-[#8dfa6f] bg-white shadow-md rounded-lg`}
            >
              <div className="w-full flex justify-end">
                <button
                  onClick={() => toggleMenuConversaciones(conversation.id)}
                  className="w-8 pt-2"
                >
                  <svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
                    <g id="Layer_49">
                      <path d="m13 6c0-1.6543 1.3457-3 3-3s3 1.3457 3 3-1.3457 3-3 3-3-1.3457-3-3zm3 7c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3zm0 10c-1.6543 0-3 1.3457-3 3s1.3457 3 3 3 3-1.3457 3-3-1.3457-3-3-3z" />
                    </g>
                  </svg>
                </button>
              </div>

              {opcsConversacion == conversation.id && (
                <div className="absolute bg-purple-300 flex flex-col rounded text-white text-lg font-semibold p-4 space-y-2 w-40 mt-8">
                  <div ref={refMenuOpcConversacion} className="space-y-2">
                    <button
                      onClick={() => eliminarConversacion(conversation.id)}
                      className="block"
                    >
                      eliminar
                    </button>
                  </div>
                </div>
              )}

              <div
                onClick={(e) => mostrarConversacion(contacto)}
                className="flex -mt-4"
              >
                <img
                  className="w-12 h-12 rounded-full border-2 border-pink-400 mr-4"
                  src={contacto ? direccionLocal + "/" + contacto.imagen : null}
                  alt="img del contacto en los msj"
                />

                <div className="flex-1">
                  <h5 className="text-lg font-medium text-gray-900">
                    {contacto ? contacto.nombre : "Desconocido"}
                  </h5>

                  <p className="text-gray-600 w-24">
                    {ultimoMensaje && ultimoMensaje.contenido.slice(0, 11)}
                  </p>

                  <span className="text-gray-500 text-sm">
                    {ultimoMensaje ? getTimeAgo(ultimoMensaje.createdAt) : ""}
                  </span>

                  {(ultimoMensaje && !ultimoMensajeBorrado
                    ? ultimoMensaje
                    : ultimoMensajeBorrado) &&
                    !(
                      ultimoMensaje && !ultimoMensajeBorrado
                        ? ultimoMensaje
                        : ultimoMensajeBorrado
                    ).visto &&
                    (ultimoMensaje && !ultimoMensajeBorrado
                      ? ultimoMensaje
                      : ultimoMensajeBorrado
                    ).enviadoId != userActivo.id && (
                      <span
                        className={`${
                          mensajesSinLeer && mensajesSinLeer.length == 0
                            ? "hidden"
                            : ""
                        } bg-[#de15ec] text-white px-2 py-1 rounded-full text-xs ml-2`}
                      >
                        Nuevo {mensajesSinLeer.length}
                      </span>
                    )}
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}

async function guardarContacto(
  nombre,
  correo,
  id_contact_desconocido,
  setCorreo,
  setNombre
) {
  axios.defaults.withCredentials = true;
  const cookie = document.cookie;
  try {
    const response = await axios.post(`${direccionLocal}/api/crear-contacto`, {
      nombre,
      correo,
      id_contact_desconocido,
      cookie,
    });

    console.log(response.data);

    if (!id_contact_desconocido) {
      setCorreo("");
      setNombre("");
    }
  } catch (error) {
    console.error("Error al registrar el nuevo contacto:", error);
  }
}

export async function guardarMsj(
  msj,
  setMsj,
  conversando,
  reenviado,
  archivo,
  setArchivoMsj
) {
  try {
    axios.defaults.withCredentials = true;
    const cookie = document.cookie;
    const recibido = conversando.correo;
    const nombre = conversando.nombre;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append(
      "archivo",
      archivo && archivo.archivo ? archivo.archivo : archivo
    );
    formData.append("recibido", recibido);
    formData.append("cookie", cookie);
    formData.append("msj", msj);
    formData.append("reenviado", reenviado);

    if (cookie) {
      const response = await axios.post(
        `${direccionLocal}/api/nuevo-mensaje`,
        formData
      );

      console.log(response.data);

      setMsj("");
      setArchivoMsj("");

      // // Conectar al servidor WebSocket
      // const socket = io(`${direccionLocal}`, {
      //   auth: {
      //     cookie: cookie,
      //   },
      // });

      // // Cliente
      // socket.emit("chat mensaje", msj, recibido, nombre);

      // // Limpiar la conexión WebSocket al desmontar el componente
      // return () => {
      //   socket.disconnect();
      // };
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

async function borrarUnContacto(contacto) {
  try {
    axios.defaults.withCredentials = true;
    const cookie = document.cookie;

    if (cookie) {
      const response = await axios.put(
        `${direccionLocal}/api/eliminar-un-contacto`,
        {
          cookie,
          id: contacto.id,
        }
      );

      console.log(response.data);

      // Conectar al servidor WebSocket
      const socket = io(`${direccionLocal}`, {
        auth: {
          cookie: cookie,
        },
      });

      // Cliente
      socket.emit("todos los contactos");

      // Limpiar la conexión WebSocket al desmontar el componente
      return () => {
        socket.disconnect();
      };
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

async function actualizarUnContacto(
  datos,
  nombre,
  setOpcionesContactos,
  setNombreContacto
) {
  try {
    axios.defaults.withCredentials = true;
    const cookie = document.cookie;

    if (cookie) {
      const response = await axios.post(
        `${direccionLocal}/api/actualizar-un-contacto`,
        {
          cookie,
          id: datos.id,
          nombre: nombre,
        }
      );

      console.log(response.data);

      // Conectar al servidor WebSocket
      const socket = io(`${direccionLocal}`, {
        auth: {
          cookie: cookie,
        },
      });

      // Cliente
      socket.emit("todos los contactos");
      setOpcionesContactos("");
      setNombreContacto("");

      // Limpiar la conexión WebSocket al desmontar el componente
      return () => {
        socket.disconnect();
      };
    }
  } catch (error) {
    console.error("Actualizando un contacto: ", error);
  }
}

async function mensajeLeido(id) {
  try {
    axios.defaults.withCredentials = true;
    const cookie = document.cookie;

    if (cookie) {
      const response = await axios.post(
        `${direccionLocal}/api/leer-un-mensaje-recibido`,
        {
          cookie,
          id: id,
        }
      );

      console.log(response.data);
    }
  } catch (error) {
    console.error("Actualizando un contacto: ", error);
  }
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
    return `${seconds} segundos`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutos`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} horas`;
  } else if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} días`;
  } else if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `${weeks} semanas`;
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months} meses`;
  } else if (seconds > 31536000) {
    const years = Math.floor(seconds / 31536000);
    return `${years} años`;
  } else {
    return "0 segundos";
  }
}

async function borrarUnMensaje(idMsj) {
  try {
    axios.defaults.withCredentials = true;
    const cookie = document.cookie;

    if (cookie) {
      const response = await axios.post(
        `${direccionLocal}/api/eliminar-un-mensaje`,
        {
          cookie,
          id: idMsj,
        }
      );

      console.log(response.data);
    }
  } catch (error) {
    console.error("Eliminar un mensaje: ", error);
  }
}

async function borrarUnaConversacion(id) {
  try {
    axios.defaults.withCredentials = true;
    const cookie = document.cookie;
    if (cookie) {
      const response = await axios.put(
        `${direccionLocal}/api/eliminar-una-conversacion`,
        {
          cookie,
          id: id,
        }
      );

      console.log(response.data);

      // Conectar al servidor WebSocket
      const socket = io(`${direccionLocal}`, {
        auth: {
          cookie: cookie,
        },
      });

      // Cliente
      socket.emit("nueva conversacion");

      // Limpiar la conexión WebSocket al desmontar el componente
      return () => {
        socket.disconnect();
      };
    }
  } catch (error) {
    console.error("Error eliminando conversacion:", error);
  }
}
