import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los participantes con manejo de errores
export const fetchParticipantes = createAsyncThunk(
  "participantes/fetchParticipantes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/participantes/todos-participantes"
      );
      return response.data.participantes;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los participantes"
      );
    }
  }
);
