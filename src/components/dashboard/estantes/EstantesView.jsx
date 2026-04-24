"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import SelectOpcion from "@/components/SelectOpcion";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoEstantes from "@/components/dashboard/estantes/components/ListadoEstantes";
import ModalEstantes from "@/components/dashboard/estantes/components/ModalEstantes";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { cambiarSeleccionDepartamento } from "@/utils/dashboard/cambiarSeleccionDepartamento";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchEstantes } from "@/store/features/estantes/thunks/todosEstantes";
import { fetchEstantesIdDepartamento } from "@/store/features/estantes/thunks/estantesIdDepartamento";
import { fetchDepartamentos } from "@/store/features/departamentos/thunks/todosDepartamentos";
import { fetchEstantesDepartamentoMiembro } from "@/store/features/estantes/thunks/todosEstantesDepartamentoMiembro";
import { fetchTodosDepartamentosInstitucion } from "@/store/features/departamentos/thunks/todosDepartamentosInstitucion";

export default function EstantesView({ cambiarRuta, vista }) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { estantes, loading } = useSelector((state) => state.estantes);
  const { departamentos } = useSelector((state) => state.departamentos);

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchEstantes());
      dispatch(fetchDepartamentos());
    } else {
      dispatch(fetchEstantesDepartamentoMiembro());
    }
    dispatch(fetchTodosDepartamentosInstitucion());
  }, [dispatch, usuarioActivo]);

  const [nombreEstante, setNombreEstante] = useState("");
  const [descripcionEstante, setDescripcionEstante] = useState("");
  const [aliasEstante, setAliasEstante] = useState("");
  const [nivelesEstante, setNivelesEstante] = useState("");
  const [seccionesEstante, setSeccionesEstante] = useState("");

  //const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [idEstante, setIdEstante] = useState("");
  const [idDepartamento, setIdDepartamento] = useState("");
  const [borradoRestauradoEstante, setBorradoRestauradoEstante] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarAliasEstante, setValidarAliasEstante] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffect(() => {
    dispatch(fetchEstantesIdDepartamento(idDepartamento));
  }, [dispatch, idDepartamento]);

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdEstante: setIdEstante,
    setNombre: setNombreEstante,
    setDescripcion: setDescripcionEstante,
    setAlias: setAliasEstante,
    setNiveles: setNivelesEstante,
    setSecciones: setSeccionesEstante,
    setBorradoRestaurado: setBorradoRestauradoEstante,
  };

  const datosEstante = {
    idEstante: idEstante,
    nombre: nombreEstante,
    descripcion: descripcionEstante,
    alias: aliasEstante,
    niveles: nivelesEstante,
    secciones: seccionesEstante,
    borradoRestaurado: borradoRestauradoEstante,
  };

  const validaciones = {
    validarAlias: validarAliasEstante,
    setValidarAlias: setValidarAliasEstante,
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
    setNivelesEstante(estante.nivel);
    setSeccionesEstante(estante.seccion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalEstantes
        acciones={acciones}
        datosEstante={datosEstante}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión estantes"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={estantesFiltradosOrdenados}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          ordenCampo={ordenCampo}
          setOrdenCampo={setOrdenCampo}
          ordenDireccion={ordenDireccion}
          setOrdenDireccion={setOrdenDireccion}
          opcionesOrden={opcionesOrden}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {usuarioActivo.id_rol <= 2 && (
            <SelectOpcion
              idOpcion={idDepartamento}
              nombre={"Departamentos"}
              handleChange={(e) => {
                cambiarSeleccionDepartamento(e, setIdDepartamento);
              }}
              opciones={departamentos}
              seleccione={"Seleccione"}
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
                            setIdEstante={setIdEstante}
                            setBorradoRestaurado={setBorradoRestauradoEstante}
                            cambiarRuta={cambiarRuta}
                            vista={vista}
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
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
