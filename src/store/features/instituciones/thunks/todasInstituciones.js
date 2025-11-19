import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los instituciones con manejo de errores
export const fetchInstituciones = createAsyncThunk(
  "instituciones/fetchInstituciones",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/instituciones/todas-instituciones"
      );
      return response.data.instituciones;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener las instituciones"
      );
    }
  }
);
