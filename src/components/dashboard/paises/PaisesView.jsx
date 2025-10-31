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
import ModalPaises from "@/components/dashboard/paises/components/ModalPaises";

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

  const [expanded, setExpanded] = useState("");

  const [validarNombrePais, setValidarNombrePais] = useState("");
  const [validarCapitalPais, setValidarCapitalPais] = useState("");
  const [validarSerialPais, setValidarSerialPais] = useState("");

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

  const acciones = {
    setNombre: setNombrePais,
    setCapital: setCapitalPais,
    setDescripcion: setDescripcionPais,
    setSerial: setSerialPais,
  };

  const datosPais = {
    nombre: nombrePais,
    capital: capitalPais,
    descripcion: descripcionPais,
    serial: serialPais,
  };

  const validaciones = {
    validarNombre: validarNombrePais,
    setValidarNombrePais,
    validarCapitalPais,
    setValidarCapitalPais,
    validarSerialPais,
    setValidarSerialPais,
  };

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

  return (
    <>
      <ModalPaises
        acciones={acciones}
        datosPais={datosPais}
        validaciones={validaciones}
      />
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
