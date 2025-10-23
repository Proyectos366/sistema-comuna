import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los departamentos con manejo de errores
export const fetchDepartamentos = createAsyncThunk(
  "departamentos/fetchDepartamentos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/departamentos/todos-departamentos"
      );
      return response.data.departamentos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los departamentos"
      );
    }
  }
);
