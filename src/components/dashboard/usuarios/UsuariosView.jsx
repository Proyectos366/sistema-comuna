"use client";

import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
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
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { fetchUsuarios } from "@/store/features/usuarios/thunks/todosUsuarios";
import { abrirModal } from "@/store/features/modal/slicesModal";

export default function UsuariosView() {
  const dispatch = useDispatch();
  const { usuarios } = useSelector((state) => state.usuarios);

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

  const [first, setFirst] = useState(0);
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

  const usuariosFiltradosYOrdenados = useMemo(() => {
    return filtrarOrdenar(
      usuarios,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [usuarios, busqueda, ordenCampo, ordenDireccion]);

  const usuariosPaginados = useMemo(() => {
    return usuariosFiltradosYOrdenados.slice(first, first + rows);
  }, [usuariosFiltradosYOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
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
      <SectionMain>
        <SectionPrimary nombre={"Representación usuarios"}>
          <LeyendaUsuarios />
        </SectionPrimary>

        <SectionTertiary
          nombre={"Gestión usuarios"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          <BuscadorOrdenador
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenDireccion={ordenDireccion}
            setOrdenDireccion={setOrdenDireccion}
            opcionesOrden={opcionesOrden}
          />

          <Div className={`flex flex-col gap-2`}>
            {usuarios?.length === 0 ? (
              <Div className="flex items-center gap-4">
                <BounceLoader color="#082158" size={50} /> Cargando usuarios...
              </Div>
            ) : (
              <>
                {usuariosPaginados?.length !== 0 ? (
                  usuariosPaginados.map((usuario, index) => {
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
                  <Div
                    className={`text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold`}
                  >
                    No hay coincidencias...
                  </Div>
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
              totalRecords={usuariosFiltradosYOrdenados.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
