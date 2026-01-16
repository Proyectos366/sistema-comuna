import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los participantes con manejo de errores
export const fetchParticipantesIdFormacion = createAsyncThunk(
  "participantes/fetchParticipantesIdFormacion",
  async (idFormacion, { rejectWithValue }) => {
    try {
      if (!idFormacion) {
        return rejectWithValue("ID de formacion no proporcionado");
      }

      const response = await axios.get(
        "/api/participantes/participantes-id-formacion",
        {
          params: { idFormacion },
        }
      );
      return response.data.participantes;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los participantes id formacion"
      );
    }
  }
);
