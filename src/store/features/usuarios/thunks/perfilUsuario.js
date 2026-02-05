import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener el perfil del usuario
export const obtenerPerfilUsuario = createAsyncThunk(
  "usuarios/obtenerPerfilUsuario",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/usuarios/usuario-perfil");
      return response.data.usuarios;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener el perfil de usuario",
      );
    }
  },
);
