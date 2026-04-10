import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombreSinValidar from "@/components/inputs/InputNombreSinValidar";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { textRegex } from "@/utils/regex/textRegex";
import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionCabecera } from "@/utils/dashboard/cambiarSeleccionCabecera";
import { cambiarSeleccionNivel } from "@/utils/dashboard/cambiarSeleccionNivel";
import { cambiarSeleccionSeccion } from "@/utils/dashboard/cambiarSeleccionSeccion";

import cantNiveles from "@/constants/cantNiveles";
import cantSecciones from "@/constants/cantSecciones";

export default function FormEditarCarpeta({
  acciones,
  datosCarpeta,
  validaciones,
}) {
  const dispatch = useDispatch();

  const {
    setIdCarpeta,
    setNombre,
    setDescripcion,
    setNivel,
    setSeccion,
    setCabecera,
  } = acciones;

  const { idCarpeta, nombre, descripcion, nivel, seccion, cabecera } =
    datosCarpeta;

  const {
    validarNombre,
    setValidarNombre,
    validarniveles,
    setValidarniveles,
    validarSecciones,
    setValidarSecciones,
  } = validaciones;

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = textRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);

    // Transformar niveles
    if (nivel) {
      const nivelesStr = String(nivel);
      const nivelesTransformado =
        nivelesStr.length === 1 ? `0${nivelesStr}` : nivelesStr;
      if (nivelesTransformado !== nivel) {
        setNivel(nivelesTransformado);
      }
    }

    // Transformar secciones
    if (seccion) {
      const seccionesStr = String(seccion);
      if (seccionesStr !== seccion) {
        setSeccion(seccionesStr);
      }
    }

    // Validar cabecera
    if (cabecera) {
      const cabeceraStr = cabecera ? "1" : "2";

      setCabecera(cabeceraStr);
    }
  }, [nombre, nivel, seccion, descripcion, cabecera]);

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

        {cabecera === "1" && (
          <>
            <SelectOpcion
              idOpcion={nivel}
              nombre={"Niveles"}
              handleChange={(e) => {
                cambiarSeleccionNivel(e, setNivel);
              }}
              opciones={cantNiveles}
              seleccione={"Seleccione"}
            />

            <SelectOpcion
              idOpcion={seccion}
              nombre={"Secciones"}
              handleChange={(e) => {
                cambiarSeleccionSeccion(e, setSeccion);
              }}
              opciones={cantSecciones}
              seleccione={"Seleccione"}
            />
          </>
        )}

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("editar"));
              dispatch(abrirModal("confirmarCambios"));
            }}
            nombre={"Actualizar"}
            campos={{
              nombre,
              descripcion,
              nivel,
              seccion,
              cabecera,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setNivel,
                setSeccion,
                setCabecera,
              });
            }}
            campos={{
              nombre,
              descripcion,
              nivel,
              seccion,
              cabecera,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
