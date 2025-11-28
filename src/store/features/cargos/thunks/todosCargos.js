import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los cargos con manejo de errores
export const fetchCargos = createAsyncThunk(
  "cargos/fetchCargos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/cargos/todos-cargos");
      return response.data.cargos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los cargos"
      );
    }
  }
);
