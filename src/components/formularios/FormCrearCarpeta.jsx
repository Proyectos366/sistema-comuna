import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputNombreEstante from "@/components/inputs/InputNombreEstante";
import InputNombreSinValidar from "@/components/inputs/InputNombreSinValidar";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionCabecera } from "@/utils/dashboard/cambiarSeleccionCabecera";
import { cambiarSeleccionNivel } from "@/utils/dashboard/cambiarSeleccionNivel";
import { cambiarSeleccionSeccion } from "@/utils/dashboard/cambiarSeleccionSeccion";
import { generarItems } from "@/utils/generarItems";

export default function FormCrearCarpeta({
  acciones,
  datosCarpeta,
  validaciones,
}) {
  const dispatch = useDispatch();

  const {
    setNombre,
    setDescripcion,
    setAlias,
    setNivel,
    setSeccion,
    setCabecera,
  } = acciones;

  const {
    idEstante,
    nombre,
    descripcion,
    alias,
    nivel,
    seccion,
    cabecera,
    nivelEstante,
    seccionEstante,
  } = datosCarpeta;

  const {
    validarNombre,
    setValidarNombre,
    validarAlias,
    setValidarAlias,
    validarniveles,
    setValidarniveles,
    validarSecciones,
    setValidarSecciones,
  } = validaciones;

  const nivelFinal = cabecera == 1 || cabecera == "1" ? 0 : nivel;
  const seccionFinal = cabecera == 1 || cabecera == "1" ? 0 : seccion;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <DivScroll>
        <InputNombreSinValidar
          value={nombre}
          setValue={setNombre}
          nombre={"Nombre"}
          placeholder={"carpeta marrón n° 001"}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />

        <SelectOpcion
          idOpcion={cabecera}
          nombre={"Cabecera"}
          handleChange={(e) => {
            cambiarSeleccionCabecera(e, setCabecera);
          }}
          opciones={[
            { id: "1", nombre: "Si" },
            { id: "2", nombre: "No" },
          ]}
          seleccione={"Seleccione"}
        />

        {cabecera !== "1" && (
          <>
            <SelectOpcion
              idOpcion={nivel}
              nombre={"Niveles"}
              handleChange={(e) => {
                cambiarSeleccionNivel(e, setNivel);
              }}
              opciones={generarItems(nivelEstante)}
              seleccione={"Seleccione"}
            />

            <SelectOpcion
              idOpcion={seccion}
              nombre={"Secciones"}
              handleChange={(e) => {
                cambiarSeleccionSeccion(e, setSeccion);
              }}
              opciones={generarItems(seccionEstante)}
              seleccione={"Seleccione"}
            />
          </>
        )}

        <InputNombreEstante
          value={alias}
          setValue={setAlias}
          validarEstante={validarAlias}
          setValidarEstante={setValidarAlias}
          nombre={"Alias"}
          indice="carpeta2"
          placeholder={"carpeta marron no 001"}
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
            campos={{
              nombre,
              descripcion,
              alias,
              nivelFinal,
              seccionFinal,
              cabecera,
              idEstante,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setAlias,
                setNivel,
                setSeccion,
                setCabecera,
              });
            }}
            campos={{
              nombre,
              descripcion,
              alias,
              nivel,
              seccion,
              cabecera,
              idEstante,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
