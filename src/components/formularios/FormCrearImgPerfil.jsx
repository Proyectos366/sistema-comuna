import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputImagen from "@/components/inputs/InputImagen";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { limpiarCampos } from "@/utils/limpiarForm";

export default function FormCrearImgPerfil({
  imgPrevia,
  setImgPrevia,
  setFile,
}) {
  const dispatch = useDispatch();

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
          setImgVistaPrevia={setImgPrevia}
          setFile={setFile}
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(abrirModal("confirmar"));
              dispatch(cerrarModal("crear"));
            }}
            nombre={"Guardar"}
            campos={{
              imgPrevia,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setImgPrevia });
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
