"use client";

import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";

import FichaEstado from "@/components/dashboard/estados/components/FichaEstado";
import ButtonToggleDetallesEstado from "@/components/dashboard/estados/components/ButtonToggleDetallesEstado";
import ListadoEstados from "@/components/dashboard/estados/components/ListadoEstados";
import ModalEstados from "@/components/dashboard/estados/components/ModalEstados";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import SelectOpcion from "@/components/SelectOpcion";
import { cambiarSeleccionPais } from "./funciones/cambiarSeleccionPais";

export default function EstadosView() {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);
  const { estados, loading } = useSelector((state) => state.estados);

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [capitalEstado, setCapitalEstado] = useState("");
  const [descripcionEstado, setDescripcionEstado] = useState("");
  const [codigoPostalEstado, setCodigoPostalEstado] = useState("");
  const [idPais, setIdPais] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreEstado, setValidarNombreEstado] = useState("");
  const [validarCapitalEstado, setValidarCapitalEstado] = useState("");
  const [validarCodigoPostalEstado, setValidarCodigoPostalEstado] =
    useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffect(() => {
    if (idPais) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais]);

  const camposBusqueda = ["nombre", "capital", "codigoPostal"];
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "capital", nombre: "Capital" },
    { id: "codigoPostal", nombre: "Codigo Postal" },
  ];

  const acciones = {
    setIdPais: setIdPais,
    setNombrePais: setNombrePais,
    setNombre: setNombreEstado,
    setCapital: setCapitalEstado,
    setDescripcion: setDescripcionEstado,
    setCodigoPostal: setCodigoPostalEstado,
  };

  const datosEstado = {
    idPais: idPais,
    nombrePais: nombrePais,
    nombre: nombreEstado,
    capital: capitalEstado,
    descripcion: descripcionEstado,
    codigoPostal: codigoPostalEstado,
  };

  const validaciones = {
    validarNombre: validarNombreEstado,
    setValidarNombre: setValidarNombreEstado,
    validarCapital: validarCapitalEstado,
    setValidarCapital: setValidarCapitalEstado,
    validarCodigoPostal: validarCodigoPostalEstado,
    setValidarCodigoPostal: setValidarCodigoPostalEstado,
  };

  const estadosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      estados,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [estados, busqueda, ordenCampo, ordenDireccion]);

  const estadosPaginados = useMemo(() => {
    return estadosFiltradosOrdenados.slice(first, first + rows);
  }, [estadosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  return (
    <>
      <ModalEstados
        acciones={acciones}
        datosEstado={datosEstado}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión estados"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {estados.length !== 0 && (
            <BuscadorOrdenador
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              ordenCampo={ordenCampo}
              setOrdenCampo={setOrdenCampo}
              ordenDireccion={ordenDireccion}
              setOrdenDireccion={setOrdenDireccion}
              opcionesOrden={opcionesOrden}
            />
          )}

          <SelectOpcion
            idOpcion={idPais}
            nombre={"Paises"}
            handleChange={(e) => cambiarSeleccionPais(e, setIdPais)}
            opciones={paises}
            seleccione={"Seleccione"}
            setNombre={setNombrePais}
          />

          {idPais && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {loading && estados?.length === 0 ? (
                  <Div className="flex items-center gap-4">
                    <BounceLoader color="#082158" size={50} /> Cargando
                    estados...
                  </Div>
                ) : (
                  <>
                    {estadosPaginados?.length !== 0 ? (
                      estadosPaginados.map((estado, index) => {
                        return (
                          <FichaEstado
                            key={estado.id}
                            estado={estado}
                            index={index}
                          >
                            <ButtonToggleDetallesEstado
                              expanded={expanded}
                              estado={estado}
                              setExpanded={setExpanded}
                            />

                            {expanded === estado.id && (
                              <ListadoEstados estado={estado} />
                            )}
                          </FichaEstado>
                        );
                      })
                    ) : (
                      <>
                        {estados.length !== 0 && (
                          <Div
                            className={`text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold`}
                          >
                            No hay coincidencias...
                          </Div>
                        )}

                        {!loading && estados.length === 0 && (
                          <Div className="text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold">
                            No hay estados para este país...
                          </Div>
                        )}
                      </>
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
                  totalRecords={estadosFiltradosOrdenados.length}
                />
              </Div>{" "}
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
