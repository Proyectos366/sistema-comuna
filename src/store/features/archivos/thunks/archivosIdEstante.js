import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los archivos por el idEstante con manejo de errores
export const fetchArchivosIdEstante = createAsyncThunk(
  "archivos/fetchArchivosIdEstante",
  async (idEstante, { rejectWithValue }) => {
    try {
      if (!idEstante) {
        return rejectWithValue("ID de estante no proporcionado");
      }

      const response = await axios.get(`/api/archivos/archivos-id-estante`, {
        params: { idEstante },
      });

      return response.data.archivos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los archivos por id estante",
      );
    }
  },
);
