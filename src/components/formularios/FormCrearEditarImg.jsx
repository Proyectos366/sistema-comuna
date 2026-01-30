import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputImagen from "@/components/inputs/InputImagen";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

export default function FormCrearEditarImg({
  imgPrevia,
  setImgVistaPrevia,
  setFile,
  crearEditar,
  limpiarCampos,
}) {
  return (
    <Formulario
      encType={"multipart/form-data"}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <DivScroll>
        <InputImagen
          imgPrevia={imgPrevia}
          setImgVistaPrevia={setImgVistaPrevia}
          setFile={setFile}
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={crearEditar}
            nombre={"Guardar"}
            campos={{
              imgPrevia,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setImgVistaPrevia });
            }}
            campos={{
              imgPrevia,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
