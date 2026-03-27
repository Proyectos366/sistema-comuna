import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las carpetas con manejo de errores
export const fetchCarpetas = createAsyncThunk(
  "carpetas/fetchCarpetas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/carpetas/todas-carpetas");
      return response.data.carpetas;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los carpetas",
      );
    }
  },
);
