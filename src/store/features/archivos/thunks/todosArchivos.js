import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los archivos con manejo de errores
export const fetchArchivos = createAsyncThunk(
  "archivos/fetchArchivos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/archivos/todos-archivos");
      return response.data.archivos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los archivos",
      );
    }
  },
);
