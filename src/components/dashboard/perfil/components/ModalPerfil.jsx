"use client";

import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import Modal from "@/components/modales/Modal";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";
import FormCrearImgPerfil from "@/components/formularios/FormCrearImgPerfil";
import FormEditarImgPerfil from "@/components/formularios/FormEditarImgPerfil";
import ImgPrevia from "@/components/dashboard/perfil/components/ImgPrevia";

import { cerrarModal } from "@/store/features/modal/slicesModal";
import { crearImgPerfilUsuario } from "@/store/features/usuarios/thunks/crearImgPerfilUsuario";

export default function ModalPerfil({
  imgPrevia,
  setImgPrevia,
  setFile,
  file,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const notify = (msj) => toast(msj);

  const handleCrearImgPerfil = async () => {
    try {
      const nuevaImgPerfil = {
        imagen: file,
      };

      await dispatch(
        crearImgPerfilUsuario({
          nuevaImgPerfil: nuevaImgPerfil,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal
        isVisible={mostrarConfirmar}
        onClose={() => {
          dispatch(cerrarModal("confirmar"));
        }}
        titulo={"¿Crear esta imagen de perfil?"}
      >
        <ModalDatosContenedor>
          <ImgPrevia imgPrevia={imgPrevia} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearImgPerfil}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            imgPrevia,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Cambiar imagen de perfil?"}
      >
        <ModalDatosContenedor>
          <FormEditarImgPerfil
            imgPrevia={imgPrevia}
            setImgPrevia={setImgPrevia}
            setFile={setFile}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear esta imagen de perfil?"}
      >
        <ModalDatosContenedor>
          <FormCrearImgPerfil
            imgPrevia={imgPrevia}
            setImgPrevia={setImgPrevia}
            setFile={setFile}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
