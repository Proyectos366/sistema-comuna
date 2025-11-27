"use client";



// Debemos crear el endpoint para consultar los departamentos por isntitución



import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";

import FichaDepartamento from "@/components/dashboard/departamentos/components/FichaDepartamento";
import ButtonToggleDetallesDepartamento from "@/components/dashboard/departamentos/components/ButtonToggleDetallesDepartamento";
import ListadoDepartamentos from "@/components/dashboard/departamentos/components/ListadoDepartamentos";
import ModalDepartamentos from "@/components/dashboard/departamentos/components/ModalDepartamentos";
import SelectOpcion from "@/components/SelectOpcion";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { cambiarSeleccionInstitucion } from "@/utils/dashboard/cambiarSeleccionInstitucion";
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

  const [expanded, setExpanded] = useState("");

  const [validarNombreInstitucion, setValidarNombreInstitucion] = useState("");

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
    setNombreInstitucion: setNombreInstitucion,
    setNombre: setNombreDepartamento,
    setDescripcion: setDescripcionDepartamento,
  };

  const datosDepartamento = {
    idInstitucion: idInstitucion,
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
  };

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarDepartamento = (departamento) => {
    setIdInstitucion(departamento.id);
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
                {loading && departamentos?.length === 0 ? (
                  <Div className="flex items-center gap-4">
                    <BounceLoader color="#082158" size={50} /> Cargando
                    departamentos...
                  </Div>
                ) : (
                  <>
                    {departamentosPaginados?.length !== 0 ? (
                      departamentosPaginados.map((departamento, index) => {
                        return (
                          <FichaDepartamento
                            key={departamento.id}
                            departamento={departamento}
                            index={index}
                          >
                            <ButtonToggleDetallesDepartamento
                              expanded={expanded}
                              departamento={departamento}
                              setExpanded={setExpanded}
                            />

                            {expanded === departamento.id && (
                              <ListadoDepartamentos
                                departamento={departamento}
                                editarDepartamento={editarDepartamento}
                              />
                            )}
                          </FichaDepartamento>
                        );
                      })
                    ) : (
                      <>
                        {departamentos.length !== 0 && (
                          <Div
                            className={`text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold`}
                          >
                            No hay coincidencias...
                          </Div>
                        )}

                        {!loading && departamentos.length === 0 && (
                          <Div className="text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold">
                            No hay departamentos para esta institución...
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
