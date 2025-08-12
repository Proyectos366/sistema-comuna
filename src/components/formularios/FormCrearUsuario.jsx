import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputNombre from "../inputs/InputNombre";
import InputCedula from "../inputs/InputCedula";
import InputCorreo from "../inputs/InputCorreo";
import SelectOpcion from "../SelectOpcion";
import InputClave from "../inputs/InputClave";
import MostrarMsj from "../MostrarMensaje";
import InputCheckBox from "../inputs/InputCheckBox";

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
  limpiarCampos,
  mostrarModal,
  mensaje,
  setMensaje,
  cambiarSeleccionDepartamento,
  cambiarSeleccionInstitucion,
  cambiarSeleccionRol,
  departamentos,
  instituciones,
  roles,
  setNombreDepartamento,
  setNombreInstitucion,
  setNombreRol,
  autorizar,
  setAutorizar,
  toggleAutorizar,
  usuarioActivo,
}) {
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
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <LabelInput nombre={"Cedula"}>
          <InputCedula
            type="text"
            indice={"cedula"}
            value={cedula}
            setValue={setCedula}
            validarCedula={validarCedula}
            setValidarCedula={setValidarCedula}
          />
        </LabelInput>

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

        <LabelInput nombre={"Nombre"}>
          <InputNombre
            type="text"
            indice="nombre"
            value={nombre}
            setValue={setNombre}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
          />
        </LabelInput>

        <LabelInput nombre={"Apellido"}>
          <InputNombre
            type={"text"}
            indice={"nombre"}
            value={apellido}
            setValue={setApellido}
            validarNombre={validarApellido}
            setValidarNombre={setValidarApellido}
          />
        </LabelInput>

        <SelectOpcion
          idOpcion={idRol}
          nombre={"Roles"}
          handleChange={cambiarSeleccionRol}
          opciones={roles}
          seleccione={"Seleccione"}
          setNombre={setNombreRol}
        />

        {usuarioActivo.id_rol === 1 && (
          <SelectOpcion
            idOpcion={idInstitucion}
            nombre={"Instituciones"}
            handleChange={cambiarSeleccionInstitucion}
            opciones={instituciones}
            seleccione={"Seleccione"}
            setNombre={setNombreInstitucion}
          />
        )}

        <SelectOpcion
          idOpcion={idDepartamento}
          nombre={"Departamentos"}
          handleChange={cambiarSeleccionDepartamento}
          opciones={departamentos}
          seleccione={"Seleccione"}
          setNombre={setNombreDepartamento}
        />

        <LabelInput nombre={"Clave"}>
          <InputClave
            type={"password"}
            value={claveUno}
            onChange={leyendoClave1}
            indice={"clave"}
            validarClave={validarClave}
            setValidarClave={setValidarClave}
          />
        </LabelInput>

        <LabelInput nombre={"Clave confirmar"}>
          <InputClave
            type={"password"}
            value={claveDos}
            onChange={leyendoClave2}
            indice={"clave2"}
          />
        </LabelInput>

        <div className="flex flex-col w-full">
          <span className="text-gray-700 font-medium">Autorizar</span>
          <div className="flex justify-evenly border border-gray-300 py-2 rounded-md hover:border hover:border-[#082158]">
            {[
              { id: 1, nombre: "Si" },
              { id: 2, nombre: "No" },
            ].map((opcion) => (
              <InputCheckBox
                altura={5}
                key={opcion.id}
                id={opcion.id}
                nombre={opcion.nombre}
                isChecked={autorizar === opcion.id} // Solo una opción puede estar seleccionada
                onToggle={() => toggleAutorizar(opcion.id)} // Cambia el estado con la opción elegida
              />
            ))}
          </div>
        </div>

        {mensaje && (
          <div className="w-full mb-3">
            <MostrarMsj mensaje={mensaje} />
          </div>
        )}

        <div className="flex space-x-4">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={mostrarModal}
            nombre={"Crear"}
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

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setCedula,
                setCorreo,
                setNombre,
                setApellido,
                setClaveUno,
                setClaveDos,
                setIdRol,
                setIdInstitucion,
                setIdDepartamento,
                setAutorizar,
              });
            }}
            nombre={"Limpiar"}
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
        </div>
      </div>
    </Formulario>
  );
}
