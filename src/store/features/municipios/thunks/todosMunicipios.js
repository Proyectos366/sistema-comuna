import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los estados con manejo de errores
export const fetchEstados = createAsyncThunk(
  "estados/fetchEstados",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/estados/todos-estados");
      return response.data.estados;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los estados"
      );
    }
  }
);
