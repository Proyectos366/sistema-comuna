import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los archivos por el idInstitucion con manejo de errores
export const fetchArchivosIdInstitucion = createAsyncThunk(
  "archivos/fetchArchivosIdInstitucion",
  async (idInstitucion, { rejectWithValue }) => {
    try {
      if (!idInstitucion) {
        return rejectWithValue("ID de institucion no proporcionado");
      }

      const response = await axios.get(
        `/api/archivos/archivos-id-institucion`,
        {
          params: { idInstitucion },
        },
      );

      return response.data.archivos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los archivos por id institucion",
      );
    }
  },
);
