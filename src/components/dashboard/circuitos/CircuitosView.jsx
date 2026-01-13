"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoCircuitos from "@/components/dashboard/circuitos/components/ListadoCircuitos";
import ModalCircuitos from "@/components/dashboard/circuitos/components/ModalCircuitos";
import SelectOpcion from "@/components/SelectOpcion";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";
import { fetchCircuitosIdParroquia } from "@/store/features/circuitos/thunks/circuitosIdParroquia";
import { fetchParroquias } from "@/store/features/parroquias/thunks/todasParroquias";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

export default function CircuitosView() {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { circuitos, loading } = useSelector((state) => state.circuitos);

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    } else {
      dispatch(fetchParroquias());
    }
  }, [dispatch, usuarioActivo]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [nombreParroquia, setNombreParroquia] = useState("");

  const [nombreCircuito, setNombreCircuito] = useState("");
  const [norteCircuito, setNorteCircuito] = useState("");
  const [surCircuito, setSurCircuito] = useState("");
  const [esteCircuito, setEsteCircuito] = useState("");
  const [oesteCircuito, setOesteCircuito] = useState("");
  const [direccionCircuito, setDireccionCircuito] = useState("");
  const [puntoCircuito, setPuntoCircuito] = useState("");
  const [codigoCircuito, setCodigoCircuito] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idCircuito, setIdCircuito] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreCircuito, setValidarNombreCircuito] = useState(false);
  const [validarCodigoCircuito, setValidarCodigoCodigo] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffect(() => {
    if (idPais && usuarioActivo.id_rol === 1) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais, usuarioActivo]);

  useEffect(() => {
    if (idEstado) {
      dispatch(fetchMunicipiosIdEstado(idEstado));
    }
  }, [dispatch, idEstado]);

  useEffect(() => {
    if (idMunicipio) {
      dispatch(fetchParroquiasIdMunicipio(idMunicipio));
    }
  }, [dispatch, idMunicipio]);

  useEffect(() => {
    if (idParroquia) {
      dispatch(fetchCircuitosIdParroquia(idParroquia));
    }
  }, [dispatch, idParroquia]);

  const camposBusqueda = ["nombre", "codigo"];
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "codigo", nombre: "Codigo" },
  ];

  const acciones = {
    setIdPais: setIdPais,
    setIdEstado: setIdEstado,
    setIdMunicipio: setIdMunicipio,
    setIdParroquia: setIdParroquia,
    setIdCircuito: setIdCircuito,
    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombreParroquia: setNombreParroquia,
    setNombre: setNombreCircuito,
    setNorte: setNorteCircuito,
    setSur: setSurCircuito,
    setEste: setEsteCircuito,
    setOeste: setOesteCircuito,
    setDireccion: setDireccionCircuito,
    setPunto: setPuntoCircuito,
    setCodigo: setCodigoCircuito,
  };

  const datosCircuito = {
    idPais: idPais,
    idEstado: idEstado,
    idMunicipio: idMunicipio,
    idParroquia: idParroquia,
    idCircuito: idCircuito,
    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombreParroquia: nombreParroquia,
    nombre: nombreCircuito,
    norte: norteCircuito,
    sur: surCircuito,
    este: esteCircuito,
    oeste: oesteCircuito,
    direccion: direccionCircuito,
    punto: puntoCircuito,
    codigo: codigoCircuito,
  };

  const validaciones = {
    validarNombre: validarNombreCircuito,
    setValidarNombre: setValidarNombreCircuito,
    validarCodigo: validarCodigoCircuito,
    setValidarCodigo: setValidarCodigoCodigo,
  };

  const circuitosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      circuitos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [circuitos, busqueda, ordenCampo, ordenDireccion]);

  const circuitosPaginados = useMemo(() => {
    return circuitosFiltradosOrdenados.slice(first, first + rows);
  }, [circuitosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarCircuito = (Circuito) => {
    setIdParroquia(Circuito.id_parroquia);
    setIdCircuito(Circuito.id);
    setNombreCircuito(Circuito.nombre);
    setNorteCircuito(Circuito.norte);
    setSurCircuito(Circuito.sur);
    setEsteCircuito(Circuito.este);
    setOesteCircuito(Circuito.oeste);
    setDireccionCircuito(Circuito.direccion);
    setPuntoCircuito(Circuito.punto);
    setCodigoCircuito(Circuito.codigo);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalCircuitos
        acciones={acciones}
        datosCircuito={datosCircuito}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión circuitos"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {circuitos.length !== 0 && (
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

          {usuarioActivo.id_rol === 1 ? (
            <>
              <SelectOpcion
                idOpcion={idPais}
                nombre={"Paises"}
                handleChange={(e) => {
                  cambiarSeleccionPais(e, setIdPais);
                  if (idEstado) {
                    setIdEstado("");
                  }

                  if (idMunicipio) {
                    setIdMunicipio("");
                  }

                  if (idParroquia) {
                    setIdParroquia("");
                  }
                }}
                opciones={paises}
                seleccione={"Seleccione"}
                setNombre={setNombrePais}
                indice={1}
              />
            </>
          ) : (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
              indice={1}
            />
          )}

          {idPais && (
            <SelectOpcion
              idOpcion={idEstado}
              nombre={"Estados"}
              handleChange={(e) => {
                cambiarSeleccionEstado(e, setIdEstado);
                if (idMunicipio) {
                  setIdMunicipio("");
                }

                if (idParroquia) {
                  setIdParroquia("");
                }
              }}
              opciones={estados}
              seleccione={"Seleccione"}
              setNombre={setNombreEstado}
              indice={1}
            />
          )}

          {idEstado && (
            <SelectOpcion
              idOpcion={idMunicipio}
              nombre={"Municipios"}
              handleChange={(e) => {
                cambiarSeleccionMunicipio(e, setIdMunicipio);
                if (idParroquia) {
                  setIdParroquia("");
                }
              }}
              opciones={municipios}
              seleccione={"Seleccione"}
              setNombre={setNombreMunicipio}
              indice={1}
            />
          )}

          {idMunicipio && (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
              indice={1}
            />
          )}

          {idParroquia && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {circuitos?.length === 0 && loading ? (
                  <Loader titulo="Cargando circuitos..." />
                ) : (
                  <>
                    {circuitosPaginados?.length !== 0 ? (
                      circuitosPaginados.map((circuito, index) => {
                        return (
                          <FichaDetalles
                            key={circuito.id}
                            dato={circuito}
                            index={index}
                          >
                            <ButtonToggleDetalles
                              expanded={expanded}
                              dato={circuito}
                              setExpanded={setExpanded}
                            />

                            {expanded === circuito.id && (
                              <ListadoCircuitos
                                circuito={circuito}
                                editarCircuito={editarCircuito}
                              />
                            )}
                          </FichaDetalles>
                        );
                      })
                    ) : (
                      <EstadoMsjVacio dato={circuitos} loading={loading} />
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
                  totalRecords={circuitosFiltradosOrdenados.length}
                />
              </Div>
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
