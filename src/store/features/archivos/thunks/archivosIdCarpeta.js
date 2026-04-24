import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los archivos por el idCarpeta con manejo de errores
export const fetchArchivosIdCarpeta = createAsyncThunk(
  "archivos/fetchArchivosIdCarpeta",
  async (idCarpeta, { rejectWithValue }) => {
    try {
      if (!idCarpeta) {
        return rejectWithValue("ID de carpeta no proporcionado");
      }

      const response = await axios.get(`/api/archivos/archivos-id-carpeta`, {
        params: { idCarpeta },
      });

      return response.data.archivos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los archivos por id carpeta",
      );
    }
  },
);
