"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import SectionMain from "@/components/SectionMain";
import SectionPrimary from "@/components/SectionPrimary";
import Div from "@/components/padres/Div";
import SectionTertiary from "@/components/SectionTertiary";
import ListadoUsuarios from "@/components/dashboard/usuarios/components/ListadoUsuarios";
import ButtonToggleDetallesUsuario from "@/components/dashboard/usuarios/components/ButtonToggleDetallesUsuario";
import LeyendaUsuarios from "@/components/dashboard/usuarios/components/LeyendaUsuarios";
import FichaUsuario from "@/components/dashboard/usuarios/components/FichaUsuario";
import ModalUsuarios from "@/components/dashboard/usuarios/components/ModalUsuarios";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { fetchUsuarios } from "@/store/features/usuarios/thunks/todosUsuarios";
import { abrirModal } from "@/store/features/modal/slicesModal";
import SectionQuaternary from "@/components/SectionQuaternary";

export default function UsuariosView() {
  const dispatch = useDispatch();
  const { usuarios, loading } = useSelector((state) => state.usuarios);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const [cedulaUsuario, setCedulaUsuario] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [claveUnoUsuario, setClaveUnoUsuario] = useState("");
  const [claveDosUsuario, setClaveDosUsuario] = useState("");
  const [mensajeValidar, setMensajeValidar] = useState("");

  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  const [idDepartamento, setIdDepartamento] = useState("");
  const [idRol, setIdRol] = useState("");
  const [nombreRol, setNombreRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");

  const [expanded, setExpanded] = useState("");
  const [accion, setAccion] = useState("");

  const [firstActivos, setFirstActivos] = useState(0);
  const [firstInactivos, setFirstInactivos] = useState(0);
  const [rows, setRows] = useState(25);

  const [validarCedulaUsuario, setValidarCedulaUsuario] = useState(false);
  const [validarCorreoUsuario, setValidarCorreoUsuario] = useState(false);
  const [validarNombreUsuario, setValidarNombreUsuario] = useState(false);
  const [validarApellidoUsuario, setValidarApellidoUsuario] = useState(false);
  const [validarClaveUsuario, setValidarClaveUsuario] = useState(false);

  const [autorizar, setAutorizar] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["cedula", "nombre", "apellido", "correo"];
  const opcionesOrden = [
    { id: "cedula", nombre: "Cédula" },
    { id: "correo", nombre: "Correo" },
    { id: "nombre", nombre: "Nombre" },
    { id: "apellido", nombre: "Apellido" },
  ];

  const usuariosActivos = useMemo(
    () => usuarios.filter((usuario) => usuario.borrado === false),
    [usuarios],
  );

  const usuariosInactivos = useMemo(
    () => usuarios.filter((usuario) => usuario.borrado === true),
    [usuarios],
  );

  const usuariosActivosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      usuariosActivos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [usuariosActivos, busqueda, ordenCampo, ordenDireccion]);

  const usuariosInactivosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      usuariosInactivos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [usuariosInactivos, busqueda, ordenCampo, ordenDireccion]);

  const usuariosActivosPaginados = useMemo(() => {
    return usuariosActivosFiltradosOrdenados.slice(
      firstActivos,
      firstActivos + rows,
    );
  }, [usuariosActivosFiltradosOrdenados, firstActivos, rows]);

  const usuariosInactivosPaginados = useMemo(() => {
    return usuariosInactivosFiltradosOrdenados.slice(
      firstInactivos,
      firstInactivos + rows,
    );
  }, [usuariosInactivosFiltradosOrdenados, firstInactivos, rows]);

  useEffect(() => {
    setFirstActivos(0);
    setFirstInactivos(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const acciones = {
    accion,
    setNombreRol,
    setNombreDepartamento,
    setIdInstitucion,
    setIdDepartamento,
    setIdRol,
    setNombreInstitucion,
    setCedula: setCedulaUsuario,
    setNombre: setNombreUsuario,
    setApellido: setApellidoUsuario,
    setCorreo: setCorreoUsuario,
    setClaveUno: setClaveUnoUsuario,
    setClaveDos: setClaveDosUsuario,
    setMensaje: setMensajeValidar,
    setAutorizar,
    setAccion,
  };

  const datosUsuario = {
    cedula: cedulaUsuario,
    nombre: nombreUsuario,
    apellido: apellidoUsuario,
    correo: correoUsuario,
    nombreInstitucion: nombreInstitucion,
    nombreDepartamento: nombreDepartamento,
    claveUno: claveUnoUsuario,
    claveDos: claveDosUsuario,
    mensaje: mensajeValidar,
    nombreRol: nombreRol,
    idUsuario: idUsuario,
    idRol: idRol,
    idDepartamento: idDepartamento,
    idInstitucion: idInstitucion,
    autorizar: autorizar,
  };

  const validaciones = {
    validarCedula: validarCedulaUsuario,
    setValidarCedula: setValidarCedulaUsuario,
    validarNombre: validarNombreUsuario,
    setValidarNombre: setValidarNombreUsuario,
    validarApellido: validarApellidoUsuario,
    setValidarApellido: setValidarApellidoUsuario,
    validarCorreo: validarCorreoUsuario,
    setValidarCorreo: setValidarCorreoUsuario,
    validarClave: validarClaveUsuario,
    setValidarClave: setValidarClaveUsuario,
  };

  return (
    <>
      <ModalUsuarios
        acciones={acciones}
        datosUsuario={datosUsuario}
        validaciones={validaciones}
      />
      <SectionMain indice={1}>
        <SectionPrimary nombre={"Representación usuarios"}>
          <LeyendaUsuarios />
        </SectionPrimary>

        <SectionTertiary
          nombre={"Gestión usuarios activos"}
          first={firstActivos}
          setFirst={setFirstActivos}
          rows={rows}
          setRows={setRows}
          datos={usuariosActivosFiltradosOrdenados}
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
          <Div className={`flex flex-col gap-2`}>
            {usuarios?.length === 0 && loading ? (
              <Loader titulo="Cargando usuarios..." />
            ) : (
              <>
                {usuariosActivosPaginados?.length !== 0 ? (
                  usuariosActivosPaginados.map((usuario, index) => {
                    const departamentoActual =
                      usuario?.MiembrosDepartamentos?.[0];

                    return (
                      <FichaUsuario
                        key={usuario.id}
                        usuario={usuario}
                        index={index}
                      >
                        <ButtonToggleDetallesUsuario
                          expanded={expanded}
                          usuario={usuario}
                          setExpanded={setExpanded}
                        />

                        {expanded === usuario.id && (
                          <ListadoUsuarios
                            usuario={usuario}
                            departamentoActual={departamentoActual}
                            abrirModal={abrirModal}
                            setAccion={setAccion}
                            setNombreUsuario={setNombreUsuario}
                            setNombreDepartamento={setNombreDepartamento}
                            setIdDepartamento={setIdDepartamento}
                            setIdUsuario={setIdUsuario}
                            setIdRol={setIdRol}
                            setNombreRol={setNombreRol}
                          />
                        )}
                      </FichaUsuario>
                    );
                  })
                ) : (
                  <EstadoMsjVacio
                    dato={usuariosActivosFiltradosOrdenados}
                    loading={loading}
                  />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>

        {usuariosInactivos?.length !== 0 && (
          <SectionQuaternary
            nombre={"Gestión usuarios inactivos"}
            first={firstInactivos}
            setFirst={setFirstInactivos}
            rows={rows}
            setRows={setRows}
            datos={usuariosInactivosFiltradosOrdenados}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenDireccion={ordenDireccion}
            setOrdenDireccion={setOrdenDireccion}
            opcionesOrden={opcionesOrden}
            estatus={1}
          >
            <Div className={`flex flex-col gap-2`}>
              {usuarios?.length === 0 && loading ? (
                <Loader titulo="Cargando usuarios..." />
              ) : (
                <>
                  {usuariosInactivosPaginados?.length !== 0 ? (
                    usuariosInactivosPaginados.map((usuario, index) => {
                      const departamentoActual =
                        usuario?.MiembrosDepartamentos?.[0];

                      return (
                        <FichaUsuario
                          key={usuario.id}
                          usuario={usuario}
                          index={index}
                        >
                          <ButtonToggleDetallesUsuario
                            expanded={expanded}
                            usuario={usuario}
                            setExpanded={setExpanded}
                          />

                          {expanded === usuario.id && (
                            <ListadoUsuarios
                              usuario={usuario}
                              departamentoActual={departamentoActual}
                              abrirModal={abrirModal}
                              setAccion={setAccion}
                              setNombreUsuario={setNombreUsuario}
                              setNombreDepartamento={setNombreDepartamento}
                              setIdDepartamento={setIdDepartamento}
                              setIdUsuario={setIdUsuario}
                              setIdRol={setIdRol}
                              setNombreRol={setNombreRol}
                            />
                          )}
                        </FichaUsuario>
                      );
                    })
                  ) : (
                    <EstadoMsjVacio
                      dato={usuariosInactivosFiltradosOrdenados}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </Div>
          </SectionQuaternary>
        )}
      </SectionMain>
    </>
  );
}
