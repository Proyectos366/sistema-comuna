import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";
import { fetchComunasIdParroquia } from "@/store/features/comunas/thunks/comunasIdParroquia";
import { fetchCircuitosIdParroquia } from "@/store/features/circuitos/thunks/circuitosIdParroquia";
import { fetchConsejosIdParroquia } from "@/store/features/consejos/thunks/consejosIdParroquia";
import { fetchVocerosIdComuna } from "@/store/features/voceros/thunks/vocerosIdComuna";
import { fetchVocerosIdCircuito } from "@/store/features/voceros/thunks/vocerosIdCircuito";
import { fetchVocerosIdConsejo } from "@/store/features/voceros/thunks/vocerosIdConsejo";
import { fetchVocerosIdParroquia } from "@/store/features/voceros/thunks/vocerosIdParroquia";
import { cerrarModal } from "@/store/features/modal/slicesModal";

export const useEffectVocerosViews = ({
  idPais,
  usuarioActivo,
  idEstado,
  idMunicipio,
  idParroquia,
  opcion,
  idComuna,
  idCircuito,
  idConsejo,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (idPais && usuarioActivo?.id_rol === 1) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais, usuarioActivo]);

  useEffect(() => {
    if (idEstado) {
      dispatch(fetchMunicipiosIdEstado(idEstado));
    }
  }, [dispatch, idEstado]);

  useEffect(() => {
    if (idMunicipio) {
      dispatch(fetchParroquiasIdMunicipio(idMunicipio));
    }
  }, [dispatch, idMunicipio]);

  useEffect(() => {
    if (idParroquia) {
      if (opcion === "comuna") dispatch(fetchComunasIdParroquia(idParroquia));
      if (opcion === "circuito")
        dispatch(fetchCircuitosIdParroquia(idParroquia));
      if (opcion === "consejo") dispatch(fetchConsejosIdParroquia(idParroquia));

      if (opcion === "parroquia") {
        dispatch(fetchVocerosIdParroquia(idParroquia));
        dispatch(cerrarModal("consultar"));
      }
    }
  }, [dispatch, idParroquia, opcion]);

  useEffect(() => {
    if (idComuna) {
      dispatch(fetchVocerosIdComuna(idComuna));
      dispatch(cerrarModal("consultar"));
    }
  }, [dispatch, idComuna]);

  useEffect(() => {
    if (idCircuito) {
      dispatch(fetchVocerosIdCircuito(idCircuito));
      dispatch(cerrarModal("consultar"));
    }
  }, [dispatch, idCircuito]);

  useEffect(() => {
    if (idConsejo) {
      dispatch(fetchVocerosIdConsejo(idConsejo));
      dispatch(cerrarModal("consultar"));
    }
  }, [dispatch, idConsejo]);
};
