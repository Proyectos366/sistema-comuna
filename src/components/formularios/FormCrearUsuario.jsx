"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputCedula from "@/components/inputs/InputCedula";
import InputNombre from "@/components/inputs/InputNombre";
import InputCorreo from "@/components/inputs/InputCorreo";
import InputClave from "@/components/inputs/InputClave";
import InputCheckBox from "@/components/inputs/InputCheckBox";
import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";
import MostrarMsj from "@/components/MostrarMensaje";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionRol } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionRol";
import { cambiarSeleccionInstitucion } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionInstitucion";
import { cambiarSeleccionDepartamento } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionDepartamento";
import { toggleAutorizar } from "@/components/dashboard/usuarios/funciones/toggleAutorizar";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearUsuario({
  idDepartamento,
  setIdDepartamento,
  idInstitucion,
  setIdInstitucion,
  idRol,
  setIdRol,
  cedula,
  setCedula,
  correo,
  setCorreo,
  nombre,
  setNombre,
  apellido,
  setApellido,
  claveUno,
  setClaveUno,
  claveDos,
  setClaveDos,
  validarCedula,
  setValidarCedula,
  validarCorreo,
  setValidarCorreo,
  validarNombre,
  setValidarNombre,
  validarApellido,
  setValidarApellido,
  validarClave,
  setValidarClave,
  mensaje,
  setMensaje,
  departamentos,
  instituciones,
  roles,
  setNombreDepartamento,
  setNombreInstitucion,
  setNombreRol,
  autorizar,
  setAutorizar,
  usuarioActivo,
}) {
  const dispatch = useDispatch();
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.usuarioForm,
  );

  useEffect(() => {
    if (mostrarCrear) {
      setCedula("");
      setCorreo("");
      setNombre("");
      setApellido("");
      setIdRol("");
      setIdInstitucion("");
      setIdDepartamento("");
      setClaveUno("");
      setClaveDos("");
      setAutorizar("");
      setMensaje("");
    }
  }, [reiniciarForm, mostrarCrear]);

  const leyendoClave1 = (e) => {
    const claveUnoUno = e.target.value;
    setClaveUno(claveUnoUno);
    verificarCoincidencia(claveUnoUno, claveDos);
    limiteSizeClave(claveUnoUno, claveDos);
  };

  const leyendoClave2 = (e) => {
    const claveDosDos = e.target.value;
    setClaveDos(claveDosDos);
    verificarCoincidencia(claveUno, claveDosDos);
    limiteSizeClave(claveUno, claveDosDos);
  };

  const limiteSizeClave = (clave, claveDos) => {
    if (clave && claveDos && clave === claveDos) {
      if (clave.length < 8 || claveDos.length > 16) {
        setMensaje("Clave debe ser entre 8 y 16 caracteres");
      } else if (
        (clave.length >= 8 || claveDos.length <= 16) &&
        !validarClave
      ) {
        setMensaje("Formato de clave invalido...");
      } else {
        setMensaje("");
      }
    }
  };

  const verificarCoincidencia = (clave, clave2) => {
    if (validarClave) {
      setMensaje("");
    } else {
      setMensaje("Formato clave invalido...");
    }

    if (clave !== clave2) {
      setMensaje("Claves no coinciden...");
    } else {
      setMensaje("");
    }
  };

  return (
    <Formulario onSubmit={(e) => e.preventDefault()}>
      <DivScroll>
        <InputCedula
          value={cedula}
          setValue={setCedula}
          validarCedula={validarCedula}
          setValidarCedula={setValidarCedula}
        />

        <InputCorreo
          value={correo}
          setValue={setCorreo}
          validarCorreo={validarCorreo}
          setValidarCorreo={setValidarCorreo}
        />

        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputNombre
          nombre={"Apellido"}
          value={apellido}
          setValue={setApellido}
          validarNombre={validarApellido}
          setValidarNombre={setValidarApellido}
          placeholder={"Estefania"}
        />

        <SelectOpcion
          idOpcion={idRol}
          nombre={"Roles"}
          handleChange={(e) => cambiarSeleccionRol(e, setIdRol)}
          opciones={roles}
          seleccione={"Seleccione"}
          setNombre={setNombreRol}
        />

        {usuarioActivo.id_rol === 1 && (
          <SelectOpcion
            idOpcion={idInstitucion}
            nombre={"Instituciones"}
            handleChange={(e) =>
              cambiarSeleccionInstitucion(e, setIdInstitucion)
            }
            opciones={instituciones}
            seleccione={"Seleccione"}
            setNombre={setNombreInstitucion}
          />
        )}

        <SelectOpcion
          idOpcion={idDepartamento}
          nombre={"Departamentos"}
          handleChange={(e) =>
            cambiarSeleccionDepartamento(e, setIdDepartamento)
          }
          opciones={departamentos}
          seleccione={"Seleccione"}
          setNombre={setNombreDepartamento}
        />

        <InputClave
          value={claveUno}
          onChange={leyendoClave1}
          indice={"clave"}
          validarClave={validarClave}
          setValidarClave={setValidarClave}
        />

        <InputClave
          nombre={"Clave confirmar"}
          value={claveDos}
          onChange={leyendoClave2}
          indice={"clave2"}
        />

        <Div className="flex flex-col w-full">
          <Span className="text-[#364153] font-medium">Autorizar</Span>
          <Div className="flex justify-evenly border border-[#d1d5dc] py-2 rounded-md hover:border hover:border-[#082158]">
            {[
              { id: 1, nombre: "Si" },
              { id: 2, nombre: "No" },
            ].map((opcion) => (
              <InputCheckBox
                altura={5}
                key={opcion.id}
                id={opcion.id}
                nombre={opcion.nombre}
                isChecked={autorizar === opcion.id}
                onToggle={() =>
                  toggleAutorizar(opcion.id, setAutorizar, autorizar)
                }
              />
            ))}
          </Div>
        </Div>

        {mensaje && (
          <Div className="w-full">
            <MostrarMsj mensaje={mensaje} />
          </Div>
        )}

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
            campos={{
              cedula,
              correo,
              nombre,
              apellido,
              claveUno,
              claveDos,
              idRol,
              idInstitucion:
                usuarioActivo.id_rol === 1
                  ? idInstitucion
                  : usuarioActivo.MiembrosInstitucion?.[0]?.id,
              idDepartamento,
              autorizar,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("usuarioForm"));
            }}
            campos={{
              cedula,
              correo,
              nombre,
              apellido,
              claveUno,
              claveDos,
              idRol,
              idInstitucion,
              idDepartamento,
              autorizar,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
