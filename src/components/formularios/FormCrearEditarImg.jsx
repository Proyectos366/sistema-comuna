import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputImagen from "../inputs/InputImagen";

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
      <InputImagen
        imgPrevia={imgPrevia}
        setImgVistaPrevia={setImgVistaPrevia}
        setFile={setFile}
      />

      <div className="flex space-x-4">
        <BotonAceptarCancelar
          indice={"aceptar"}
          aceptar={crearEditar}
          nombre={"Guardar"}
          campos={{
            imgPrevia,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({
              setImgVistaPrevia,
            });
          }}
          nombre={"Limpiar"}
          campos={{
            imgPrevia,
          }}
        />
      </div>
    </Formulario>
  );
}
