import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para verificar un participante por curso o formacion dada
export const verificarParticipanteCurso = createAsyncThunk(
  "participantes/verificarParticipanteCurso",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/cursos/verificar-curso",
        data.verificarParticipante,
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
