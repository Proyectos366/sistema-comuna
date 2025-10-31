"use client";

import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";

import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Div from "@/components/padres/Div";
import Paginador from "@/components/templates/PlantillaPaginacion";
import FichaPais from "@/components/dashboard/paises/components/FichaPais";
import ButtonToggleDetallesPais from "@/components/dashboard/paises/components/ButtonToggleDetallesPais";
import ListadoPaises from "@/components/dashboard/paises/components/ListadoPaises";

export default function PaisesView() {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const [nombrePais, setNombrePais] = useState("");
  const [capitalPais, setCapitalPais] = useState("");
  const [descripcionPais, setDescripcionPais] = useState("");
  const [serialPais, setSerialPais] = useState("");

  const [idPais, setIdPais] = useState("");

  const [expanded, setExpanded] = useState("");
  const [accion, setAccion] = useState("");

  const [validarNombrePais, setValidarNombrePais] = useState("");
  const [validarCapitalPais, setValidarCapitalPais] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre", "capital", "serial"];
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "capital", nombre: "Capital" },
    { id: "serial", nombre: "Serial" },
  ];

  const paisesFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      paises,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [paises, busqueda, ordenCampo, ordenDireccion]);

  const paisesPaginados = useMemo(() => {
    return paisesFiltradosOrdenados.slice(first, first + rows);
  }, [paisesFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  // useEffect(() => {
  //   const fetchDatosPaises = async () => {
  //     try {
  //       const response = await axios.get("/api/paises/todos-paises");
  //       setTodosPaises(response.data.paises || []);
  //     } catch (error) {
  //       console.log("Error al obtener los paises:", error);
  //     } finally {
  //       setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
  //     }
  //   };

  //   fetchDatosPaises();
  // }, []);

  // useEffect(() => {
  //   if (accion === "editar" && !mostrar) {
  //     setAccion("");
  //     setIdPais("");
  //     setNombrePais("");
  //     setCapitalPais("");
  //     setDescripcionPais("");
  //   }
  // }, [accion, mostrar]);

  // useEffect(() => {
  //   if (!idPais) {
  //     setNombrePais("");
  //     setCapitalPais("");
  //     setDescripcionPais("");
  //     setSerialPais("");
  //     return;
  //   }
  // }, [idPais]);

  // const crearPais = async () => {
  //   if (nombrePais.trim()) {
  //     try {
  //       const response = await axios.post("/api/paises/crear-pais", {
  //         nombre: nombrePais,
  //         capital: capitalPais,
  //         descripcion: descripcionPais,
  //         serial: serialPais,
  //       });

  //       setTodosPaises((prev) =>
  //         prev ? [...prev, response.data.paises] : [response.data.paises]
  //       );

  //       abrirMensaje(response.data.message);

  //       ejecutarAccionesConRetraso([
  //         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setNombrePais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setCapitalPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setSerialPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //       ]);
  //     } catch (error) {
  //       console.log("Error, al crear pais: " + error);
  //       abrirMensaje(error?.response?.data?.message);
  //       ejecutarAccionesConRetraso([
  //         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
  //       ]);
  //     }
  //   }
  // };

  // const editandoPais = async (datos) => {
  //   try {
  //     setAccion("editar");
  //     setIdPais(datos.id);
  //     setNombrePais(datos.nombre);
  //     setCapitalPais(datos.capital);
  //     setDescripcionPais(datos.descripcion);

  //     abrirModal();
  //   } catch (error) {
  //     console.log("Error, editando pais: " + error);
  //   }
  // };

  // const editarPais = async () => {
  //   if (nombrePais.trim()) {
  //     try {
  //       const data = {
  //         nombre: nombrePais.trim(),
  //         capital: capitalPais,
  //         descripcion: descripcionPais,
  //         id_pais: idPais,
  //       };

  //       const response = await axios.post(
  //         "/api/paises/actualizar-datos-pais",
  //         data
  //       );

  //       setTodosPaises((prevPaises) =>
  //         prevPaises.map((paises) =>
  //           paises.id === response.data.paises.id
  //             ? response.data.paises
  //             : paises
  //         )
  //       );

  //       abrirMensaje(response.data.message);

  //       ejecutarAccionesConRetraso([
  //         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setNombrePais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setCapitalPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setIdPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //       ]);
  //     } catch (error) {
  //       console.log("Error, al actualizar datos del pais: " + error);
  //       abrirMensaje(error?.response?.data?.message);
  //       ejecutarAccionesConRetraso([
  //         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setNombrePais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setCapitalPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setDescripcionPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //         { accion: () => setIdPais(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
  //       ]);
  //     }
  //   } else {
  //     console.log("Todos los campos son obligatorios.");
  //   }
  // };

  return (
    <>
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión paises"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          <BuscadorOrdenador
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenDireccion={ordenDireccion}
            setOrdenDireccion={setOrdenDireccion}
            opcionesOrden={opcionesOrden}
          />

          <Div className={`flex flex-col gap-2`}>
            {paises?.length === 0 ? (
              <Div className="flex items-center gap-4">
                <BounceLoader color="#082158" size={50} /> Cargando paises...
              </Div>
            ) : (
              <>
                {paisesPaginados?.length !== 0 ? (
                  paisesPaginados.map((pais, index) => {
                    return (
                      <FichaPais key={pais.id} pais={pais} index={index}>
                        <ButtonToggleDetallesPais
                          expanded={expanded}
                          pais={pais}
                          setExpanded={setExpanded}
                        />

                        {expanded === pais.id && <ListadoPaises pais={pais} />}
                      </FichaPais>
                    );
                  })
                ) : (
                  <Div
                    className={`text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold`}
                  >
                    No hay coincidencias...
                  </Div>
                )}
              </>
            )}
          </Div>

          <Div>
            <Paginador
              first={first}
              setFirst={setFirst}
              rows={rows}
              setRows={setRows}
              totalRecords={paisesFiltradosOrdenados.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>

      {/* {accion === "editar" ? (
        <ModalEditar
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Actualizar este pais?"}
        >
          <div className="w-full">
            <FormEditarPais
              nombre={nombrePais}
              setNombre={setNombrePais}
              capital={capitalPais}
              setCapital={setCapitalPais}
              descripcion={descripcionPais}
              setDescripcion={setDescripcionPais}
              validarNombre={validarNombrePais}
              setValidarNombre={setValidarNombrePais}
              validarCapital={validarCapitalPais}
              setValidarCapital={setValidarCapitalPais}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarPais}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este pais?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombrePais} />
            <ModalDatos titulo={"Capital"} descripcion={capitalPais} />
            <ModalDatos titulo={"Descripción"} descripcion={descripcionPais} />
            <ModalDatos titulo={"Serial"} descripcion={serialPais} />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearPais}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombrePais,
              capitalPais,
              descripcionPais,
              serialPais,
            }}
          />
        </Modal>
      )} */}

      {/* <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear Pais"}>
          <FormCrearPais
            nombre={nombrePais}
            setNombre={setNombrePais}
            capital={capitalPais}
            setCapital={setCapitalPais}
            descripcion={descripcionPais}
            setDescripcion={setDescripcionPais}
            serial={serialPais}
            setSerial={setSerialPais}
            validarNombre={validarNombrePais}
            setValidarNombre={setValidarNombrePais}
            validarCapital={validarCapitalPais}
            setValidarCapital={setValidarCapitalPais}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoPaises
            isLoading={isLoading}
            listado={todosPaises}
            nombreListado="Paises"
            mensajeVacio="No hay paises disponibles..."
            editando={editandoPais}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar> */}
    </>
  );
}
