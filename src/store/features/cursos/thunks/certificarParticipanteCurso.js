import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para certificar un participante por curso o formacion dada
export const certificarParticipanteCurso = createAsyncThunk(
  "participantes/certificarParticipanteCurso",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/cursos/certificar-curso",
        data.certificarParticipante,
      );

      const participanteCursoFormacion = response.data.participantes;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));

      return participanteCursoFormacion;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
