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
import ListadoDepartamentos from "@/components/dashboard/departamentos/components/ListadoDepartamentos";
import ModalDepartamentos from "@/components/dashboard/departamentos/components/ModalDepartamentos";
import SelectOpcion from "@/components/SelectOpcion";
import EstadoMsjVacio from "@/components/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { cambiarSeleccionInstitucion } from "@/utils/dashboard/cambiarSeleccionInstitucion";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchTodasInstituciones } from "@/store/features/instituciones/thunks/todasInstituciones";
import { fetchDepartamentosIdInstitucion } from "@/store/features/departamentos/thunks/departamentosIdInstitucion";

export default function DepartamentosView() {
  const dispatch = useDispatch();
  const { instituciones } = useSelector((state) => state.instituciones);
  const { departamentos, loading } = useSelector(
    (state) => state.departamentos
  );

  useEffect(() => {
    dispatch(fetchTodasInstituciones());
  }, [dispatch]);

  const [nombreInstitucion, setNombreInstitucion] = useState("");

  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [descripcionDepartamento, setDescripcionDepartamento] = useState("");

  const [idInstitucion, setIdInstitucion] = useState("");
  const [idDepartamento, setIdDepartamento] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreInstitucion, setValidarNombreInstitucion] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  useEffect(() => {
    if (idInstitucion) {
      dispatch(fetchDepartamentosIdInstitucion(idInstitucion));
    }
  }, [dispatch, idInstitucion]);

  const acciones = {
    setIdInstitucion: setIdInstitucion,
    setIdDepartamento: setIdDepartamento,
    setNombreInstitucion: setNombreInstitucion,
    setNombre: setNombreDepartamento,
    setDescripcion: setDescripcionDepartamento,
  };

  const datosDepartamento = {
    idInstitucion: idInstitucion,
    idDepartamento: idDepartamento,
    nombreInstitucion: nombreInstitucion,
    nombre: nombreDepartamento,
    descripcion: descripcionDepartamento,
  };

  const validaciones = {
    validarNombre: validarNombreInstitucion,
    setValidarNombre: setValidarNombreInstitucion,
  };

  const departamentosFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      departamentos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [departamentos, busqueda, ordenCampo, ordenDireccion]);

  const departamentosPaginados = useMemo(() => {
    return departamentosFiltradasOrdenadas.slice(first, first + rows);
  }, [departamentosFiltradasOrdenadas, first, rows]);

  const resetearValores = () => {
    setIdInstitucion("");
    setIdDepartamento("");
    setNombreDepartamento("");
    setDescripcionDepartamento("");
  };

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarDepartamento = (departamento) => {
    setIdInstitucion(departamento.id_institucion);
    setIdDepartamento(departamento.id);
    setNombreDepartamento(departamento.nombre);
    setDescripcionDepartamento(departamento.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalDepartamentos
        acciones={acciones}
        datosDepartamento={datosDepartamento}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión departamentos"}
          funcion={() => {
            dispatch(abrirModal("crear"));
            resetearValores();
          }}
        >
          {departamentos.length !== 0 && (
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
            idOpcion={idInstitucion}
            nombre={"Instituciones"}
            handleChange={(e) => {
              cambiarSeleccionInstitucion(e, setIdInstitucion);
            }}
            opciones={instituciones}
            seleccione={"Seleccione"}
            setNombre={setNombreInstitucion}
          />

          {idInstitucion && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {departamentos?.length === 0 && loading ? (
                  <Loader titulo="Cargando departamentos..." />
                ) : (
                  <>
                    {departamentosPaginados?.length !== 0 ? (
                      departamentosPaginados.map((departamento, index) => {
                        return (
                          <FichaDetalles
                            key={departamento.id}
                            dato={departamento}
                            index={index}
                          >
                            <ButtonToggleDetalles
                              expanded={expanded}
                              dato={departamento}
                              setExpanded={setExpanded}
                            />

                            {expanded === departamento.id && (
                              <ListadoDepartamentos
                                departamento={departamento}
                                editarDepartamento={editarDepartamento}
                              />
                            )}
                          </FichaDetalles>
                        );
                      })
                    ) : (
                      <EstadoMsjVacio dato={departamentos} loading={loading} />
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
                  totalRecords={departamentosFiltradasOrdenadas.length}
                />
              </Div>
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
