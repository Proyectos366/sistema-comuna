import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import Input from "../inputs/Input";
import SelectOpcion from "../SelectOpcion";

export default function FormEditarNovedad({
  idDepartamento,
  setIdDepartamento,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  departamentos,
  cambiarSeleccionDepartamento,
  limpiarCampos,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <SelectOpcion
          idOpcion={idDepartamento}
          nombre={"Departamentos"}
          handleChange={cambiarSeleccionDepartamento}
          opciones={departamentos}
          seleccione={"Seleccione"}
          indice={1}
        />

        <LabelInput nombre={"Nombre"}>
          <Input
            type={"text"}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </LabelInput>

        <LabelInput nombre={"Descripción"}>
          <Input
            type={"text"}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </LabelInput>

        <div className="">
          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        </div>

        <div className="flex space-x-4">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={editar}
            nombre={"Guardar cambios"}
            campos={{
              nombre,
              descripcion,
              idDepartamento,
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setIdDepartamento,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
              descripcion,
              idDepartamento,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
