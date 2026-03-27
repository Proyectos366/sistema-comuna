import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las carpetas por el idEstante con manejo de errores
export const fetchCarpetasIdEstante = createAsyncThunk(
  "carpetas/fetchCarpetasIdEstante",
  async (idEstante, { rejectWithValue }) => {
    try {
      if (!idEstante) {
        return rejectWithValue("ID de estante no proporcionado");
      }

      const response = await axios.get(`/api/carpetas/carpetas-id-estante`, {
        params: { idEstante },
      });

      return response.data.carpetas;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las carpetas por id estante",
      );
    }
  },
);
