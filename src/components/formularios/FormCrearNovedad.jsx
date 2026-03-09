import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";
import { limpiarCampos } from "@/utils/limpiarForm";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { useDispatch } from "react-redux";

export default function FormCrearNovedad({
  acciones,
            datosNovedad,
            validaciones,
}) {
  // const id = usuarioActivo.id_rol === 1 ? idInstitucion : idDepartamento;
  // const setId =
  //   usuarioActivo.id_rol === 1 ? setIdInstitucion : setIdDepartamento;

  const dispatch = useDispatch();

  const { setNombre, setDescripcion } = acciones;
  const { nombre, descripcion } = datosNovedad;
  const { validarNombre, setValidarNombre } = validaciones;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <DivScroll>
        {/* {usuarioActivo.id_rol === 1 && (
          <SelectOpcion
            idOpcion={idInstitucion}
            nombre={"Instituciones"}
            handleChange={cambiarSeleccionInstitucion}
            opciones={instituciones}
            seleccione={"Seleccione"}
            setNombre={setNombreInstitucion}
            indice={1}
          />
        )}

        {usuarioActivo.id_rol !== 1 && (
          <SelectOpcion
            idOpcion={idDepartamento}
            nombre={"Departamentos"}
            handleChange={cambiarSeleccionDepartamento}
            opciones={departamentos}
            seleccione={"Seleccione"}
            setNombre={setNombreDepartamento}
            indice={1}
          />
        )}

        <SelectOpcion
          idOpcion={idPrioridad}
          nombre={"Prioridad"}
          handleChange={cambiarSeleccionPrioridad}
          opciones={[
            { id: 1, nombre: "alta" },
            { id: 2, nombre: "media" },
            { id: 3, nombre: "baja" },
          ]}
          seleccione={"Seleccione"}
          setNombre={setNombrePrioridad}
          indice={1}
        /> */}

        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
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
                    }}
                  />
        
                  <BotonLimpiarCampos
                    aceptar={() => {
                      limpiarCampos({
                        setNombre, setDescripcion
                      })
                    }}
                    campos={{
                      nombre,
                      descripcion,
                    }}
                  />
                </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
