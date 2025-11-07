import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los paises con manejo de errores
export const fetchPaises = createAsyncThunk(
  "paises/fetchPaises",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/paises/todos-paises");
      return response.data.paises;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los paises"
      );
    }
  }
);
