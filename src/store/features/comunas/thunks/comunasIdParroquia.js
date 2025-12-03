import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las comunas por el idParroquia con manejo de errores
export const fetchComunasIdParroquia = createAsyncThunk(
  "comunas/fetchComunasIdParroquia",
  async (idParroquia, { rejectWithValue }) => {
    try {
      if (!idParroquia) {
        return rejectWithValue("ID de parroquia no proporcionado");
      }

      const response = await axios.get(`/api/comunas/comunas-id-parroquia`, {
        params: { idParroquia },
      });

      return response.data.comunas;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las comunas por id parroquia"
      );
    }
  }
);
