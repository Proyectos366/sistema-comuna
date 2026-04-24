import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los archivos por el idDepartamento con manejo de errores
export const fetchArchivosIdDepartamento = createAsyncThunk(
  "archivos/fetchArchivosIdDepartamento",
  async (idDepartamento, { rejectWithValue }) => {
    try {
      if (!idDepartamento) {
        return rejectWithValue("ID de departamento no proporcionado");
      }

      const response = await axios.get(
        `/api/archivos/archivos-id-departamento`,
        {
          params: { idDepartamento },
        },
      );

      return response.data.archivos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los archivos por id departamento",
      );
    }
  },
);
