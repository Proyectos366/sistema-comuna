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
import ListadoNovedades from "@/components/dashboard/novedades/components/ListadoNovedades";
import ModalNovedades from "@/components/dashboard/novedades/components/ModalNovedades";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchNovedades } from "@/store/features/novedades/thunks/todasNovedades";

export default function NovedadesView() {
  const dispatch = useDispatch();
  const { novedades, loading } = useSelector((state) => state.novedades);

  useEffect(() => {
    dispatch(fetchNovedades());
  }, [dispatch]);

  const [nombreNovedad, setNombreNovedad] = useState("");
  const [descripcionNovedad, setDescripcionNovedad] = useState("");

  const [todasInstituciones, setTodasInstituciones] = useState([]);
  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [todasNovedades, setTodasNovedades] = useState([]);
  const [validarNombreNovedad, setValidarNombreNovedad] = useState(false);

  const [idNovedad, setIdNovedad] = useState("");
  const [idDepartamento, setIdDepartamento] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");
  const [idPrioridad, setIdPrioridad] = useState("");

  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [nombrePrioridad, setNombrePrioridad] = useState("");
  const [accion, setAccion] = useState("");

  const [abiertos, setAbiertos] = useState({});

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdNovedad: setIdNovedad,
    setNombre: setNombreNovedad,
    setDescripcion: setDescripcionNovedad,
  };

  const datosNovedad = {
    idNovedad: idNovedad,
    nombre: nombreNovedad,
    descripcion: descripcionNovedad,
  };

  const validaciones = {
    validarNombre: validarNombreNovedad,
    setValidarNombre: setValidarNombreNovedad,
  };

  const novedadesFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      novedades,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [novedades, busqueda, ordenCampo, ordenDireccion]);

  const novedadesPaginadas = useMemo(() => {
    return novedadesFiltradasOrdenadas.slice(first, first + rows);
  }, [novedadesFiltradasOrdenadas, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarNovedad = (novedad) => {
    setIdNovedad(novedad.id);
    setNombreNovedad(novedad.nombre);
    setDescripcionNovedad(novedad.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalNovedades
        acciones={acciones}
        datosNovedad={datosNovedad}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión Novedades"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {novedades.length !== 0 && (
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

          <Div className={`flex flex-col gap-2`}>
            {novedades?.length === 0 && loading ? (
              <Loader titulo="Cargando Novedades..." />
            ) : (
              <>
                {novedadesPaginadas?.length !== 0 ? (
                  novedadesPaginadas.map((novedad, index) => {
                    return (
                      <FichaDetalles
                        key={novedad.id}
                        dato={novedad}
                        index={index}
                      >
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={novedad}
                          setExpanded={setExpanded}
                        />

                        {expanded === novedad.id && (
                          <ListadoNovedades
                            novedad={novedad}
                            editarNovedad={editarNovedad}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={novedades} loading={loading} />
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
              totalRecords={novedadesFiltradasOrdenadas.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
