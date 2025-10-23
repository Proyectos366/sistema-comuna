import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los usuarios con manejo de errores
export const fetchUsuarios = createAsyncThunk(
  "usuarios/fetchUsuarios",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/usuarios/todos-usuarios");
      return response.data.usuarios;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los usuarios"
      );
    }
  }
);
