import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las carpetas por miembro departamento con manejo de errores
export const fetchCarpetasDepartamentoMiembro = createAsyncThunk(
  "carpetas/fetchCarpetasDepartamentoMiembro",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/carpetas/carpetas-departamento-miembro",
      );
      return response.data.carpetas;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los carpetas",
      );
    }
  },
);
