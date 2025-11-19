import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los estados por el idPais con manejo de errores
export const fetchEstadosIdPais = createAsyncThunk(
  "estados/fetchEstadosIdPais",
  async (idPais, { rejectWithValue }) => {
    try {
      if (!idPais) {
        return rejectWithValue("ID de país no proporcionado");
      }

      const response = await axios.get(`/api/estados/estados-id-pais`, {
        params: { idPais },
      });

      return response.data.estados;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los estados por id pais"
      );
    }
  }
);
