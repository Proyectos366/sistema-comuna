"use client";

import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";

import FichaDetalles from "@/components/FichaDetalles";

import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";

import ListadoMunicipios from "@/components/dashboard/municipios/components/ListadoMunicipios";
import ModalMunicipios from "@/components/dashboard/municipios/components/ModalMunicipios";
import SelectOpcion from "@/components/SelectOpcion";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";

export default function MunicipiosView() {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios, loading } = useSelector((state) => state.municipios);

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");

  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [descripcionMunicipio, setDescripcionMunicipio] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreMunicipio, setValidarNombreMunicipio] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffect(() => {
    if (idPais) {
      dispatch(fetchEstadosIdPais(idPais));
    }

    if (idEstado) {
      dispatch(fetchMunicipiosIdEstado(idEstado));
    }
  }, [dispatch, idPais, idEstado]);

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdPais: setIdPais,
    setIdEstado: setIdEstado,
    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombre: setNombreMunicipio,
    setDescripcion: setDescripcionMunicipio,
  };

  const datosMunicipio = {
    idPais: idPais,
    idEstado: idEstado,
    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombre: nombreMunicipio,
    descripcion: descripcionMunicipio,
  };

  const validaciones = {
    validarNombre: validarNombreMunicipio,
    setValidarNombre: setValidarNombreMunicipio,
  };

  const municipiosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      municipios,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [municipios, busqueda, ordenCampo, ordenDireccion]);

  const municipiosPaginados = useMemo(() => {
    return municipiosFiltradosOrdenados.slice(first, first + rows);
  }, [municipiosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  return (
    <>
      <ModalMunicipios
        acciones={acciones}
        datosMunicipio={datosMunicipio}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión municipios"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {municipios.length !== 0 && (
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
            }}
            opciones={paises}
            seleccione={"Seleccione"}
            setNombre={setNombrePais}
          />

          {idPais && (
            <SelectOpcion
              idOpcion={idEstado}
              nombre={"Estados"}
              handleChange={(e) => cambiarSeleccionEstado(e, setIdEstado)}
              opciones={estados}
              seleccione={"Seleccione"}
              setNombre={setNombreEstado}
            />
          )}

          {idEstado && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {municipios?.length === 0 && loading ? (
                  <Div className="flex items-center gap-4">
                    <BounceLoader color="#082158" size={50} /> Cargando
                    municipios...
                  </Div>
                ) : (
                  <>
                    {municipiosPaginados?.length !== 0 ? (
                      municipiosPaginados.map((municipio, index) => {
                        return (
                          <FichaDetalles
                            key={municipio.id}
                            dato={municipio}
                            index={index}
                          >
                            <ButtonToggleDetalles
                              expanded={expanded}
                              dato={municipio}
                              setExpanded={setExpanded}
                            />

                            {expanded === municipio.id && (
                              <ListadoMunicipios municipio={municipio} />
                            )}
                          </FichaDetalles>
                        );
                      })
                    ) : (
                      <EstadoMsjVacio dato={municipios} loading={loading} />
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
                  totalRecords={municipiosFiltradosOrdenados.length}
                />
              </Div>{" "}
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
