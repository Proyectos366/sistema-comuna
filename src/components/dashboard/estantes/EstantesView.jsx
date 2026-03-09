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
import ListadoEstantes from "@/components/dashboard/estantes/components/ListadoEstantes";
//import ModalEstantes from "@/components/dashboard/estantes/components/ModalEstantes";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchEstantes } from "@/store/features/estantes/thunks/todosEstantes";
import { fetchEstantesInstitucion } from "@/store/features/estantes/thunks/todosEstantesInstitucion";

export default function EstantesView() {
  const dispatch = useDispatch();
  const { estantes, loading } = useSelector((state) => state.estantes);

  useEffect(() => {
    dispatch(fetchEstantesInstitucion());
  }, [dispatch]);

  const [nombreEstante, setNombreEstante] = useState("");
  const [descripcionEstante, setDescripcionEstante] = useState("");

  const [idEstante, setIdEstante] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreEstante, setValidarNombreEstante] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdEstante: setIdEstante,
    setNombre: setNombreEstante,
    setDescripcion: setDescripcionEstante,
  };

  const datosEstante = {
    idEstante: idEstante,
    nombre: nombreEstante,
    descripcion: descripcionEstante,
  };

  const validaciones = {
    validarNombre: validarNombreEstante,
    setValidarNombre: setValidarNombreEstante,
  };

  const estantesFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      estantes,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [estantes, busqueda, ordenCampo, ordenDireccion]);

  const estantesPaginados = useMemo(() => {
    return estantesFiltradosOrdenados.slice(first, first + rows);
  }, [estantesFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarEstante = (estante) => {
    setIdEstante(estante.id);
    setNombreEstante(estante.nombre);
    setDescripcionEstante(estante.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      {/* <ModalEstantes
        acciones={acciones}
        datosEstante={datosEstante}
        validaciones={validaciones}
      /> */}
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión estantes"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {estantes.length !== 0 && (
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
            {estantes?.length === 0 && loading ? (
              <Loader titulo="Cargando estantes..." />
            ) : (
              <>
                {estantesPaginados?.length !== 0 ? (
                  estantesPaginados.map((estante, index) => {
                    return (
                      <FichaDetalles
                        key={estante.id}
                        dato={estante}
                        index={index}
                      >
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={estante}
                          setExpanded={setExpanded}
                        />

                        {expanded === estante.id && (
                          <ListadoEstantes
                            estante={estante}
                            editarEstante={editarEstante}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={estantes} loading={loading} />
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
              totalRecords={estantesFiltradosOrdenados.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
