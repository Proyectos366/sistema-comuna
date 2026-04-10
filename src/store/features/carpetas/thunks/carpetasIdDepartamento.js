import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos las carpetas por el idDepartamento con manejo de errores
export const fetchCarpetasIdDepartamento = createAsyncThunk(
  "carpetas/fetchCarpetasIdDepartamento",
  async (idDepartamento, { rejectWithValue }) => {
    try {
      if (!idDepartamento) {
        return rejectWithValue("ID de departamento no proporcionado");
      }

      const response = await axios.get(
        `/api/carpetas/carpetas-id-departamento`,
        {
          params: { idDepartamento },
        },
      );

      return response.data.carpetas;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las carpetas por id departamento",
      );
    }
  },
);
