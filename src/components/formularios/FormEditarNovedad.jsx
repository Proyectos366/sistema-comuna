import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import MostarMsjEnModal from "@/components/mensaje/MostrarMsjEnModal";
import Input from "@/components/inputs/Input";
import InputDescripcion from "@/components/inputs/InputDescripcion";

export default function FormEditarNovedad({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  limpiarCampos,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <LabelInput nombre={"Nombre"}>
          <Input
            type={"text"}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </LabelInput>

        <LabelInput nombre={"Descripción"}>
          <InputDescripcion
            value={descripcion}
            setValue={setDescripcion}
            rows={6}
            max={500}
            autoComplete="off"
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
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
              descripcion,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
