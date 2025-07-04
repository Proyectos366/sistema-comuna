"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SelectOpcion from "../SelectOpcion";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";
import InputCheckBox from "../InputCheckBox";
import InputCedula from "../inputs/InputCedula";
import InputNombre from "../inputs/InputNombre";
import InputEdad from "../inputs/InputEdad";
import InputTelefono from "../inputs/InputTelefono";
import InputCorreo from "../inputs/InputCorreo";
import MostarMsjEnModal from "../MostrarMsjEnModal";

export default function FormEditarVocero({
  idComuna,
  idConsejo,
  cambiarSeleccionComuna,
  cambiarSeleccionConsejo,
  toggleGenero,
  nombre,
  setNombre,
  nombreDos,
  setNombreDos,
  apellido,
  setApellido,
  apellidoDos,
  setApellidoDos,
  cedula,
  setCedula,
  genero,
  setGenero,
  edad,
  setEdad,
  telefono,
  setTelefono,
  direccion,
  setDireccion,
  correo,
  setCorreo,
  actividadLaboral,
  setActividadLaboral,
  todasComunas,
  todosConsejos,
  cargos,
  toggleCargo,
  formaciones,
  toggleFormaciones,
  seleccionarCargo,
  setSeleccionarCargo,
  seleccionarFormacion,
  setSeleccionarFormacion,
  abrirModal,
  limpiarCampos,
  setNombreComuna,
  setNombreConsejoComunal,
  validarCedula,
  setValidarCedula,
  validarNombre,
  setValidarNombre,
  validarNombreDos,
  setValidarNombreDos,
  validarApellido,
  setValidarApellido,
  validarApellidoDos,
  setValidarApellidoDos,
  validarEdad,
  setValidarEdad,
  validarTelefono,
  setValidarTelefono,
  validarCorreo,
  setValidarCorreo,
  validarActividadLaboral,
  setValidarActividadLaboral,
  setDatos,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  const [consejosFiltrados, setConsejosFiltrados] = useState([]);

  useEffect(() => {
    if (cedula) {
      const cedulaSinPuntos = String(cedula).replaceAll(".", "");
      const esValido = /^[1-9][0-9]{6,7}$/.test(cedulaSinPuntos);
      setValidarCedula?.(esValido);

      const formateada = cedulaSinPuntos.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setCedula?.(formateada);
    }

    if (edad) {
      const edadLimpia = String(edad).replace(/\D/g, ""); // remueve letras, por si acaso
      const esEdadValida = /^(1[89]|[2-9][0-9])$/.test(edadLimpia); // entre 18 y 99 años

      setValidarEdad?.(esEdadValida);
      setEdad?.(Number(edadLimpia));
    }

    if (nombre) {
      const nombreLimpio = String(nombre).trim();
      const esNombreValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(nombreLimpio);

      setValidarNombre?.(esNombreValido);
      setNombre?.(nombreLimpio);
    }

    if (nombreDos) {
      const nombreDosLimpio = String(nombreDos).trim();
      const esnombreDosValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(
        nombreDosLimpio
      );

      setValidarNombreDos?.(esnombreDosValido);
      setNombreDos?.(nombreDosLimpio);
    }

    if (apellido) {
      const apellidoLimpio = String(apellido).trim();
      const esApellidoValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(apellidoLimpio);

      setValidarApellido?.(esApellidoValido);
      setApellido?.(apellidoLimpio);
    }

    if (apellidoDos) {
      const apellidoDosLimpio = String(apellidoDos).trim();
      const esApellidoDosValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(
        apellidoDosLimpio
      );

      setValidarApellidoDos?.(esApellidoDosValido);
      setApellidoDos?.(apellidoDosLimpio);
    }

    if (telefono) {
      const telefonoSinCaracter = String(telefono)
        .replace(/\D/g, "")
        .slice(0, 11); // solo números, máx. 11 dígitos

      const esValido = /^0(2\d{2}|41\d)\d{7}$/.test(telefonoSinCaracter); // ejemplo: 04141234567
      setValidarTelefono?.(esValido);

      let formateada = telefonoSinCaracter;

      if (formateada.length <= 4) {
        // Solo código de área
        formateada = formateada;
      } else if (formateada.length <= 7) {
        formateada = `${formateada.slice(0, 4)}-${formateada.slice(4)}`;
      } else if (formateada.length <= 9) {
        formateada = `${formateada.slice(0, 4)}-${formateada.slice(
          4,
          7
        )}.${formateada.slice(7)}`;
      } else {
        formateada = `${formateada.slice(0, 4)}-${formateada.slice(
          4,
          7
        )}.${formateada.slice(7, 9)}.${formateada.slice(9, 11)}`;
      }

      setTelefono?.(formateada);
    }

    if (correo) {
      const correoStr = String(correo);
      const esValido =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          correoStr
        );

      setValidarCorreo?.(esValido);

      if (esValido) {
        // Solo modifica el correo si es válido, por ejemplo removiendo puntos del nombre de usuario
        const [user, domain] = correoStr.split("@");
        const userSinPuntos = user.replaceAll(".", "");
        const correoFormateado = `${userSinPuntos}@${domain}`;
        setCorreo?.(correoFormateado);
      } else {
        // Si es inválido, mantén el original (o puedes manejarlo como prefieras)
        setCorreo?.(correoStr);
      }
    }

    if (actividadLaboral) {
      const actividadLaboralLimpio = String(actividadLaboral).trim();
      const esActividadLaboralValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(
        actividadLaboralLimpio
      );

      setValidarActividadLaboral?.(esActividadLaboralValido);
      setActividadLaboral?.(actividadLaboralLimpio);
    }
  }, [
    cedula,
    edad,
    nombre,
    nombreDos,
    apellido,
    apellidoDos,
    genero,
    telefono,
    correo,
    actividadLaboral,
  ]);

  useEffect(() => {
    if (idComuna) {
      const filtrados = todosConsejos.filter(
        (consejo) => consejo.id_comuna === idComuna
      );
      setConsejosFiltrados(filtrados);
    } else {
      setConsejosFiltrados([]);
    }
  }, [idComuna, todosConsejos]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="overflow-y-auto h-[390px] no-scrollbar space-y-2 px-1">
        <SelectOpcion
          idOpcion={idComuna}
          nombre="Comuna"
          handleChange={cambiarSeleccionComuna}
          opciones={todasComunas}
          seleccione="Seleccione una comuna"
          setNombre={setNombreComuna}
          setDatos={setDatos}
          indice={1}
        />

        {idComuna && consejosFiltrados.length > 0 && (
          <SelectOpcion
            idOpcion={idConsejo}
            nombre="Consejo Comunal"
            handleChange={cambiarSeleccionConsejo}
            opciones={consejosFiltrados}
            seleccione="Seleccione un consejo"
            setNombre={setNombreConsejoComunal}
            indice={1}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between space-x-4">
          <LabelInput nombre={"Cedula"}>
            <InputCedula
              type={"text"}
              indice={"cedula"}
              value={cedula}
              setValue={setCedula}
              validarCedula={validarCedula}
              setValidarCedula={setValidarCedula}
            />
          </LabelInput>

          <LabelInput nombre={"Edad"}>
            <InputEdad
              type={"text"}
              indice={"edad"}
              value={edad}
              setValue={setEdad}
              validarEdad={validarEdad}
              setValidarEdad={setValidarEdad}
            />
          </LabelInput>
        </div>

        <div className="flex flex-col sm:flex-row space-x-4">
          <LabelInput nombre={"Primer nombre"}>
            <InputNombre
              type={"text"}
              indice={"nombre"}
              value={nombre}
              setValue={setNombre}
              validarNombre={validarNombre}
              setValidarNombre={setValidarNombre}
            />
          </LabelInput>

          <LabelInput nombre={"Segundo nombre"}>
            <InputNombre
              type={"text"}
              indice={"nombre"}
              value={nombreDos}
              setValue={setNombreDos}
              validarNombre={validarNombreDos}
              setValidarNombre={setValidarNombreDos}
            />
          </LabelInput>
        </div>

        <div className="flex flex-col sm:flex-row space-x-4">
          <LabelInput nombre={"Primer apellido"}>
            <InputNombre
              type={"text"}
              indice={"nombre"}
              value={apellido}
              setValue={setApellido}
              validarNombre={validarApellido}
              setValidarNombre={setValidarApellido}
            />
          </LabelInput>

          <LabelInput nombre={"Segundo Apellido"}>
            <InputNombre
              type={"text"}
              indice={"nombre"}
              value={apellidoDos}
              setValue={setApellidoDos}
              validarNombre={validarApellidoDos}
              setValidarNombre={setValidarApellidoDos}
            />
          </LabelInput>
        </div>

        <div className="flex flex-col sm:flex-row space-x-4">
          <div className="flex flex-col w-full">
            <span>Genero</span>
            <div className="flex justify-evenly border border-gray-300 py-2 rounded-md hover:border hover:border-[#082158]">
              {[
                { id: 1, nombre: "Masculino" },
                { id: 2, nombre: "Femenino" },
              ].map((opcion) => (
                <InputCheckBox
                  altura={5}
                  key={opcion.id}
                  id={opcion.id}
                  nombre={opcion.nombre}
                  isChecked={genero === opcion.id} // Solo una opción puede estar seleccionada
                  onToggle={() => toggleGenero(opcion.id)} // Cambia el estado con la opción elegida
                />
              ))}
            </div>
          </div>

          <LabelInput nombre={"Telefono"}>
            <InputTelefono
              type={"text"}
              indice={"telefono"}
              value={telefono}
              setValue={setTelefono}
              validarTelefono={validarTelefono}
              setValidarTelefono={setValidarTelefono}
            />
          </LabelInput>
        </div>

        <div className="flex flex-col sm:flex-row space-x-4">
          <LabelInput nombre={"Correo"}>
            <InputCorreo
              type="text"
              indice="email"
              value={correo}
              setValue={setCorreo}
              validarCorreo={validarCorreo}
              setValidarCorreo={setValidarCorreo}
            />
          </LabelInput>

          <LabelInput nombre={"Actividad laboral"}>
            <InputNombre
              type="text"
              indice="nombre"
              value={actividadLaboral}
              setValue={setActividadLaboral}
              validarNombre={validarActividadLaboral}
              setValidarNombre={setValidarActividadLaboral}
            />
          </LabelInput>
        </div>

        <div className="">
          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        </div>

        <div className="flex space-x-4">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={editar}
            nombre={"Guardar cambios"}
            campos={{
              cedula,
              nombre,
              apellido,
              edad,
              genero,
              telefono,
              correo,
              actividadLaboral,
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setCedula,
                setEdad,
                setNombre,
                setNombreDos,
                setApellido,
                setApellidoDos,
                setGenero,
                setTelefono,
                setCorreo,
                setActividadLaboral,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              cedula,
              edad,
              nombre,
              nombreDos,
              apellido,
              apellidoDos,
              genero,
              telefono,
              correo,
              actividadLaboral,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
