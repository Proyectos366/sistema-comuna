"use client";

import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";

import FichaInstitucion from "@/components/dashboard/instituciones/components/FichaInstitucion";
import ButtonToggleDetallesInstitucion from "@/components/dashboard/instituciones/components/ButtonToggleDetallesInstitucion";
import ListadoInstituciones from "@/components/dashboard/instituciones/components/ListadoInstituciones";
import ModalInstituciones from "@/components/dashboard/instituciones/components/ModalInstituciones";
import SelectOpcion from "@/components/SelectOpcion";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";
import { fetchInstitucionesIdMunicipio } from "@/store/features/instituciones/thunks/institucionesIdMunicipio";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

export default function InstitucionesView() {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { instituciones, loading } = useSelector(
    (state) => state.instituciones
  );

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [nombreParroquia, setNombreParroquia] = useState("");

  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [descripcionInstitucion, setDescripcionInstitucion] = useState("");
  const [rifInstitucion, setRifInstitucion] = useState("");
  const [sectorInstitucion, setSectorInstitucion] = useState("");
  const [direccionInstitucion, setDireccionInstitucion] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreInstitucion, setValidarNombreInstitucion] = useState("");
  const [validarRifInstitucion, setValidarRifInstitucion] = useState("");

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

  useEffect(() => {
    if (idEstado) {
      dispatch(fetchMunicipiosIdEstado(idEstado));
    }
  }, [dispatch, idEstado]);

  useEffect(() => {
    if (idMunicipio) {
      dispatch(fetchParroquiasIdMunicipio(idMunicipio));
      dispatch(fetchInstitucionesIdMunicipio(idMunicipio));
    }
  }, [dispatch, idMunicipio]);

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "sector", nombre: "Sector" },
    { id: "rif", nombre: "Rif" },
  ];

  const acciones = {
    setIdPais: setIdPais,
    setIdEstado: setIdEstado,
    setIdMunicipio: setIdMunicipio,
    setIdParroquia: setIdParroquia,
    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombreParroquia: setNombreParroquia,
    setNombre: setNombreInstitucion,
    setDescripcion: setDescripcionInstitucion,
    setRif: setRifInstitucion,
    setSector: setSectorInstitucion,
    setDireccion: setDireccionInstitucion,
  };

  const datosInstitucion = {
    idPais: idPais,
    idEstado: idEstado,
    idMunicipio: idMunicipio,
    idParroquia: idParroquia,
    idInstitucion: idInstitucion,
    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombreParroquia: nombreParroquia,
    nombre: nombreInstitucion,
    descripcion: descripcionInstitucion,
    rif: rifInstitucion,
    sector: sectorInstitucion,
    direccion: direccionInstitucion,
  };

  const validaciones = {
    validarNombre: validarNombreInstitucion,
    setValidarNombre: setValidarNombreInstitucion,
    validarRif: validarRifInstitucion,
    setValidarRif: setValidarRifInstitucion,
  };

  const institucionesFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      instituciones,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [instituciones, busqueda, ordenCampo, ordenDireccion]);

  const institucionesPaginadas = useMemo(() => {
    return institucionesFiltradasOrdenadas.slice(first, first + rows);
  }, [institucionesFiltradasOrdenadas, first, rows]);

  const resetearValores = () => {
    setIdPais("");
    setIdEstado("");
    setIdMunicipio("");
    setIdParroquia("");
  };

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarInstitucion = (institucion) => {
    setIdPais(institucion.id_pais);
    setIdEstado(institucion.id_estado);
    setIdMunicipio(institucion.id_municipio);
    setIdParroquia(institucion.id_parroquia);
    setIdInstitucion(institucion.id);
    setNombreInstitucion(institucion.nombre);
    setDescripcionInstitucion(institucion.descripcion);
    setRifInstitucion(institucion.rif);
    setSectorInstitucion(institucion.sector);
    setDireccionInstitucion(institucion.direccion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalInstituciones
        acciones={acciones}
        datosInstitucion={datosInstitucion}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión instituciones"}
          funcion={() => {
            dispatch(abrirModal("crear"));
            resetearValores();
          }}
        >
          {instituciones.length !== 0 && (
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
          />

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
            />
          )}

          {idParroquia && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {loading && instituciones?.length === 0 ? (
                  <Div className="flex items-center gap-4">
                    <BounceLoader color="#082158" size={50} /> Cargando
                    instituciones...
                  </Div>
                ) : (
                  <>
                    {institucionesPaginadas?.length !== 0 ? (
                      institucionesPaginadas.map((institucion, index) => {
                        return (
                          <FichaInstitucion
                            key={institucion.id}
                            institucion={institucion}
                            index={index}
                          >
                            <ButtonToggleDetallesInstitucion
                              expanded={expanded}
                              institucion={institucion}
                              setExpanded={setExpanded}
                            />

                            {expanded === institucion.id && (
                              <ListadoInstituciones
                                institucion={institucion}
                                editarInstitucion={editarInstitucion}
                              />
                            )}
                          </FichaInstitucion>
                        );
                      })
                    ) : (
                      <>
                        {instituciones.length !== 0 && (
                          <Div
                            className={`text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold`}
                          >
                            No hay coincidencias...
                          </Div>
                        )}

                        {!loading && instituciones.length === 0 && (
                          <Div className="text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold">
                            No hay instituciones para este municipio...
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
                  totalRecords={institucionesFiltradasOrdenadas.length}
                />
              </Div>{" "}
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
