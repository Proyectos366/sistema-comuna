import { useSelector } from "react-redux";

import SelectOpcion from "@/components/SelectOpcion";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionConsejo } from "@/utils/dashboard/cambiarSeleccionConsejo";
import { cambiarSeleccionComunaCircuitoConsejo } from "@/utils/dashboard/cambiarSeleccionComunaCircuitoConsejo";

export default function OpcionesCrearVocero({
  acciones,
  datosVocero,
  validaciones,
  indice,
  seleccionado,
}) {
  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos } = useSelector((state) => state.consejos);

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdComuna,
    setIdCircuito,
    setIdConsejo,
    setIdVocero,

    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
    setNombreConsejo,

    setCedula,
    setNombre,
    setNombreDos,
    setApellido,
    setApellidoDos,
    setGenero,
    setEdad,
    setTelefono,
    setCorreo,
    setLaboral,
    setOpcion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
    idCircuito,
    idConsejo,
    cedula,
    opcion,
  } = datosVocero;

  const {
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
    validarLaboral,
    setValidarLaboral,
  } = validaciones;

  return (
    <>
      {usuarioActivo.id_rol === 1 ? (
        <>
          <SelectOpcion
            idOpcion={idPais}
            nombre={"Paises"}
            handleChange={(e) => {
              cambiarSeleccionPais(e, setIdPais);

              setIdEstado("");
              setIdMunicipio("");
              setIdParroquia("");
              setIdComuna("");
              setIdCircuito("");
              setIdConsejo("");
              setCedula("");
              setNombre("");
              setNombreDos("");
              setApellido("");
              setApellidoDos("");
              setGenero("");
              setEdad("");
              setTelefono("");
              setCorreo("");
              setLaboral("");
            }}
            opciones={paises}
            seleccione={"Seleccione"}
            setNombre={setNombrePais}
            indice={indice}
          />

          {idPais && (
            <SelectOpcion
              idOpcion={idEstado}
              nombre={"Estados"}
              handleChange={(e) => {
                cambiarSeleccionEstado(e, setIdEstado);

                setIdMunicipio("");
                setIdParroquia("");
                setIdComuna("");
                setIdCircuito("");
                setIdConsejo("");
                setCedula("");
                setNombre("");
                setNombreDos("");
                setApellido("");
                setApellidoDos("");
                setGenero("");
                setEdad("");
                setTelefono("");
                setCorreo("");
                setLaboral("");
              }}
              opciones={estados}
              seleccione={"Seleccione"}
              setNombre={setNombreEstado}
              indice={indice}
            />
          )}

          {idEstado && (
            <SelectOpcion
              idOpcion={idMunicipio}
              nombre={"Municipios"}
              handleChange={(e) => {
                cambiarSeleccionMunicipio(e, setIdMunicipio);

                setIdParroquia("");
                setIdComuna("");
                setIdCircuito("");
                setIdConsejo("");
                setCedula("");
                setNombre("");
                setNombreDos("");
                setApellido("");
                setApellidoDos("");
                setGenero("");
                setEdad("");
                setTelefono("");
                setCorreo("");
                setLaboral("");
              }}
              opciones={municipios}
              seleccione={"Seleccione"}
              setNombre={setNombreMunicipio}
              indice={indice}
            />
          )}

          {idMunicipio && (
            <SelectOpcion
              idOpcion={opcion}
              nombre={indice === 1 ? "Mostrar en" : "Crear en"}
              handleChange={(e) => {
                cambiarSeleccionComunaCircuitoConsejo(e, setOpcion);
              }}
              opciones={[
                { id: "comuna", nombre: "comuna" },
                { id: "circuito", nombre: "circuito" },
                { id: "consejo", nombre: "consejo" },
              ]}
              seleccione={"Seleccione"}
              indice={indice}
            />
          )}

          {idMunicipio && opcion && (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);

                setIdComuna("");
                setIdCircuito("");
                setIdConsejo("");
                setCedula("");
                setNombre("");
                setNombreDos("");
                setApellido("");
                setApellidoDos("");
                setGenero("");
                setEdad("");
                setTelefono("");
                setCorreo("");
                setLaboral("");
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
              indice={indice}
            />
          )}
        </>
      ) : (
        <>
          {seleccionado === 3 ||
          seleccionado === 4 ||
          seleccionado === 5 ||
          seleccionado === 10 ? (
            <SelectOpcion
              idOpcion={opcion}
              nombre={indice ? "Mostrar en" : "Crear en"}
              handleChange={(e) => {
                cambiarSeleccionComunaCircuitoConsejo(e, setOpcion);

                setIdParroquia("");
                setIdComuna("");
                setIdCircuito("");
                setIdConsejo("");
                setCedula("");
                setNombre("");
                setNombreDos("");
                setApellido("");
                setApellidoDos("");
                setGenero("");
                setEdad("");
                setTelefono("");
                setCorreo("");
                setLaboral("");
              }}
              opciones={[
                { id: "comuna", nombre: "comuna" },
                { id: "circuito", nombre: "circuito" },
                { id: "consejo", nombre: "Consejo comunal" },
              ]}
              seleccione={"Seleccione"}
              indice={indice}
            />
          ) : null}

          {(opcion === "comuna" ||
            opcion === "circuito" ||
            opcion === "consejo") && (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);

                setIdComuna("");
                setIdCircuito("");
                setIdConsejo("");
                setCedula("");
                setNombre("");
                setNombreDos("");
                setApellido("");
                setApellidoDos("");
                setGenero("");
                setEdad("");
                setTelefono("");
                setCorreo("");
                setLaboral("");
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
              indice={indice}
            />
          )}
        </>
      )}

      {idParroquia && (
        <SelectOpcion
          idOpcion={
            opcion === "comuna"
              ? idComuna
              : opcion === "circuito"
              ? idCircuito
              : idConsejo
          }
          nombre={
            opcion === "comuna"
              ? "Comunas"
              : opcion === "circuito"
              ? "Circuitos comunales"
              : "Consejos comunales"
          }
          handleChange={(e) => {
            if (opcion === "comuna") {
              cambiarSeleccionComuna(e, setIdComuna);
            } else if (opcion === "circuito") {
              cambiarSeleccionCircuito(e, setIdCircuito);
            } else {
              cambiarSeleccionConsejo(e, setIdConsejo);
            }

            setCedula("");
            setNombre("");
            setNombreDos("");
            setApellido("");
            setApellidoDos("");
            setGenero("");
            setEdad("");
            setTelefono("");
            setCorreo("");
            setLaboral("");
          }}
          opciones={
            opcion === "comuna"
              ? comunas
              : opcion === "circuito"
              ? circuitos
              : consejos
          }
          seleccione={"Seleccione"}
          setNombre={
            opcion === "comuna"
              ? setNombreComuna
              : opcion === "circuito"
              ? setNombreCircuito
              : setNombreConsejo
          }
          indice={indice}
        />
      )}

      {/* {opcion === "cedula" && (
        <ConsultarCedula
          cedula={cedula}
          setCedula={setCedula}
          validarCedula={validarCedula}
          setValidarCedula={setValidarCedula}
          consultarVocero={consultarVoceroCedula}
          seleccionado={seleccionado}
        />
      )} */}
    </>
  );
}
